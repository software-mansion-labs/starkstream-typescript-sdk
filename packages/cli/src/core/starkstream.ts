import consola from "consola";
import { createHooks } from "hookable";
import type {
  LoadConfigOptions,
  Starkstream,
  StarkstreamConfig,
  StarkstreamDynamicConfig,
} from "starkstream/types";
import { loadOptions } from "./config/loader";
import { updateStarkstreamConfig } from "./config/update";
import { scanIndexers } from "./scan";

export async function createStarkstream(
  config: StarkstreamConfig = {},
  opts: LoadConfigOptions = {},
  dev = false,
): Promise<Starkstream> {
  const options = await loadOptions(config, opts, dev);

  // Enable source map support in Node
  process.env.NODE_OPTIONS = process.env.NODE_OPTIONS
    ? `${process.env.NODE_OPTIONS} --enable-source-maps`
    : "--enable-source-maps";

  const starkstream: Starkstream = {
    options,
    indexers: [],
    hooks: createHooks(),
    close: () => starkstream.hooks.callHook("close"),
    logger: consola.withTag("starkstream"),
    async updateConfig(newConfig: StarkstreamDynamicConfig) {
      updateStarkstreamConfig(starkstream, newConfig);
    },
  };

  starkstream.hooks.addHooks(starkstream.options.hooks);

  await scanIndexers(starkstream);

  return starkstream;
}
