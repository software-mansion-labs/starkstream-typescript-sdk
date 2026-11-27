import type { IndexerWithStreamConfig } from "@starkstream/indexer";
import type { StarkstreamRuntimeConfig } from "starkstream/types";

export type IndexerConstructor =
  | ((
      runtimeConfig: StarkstreamRuntimeConfig,
    ) => IndexerWithStreamConfig<unknown, unknown, unknown>)
  | IndexerWithStreamConfig<unknown, unknown, unknown>;

export const indexers: {
  name: string;
  indexer: { default?: IndexerConstructor | undefined };
}[] = [];
