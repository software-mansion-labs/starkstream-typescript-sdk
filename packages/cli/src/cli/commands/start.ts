import { spawn } from "node:child_process";
import { defineCommand } from "citty";
import { colors } from "consola/utils";
import fse from "fs-extra";
import { resolve } from "pathe";
import { checkForUnknownArgs, commonArgs } from "starkstream/common";
import { createStarkstream } from "starkstream/core";

export default defineCommand({
  meta: {
    name: "start",
    description: "Start one indexer",
  },
  args: {
    ...commonArgs,
    indexer: {
      type: "string",
      description: "The indexer to start",
      required: true,
    },
    preset: {
      type: "string",
      description: "The preset to use",
    },
  },
  async run({ args, cmd }) {
    const { indexer, preset } = args;
    const rootDir = resolve((args.dir || args._dir || ".") as string);

    await checkForUnknownArgs(args, cmd);

    const starkstream = await createStarkstream({
      rootDir,
      preset,
    });

    starkstream.logger.start(
      `Starting indexer ${indexer}${preset ? ` with preset ${preset}` : ""}`,
    );

    const outputDir = starkstream.options.outputDir || "./.starkstream/build";
    const entry = resolve(outputDir, "start.mjs");

    if (!fse.existsSync(entry)) {
      starkstream.logger.error(
        `Output directory ${outputDir} does not exist. Try building the indexer with "starkstream build" first.`,
      );
      return process.exit(1);
    }

    await starkstream.close();

    const childArgs = [
      entry,
      "start",
      "--indexer",
      indexer,
      // important: this is required to run the indexer with starkstream cli to load runtime values correctly
      "--no-standalone",
      ...(preset ? ["--preset", preset] : []),
    ];

    const childProcess = spawn("node", childArgs, {
      stdio: "inherit",
    });

    childProcess.on("close", (code, signal) => {
      console.log();
      starkstream.logger.info(
        `Indexers process exited${
          code !== null ? ` with code ${colors.red(code)}` : ""
        }`,
      );
    });
  },
});
