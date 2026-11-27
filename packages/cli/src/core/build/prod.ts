import { colors } from "consola/utils";
import * as rolldown from "rolldown";
import type { Starkstream } from "starkstream/types";

export async function buildProduction(
  starkstream: Starkstream,
  rolldownConfig: rolldown.RolldownOptions,
) {
  if (!starkstream.options.disableLogs) {
    starkstream.logger.start(
      `Building ${colors.cyan(starkstream.indexers.length)} indexers`,
    );
  }

  const startTime = Date.now();

  try {
    const bundle = await rolldown.rolldown(rolldownConfig);

    if (Array.isArray(rolldownConfig.output)) {
      for (const outputOptions of rolldownConfig.output) {
        await bundle.write(outputOptions);
      }
    } else if (rolldownConfig.output) {
      await bundle.write(rolldownConfig.output as rolldown.OutputOptions);
    } else {
      throw new Error("No output options specified in Rolldown config");
    }

    await bundle.close();

    const endTime = Date.now();
    const duration = endTime - startTime;

    if (!starkstream.options.disableLogs) {
      starkstream.logger.success(`Build succeeded in ${duration}ms`);
      starkstream.logger.info(
        `You can start the indexers with ${colors.cyan("starkstream start")}`,
      );
    }
  } catch (error) {
    starkstream.logger.error("Build failed", error);
    throw error;
  }
}
