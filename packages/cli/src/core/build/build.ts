import { colors } from "consola/utils";
import { getRolldownConfig } from "starkstream/rolldown";
import type { Starkstream } from "starkstream/types";
import { watchDev } from "./dev";
import { buildProduction } from "./prod";

export async function build(starkstream: Starkstream) {
  const rolldownConfig = getRolldownConfig(starkstream);

  await starkstream.hooks.callHook(
    "rolldown:before",
    starkstream,
    rolldownConfig,
  );

  if (starkstream.options.rollupConfig) {
    starkstream.logger.error(
      `\n${colors.cyan("starkstream.config:")} rollupConfig is deprecated. Use rolldownConfig instead`,
    );
    process.exit(1);
  }

  return starkstream.options.dev
    ? await watchDev(starkstream, rolldownConfig)
    : await buildProduction(starkstream, rolldownConfig);
}
