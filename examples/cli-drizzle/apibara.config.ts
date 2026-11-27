import { defineConfig } from "apibara/config";

export default defineConfig({
  runtimeConfig: {
    starknet: {
      startingBlock: 12_45_000,
    },
  },
  presets: {
    mainnet: {
      runtimeConfig: {
        starknet: {
          startingBlock: 12_45_000,
        },
      },
    },
    testnet: {
      runtimeConfig: {
        starknet: {
          startingBlock: 6_60_000,
        },
      },
    },
  },
});
