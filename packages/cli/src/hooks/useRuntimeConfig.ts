import { ENV_INTERNAL_STARKSTREAM_PROCESSED_RUNTIME } from "starkstream/common";
import type { StarkstreamRuntimeConfig } from "starkstream/types";

export function useRuntimeConfig(): StarkstreamRuntimeConfig {
  return JSON.parse(
    process.env[ENV_INTERNAL_STARKSTREAM_PROCESSED_RUNTIME] || "{}",
  );
}
