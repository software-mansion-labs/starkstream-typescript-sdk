import type { Starkstream, StarkstreamDynamicConfig } from "starkstream/types";
import { runtimeConfigResolver } from "./resolvers/runtime.resolver";

export async function updateStarkstreamConfig(
  starkstream: Starkstream,
  newConfig: StarkstreamDynamicConfig,
) {
  // applies new config values to env again during hot reload
  runtimeConfigResolver(newConfig);
  starkstream.logger.success("Starkstream config hot reloaded!");
  // we simply stop indexers and restart them with updated runtime values
  await starkstream.hooks.callHook("dev:reload");
}
