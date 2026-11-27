import { spawn } from "node:child_process";
import { join } from "node:path";
import { defineCommand } from "citty";
import consola from "consola";
import { resolve } from "pathe";
import { checkForUnknownArgs, commonArgs } from "starkstream/common";
import {
  build,
  createStarkstream,
  prepare,
  writeTypes,
} from "starkstream/core";
import { runtimeDir } from "starkstream/runtime/meta";

export default defineCommand({
  meta: {
    name: "write-project-info",
    description: "Write json-encoded information about the project.",
  },
  args: {
    ...commonArgs,
  },
  async run({ args, cmd }) {
    await checkForUnknownArgs(args, cmd);

    consola.start("Generating `project-info.json`");

    const rootDir = resolve((args.dir || ".") as string);
    const starkstream = await createStarkstream({ rootDir, disableLogs: true });

    starkstream.options.entry = join(runtimeDir, "project-info.mjs");

    await prepare(starkstream);
    await writeTypes(starkstream);
    await build(starkstream);

    const childArgs = [
      resolve(
        starkstream.options.outputDir || "./.starkstream/build",
        "project-info.mjs",
      ),
      "start",
      "--build-dir",
      starkstream.options.buildDir,
    ];

    const child = spawn("node", childArgs, {
      stdio: "inherit",
    });

    child.on("close", (code) => {
      if (code === 0) {
        consola.success(
          "Project info written to `.starkstream/project-info.json`",
        );
      }
    });

    child.on("error", (error) => {
      consola.error(`Failed to write project info: ${error.message}`, error);
    });
  },
});
