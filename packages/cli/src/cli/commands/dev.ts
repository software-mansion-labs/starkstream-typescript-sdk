import { type ChildProcess, spawn } from "node:child_process";
import { defineCommand } from "citty";
import { colors } from "consola/utils";
import { join, resolve } from "pathe";
import { checkForUnknownArgs, commonArgs } from "starkstream/common";
import {
  build,
  createStarkstream,
  prepare,
  writeTypes,
} from "starkstream/core";
import { runtimeDir } from "starkstream/runtime/meta";
import type { Starkstream } from "starkstream/types";
import { blueBright, gray } from "../../create/colors";

// Hot module reloading key regex
// for only runtimeConfig.*, presets.* keys & preset key
const hmrKeyRe = /^(runtimeConfig\.|presets\.|preset$)/;

export default defineCommand({
  meta: {
    name: "dev",
    description: "Start the development server",
  },
  args: {
    ...commonArgs,
    indexers: {
      type: "string",
      description: "Comma-separated list of indexers to run",
    },
    preset: {
      type: "string",
      description: "Preset to use",
    },
    "always-reindex": {
      type: "boolean",
      default: false,
      description:
        "Reindex the indexers from the starting block on every restart | default: `false`",
    },
  },
  async run({ args, data, cmd, rawArgs }) {
    await checkForUnknownArgs(args, cmd);

    const rootDir = resolve((args.dir || args._dir || ".") as string);

    if (args["always-reindex"]) {
      process.env.STARKSTREAM_ALWAYS_REINDEX = "true";
    }

    const selectedIndexers = new Set(
      args.indexers
        ?.split(",")
        .map((i) => i.trim())
        .sort() ?? [],
    );

    let starkstream: Starkstream;
    let childProcess: ChildProcess | undefined;

    const reload = async () => {
      if (starkstream) {
        starkstream.logger.info("Restarting dev server");
        if ("unwatch" in starkstream.options._c12) {
          await starkstream.options._c12.unwatch();
        }

        await starkstream.close();
      }

      starkstream = await createStarkstream(
        {
          rootDir,
          preset: args.preset,
        },
        {
          watch: true,
          c12: {
            async onUpdate({ getDiff, newConfig }) {
              const diff = getDiff();

              if (diff.length === 0) {
                return; // No changes
              }

              starkstream.logger.info(
                `Config updated: \n${diff.map((entry) => `  ${entry.toString()}`).join("\n")}`,
              );

              await (diff.every((e) => hmrKeyRe.test(e.key))
                ? // in hot reload we only update the runtime values & restart indexers,no build step, starkstream instance remains the same
                  starkstream.updateConfig(newConfig.config || {}) // Hot reload
                : reload()); // Full reload
            },
          },
        },
        true,
      );

      starkstream.hooks.hookOnce("restart", async () => {
        await reload();
      });

      starkstream.options.entry = join(runtimeDir, "dev.mjs");

      await prepare(starkstream);
      await writeTypes(starkstream);
      await build(starkstream);

      starkstream.hooks.hook("dev:restart", async () => {
        if (childProcess) {
          starkstream.logger.info(
            "Change detected, stopping indexers to restart",
          );
          await killProcess(childProcess);
          childProcess = undefined;
        }
      });

      starkstream.hooks.hook("dev:reload", async () => {
        if (childProcess) {
          await killProcess(childProcess);
          childProcess = undefined;
          starkstream.logger.info("Restarting indexers");
        } else {
          starkstream.logger.info("Starting indexers");

          const indexersText = starkstream.indexers
            .map((i) =>
              selectedIndexers.has(i.name) || selectedIndexers.size === 0
                ? blueBright(i.name)
                : gray(i.name),
            )
            .join(", ");
          starkstream.logger.info("Indexers:", indexersText);
        }

        const childArgs = [
          resolve(
            starkstream.options.outputDir || "./.starkstream/build",
            "dev.mjs",
          ),
          "start",
          ...(args.indexers ? ["--indexers", args.indexers] : []),
        ];

        childProcess = spawn("node", childArgs, {
          stdio: "inherit",
        });

        childProcess.on("close", (code, signal) => {
          childProcess = undefined;
          console.log();
          starkstream.logger.info(
            `Indexers process exited${
              code !== null ? ` with code ${colors.red(code)}` : ""
            }`,
          );
        });
      });
    };

    await reload();
  },
});

async function killProcess(childProcess: ChildProcess | undefined) {
  if (childProcess) {
    await new Promise((resolve) => {
      childProcess.once("exit", resolve);
      childProcess.kill();
    });
  }
}
