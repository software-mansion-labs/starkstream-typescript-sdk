import type { ConsolaInstance } from "consola";
import type { Hookable } from "hookable";
import type { StarkstreamDynamicConfig, StarkstreamOptions } from "./config";
import type { StarkstreamHooks } from "./hooks";

export type IndexerDefinition = {
  // Name of the indexer.
  name: string;
  // Path to the indexer file.
  indexer: string;
};

export interface Starkstream {
  options: StarkstreamOptions;
  hooks: Hookable<StarkstreamHooks>;
  indexers: IndexerDefinition[];
  logger: ConsolaInstance;
  close: () => Promise<void>;
  updateConfig: (config: StarkstreamDynamicConfig) => void | Promise<void>;
}
