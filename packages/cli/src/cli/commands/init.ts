import { defineCommand } from "citty";
import { checkForUnknownArgs } from "starkstream/common";
import { initializeProject } from "starkstream/create";

export default defineCommand({
  meta: {
    name: "init",
    description: "Initialize a new Starkstream project",
  },
  args: {
    dir: {
      type: "positional",
      description: "Target path to initialize the project",
      required: true,
    },
    language: {
      type: "string",
      description:
        "Language to use: typescript, ts or javascript, js | default: `ts`",
      default: "ts",
      alias: "l",
    },
    "create-indexer": {
      type: "boolean",
      name: "create-indexer",
      default: true,
      description: "TODO",
    },
  },
  async run({ args, cmd }) {
    await checkForUnknownArgs(args, cmd);

    const { dir: targetDir, "create-indexer": createIndexer, language } = args;

    await initializeProject({
      argTargetDir: targetDir,
      argLanguage: language,
      argNoCreateIndexer: !createIndexer,
    });
  },
});
