import { defineCommand } from "citty";
import { join, resolve } from "pathe";
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
    name: "build",
    description: "Build indexer",
  },
  args: {
    ...commonArgs,
  },
  async run({ args, cmd }) {
    await checkForUnknownArgs(args, cmd);

    const rootDir = resolve((args.dir || args._dir || ".") as string);

    const starkstream = await createStarkstream({
      rootDir,
    });

    starkstream.options.entry = join(runtimeDir, "start.mjs");

    await prepare(starkstream);
    await writeTypes(starkstream);
    await build(starkstream);
    await starkstream.close();
  },
});
