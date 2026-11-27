import { defineCommand } from "citty";
import { resolve } from "pathe";
import { checkForUnknownArgs, commonArgs } from "starkstream/common";
import { createStarkstream, writeTypes } from "starkstream/core";

export default defineCommand({
  meta: {
    name: "prepare",
    description: "Generate types for the project",
  },
  args: {
    ...commonArgs,
  },
  async run({ args, cmd }) {
    await checkForUnknownArgs(args, cmd);

    const rootDir = resolve((args.dir || ".") as string);
    const starkstream = await createStarkstream({ rootDir });
    await writeTypes(starkstream);
  },
});
