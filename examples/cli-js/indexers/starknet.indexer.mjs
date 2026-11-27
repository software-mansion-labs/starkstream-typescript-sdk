import { defineIndexer } from "@starkstream/indexer";
import { health } from "@starkstream/plugin-health";
import { StarknetStream } from "@starkstream/starknet";
import { hash } from "starknet";

export default function (config) {
  console.log(config);
  return defineIndexer(StarknetStream)({
    streamUrl: "https://mainnet.starkstream.io",
    finality: "pending",
    clientOptions: {
      channelOptions: {
        "grpc.max_send_message_length": 100_000_000,
      },
    },
    startingCursor: {
      orderKey: 1_380_000n,
    },
    plugins: [health()],
    filter: {
      events: [
        {
          address:
            "0x049d36570d4e46f48e99674bd3fcc84644ddd6b96f7c741b1562b82f9e004dc7",
          keys: [hash.getSelectorFromName("Transfer")],
          includeReceipt: true,
        },
      ],
    },
    async transform({ block: { header } }) {
      console.log("Transforming block ", header.blockNumber, header.blockHash);
    },
  });
}
