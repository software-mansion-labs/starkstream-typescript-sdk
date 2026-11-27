import { defineIndexer } from "@starkstream/indexer";
import { useLogger } from "@starkstream/indexer/plugins";
import { StarknetStream } from "@starkstream/starknet";
import type { StarkstreamRuntimeConfig } from "starkstream/types";

export default function (runtimeConfig: StarkstreamRuntimeConfig) {
  return defineIndexer(StarknetStream)({
    streamUrl: "https://mainnet.starkstream.io",
    finality: "accepted",
    startingBlock: 10_30_000n,
    filter: {
      header: "always",
    },
    async transform({ endCursor, block, context, finality }) {
      const logger = useLogger();

      logger.info(
        "Transforming block | orderKey: ",
        endCursor?.orderKey,
        " | finality: ",
        finality,
      );
    },
  });
}
