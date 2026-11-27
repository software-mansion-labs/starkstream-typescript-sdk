import {
  ENV_INTERNAL_STARKSTREAM_PRESET,
  ENV_INTERNAL_STARKSTREAM_PRESETS,
  ENV_INTERNAL_STARKSTREAM_PROCESSED_RUNTIME,
  ENV_INTERNAL_STARKSTREAM_RUNTIME,
  USER_ENV_STARKSTREAM_RUNTIME_CONFIG,
  getProcessedRuntimeConfig,
} from "starkstream/common";
import type { StarkstreamOptions } from "starkstream/types";

export function runtimeConfigResolver(options: Partial<StarkstreamOptions>) {
  try {
    const { runtimeConfig, preset, presets } = options;

    if (runtimeConfig) {
      process.env[ENV_INTERNAL_STARKSTREAM_RUNTIME] =
        JSON.stringify(runtimeConfig);
    }
    if (preset) {
      process.env[ENV_INTERNAL_STARKSTREAM_PRESET] = preset;
    }

    if (presets) {
      process.env[ENV_INTERNAL_STARKSTREAM_PRESETS] = JSON.stringify(presets);
    }

    const userEnvRuntimeConfig = JSON.parse(
      process.env[USER_ENV_STARKSTREAM_RUNTIME_CONFIG] ?? "{}",
    );

    // This is final processed runtime config that will be used by the indexer and useRuntimeConfig hook
    process.env[ENV_INTERNAL_STARKSTREAM_PROCESSED_RUNTIME] = JSON.stringify(
      getProcessedRuntimeConfig({
        preset,
        presets,
        runtimeConfig,
        userEnvRuntimeConfig,
      }),
    );
  } catch (error) {
    throw new Error("Failed to process & set runtime environment variables", {
      cause: error,
    });
  }
}
