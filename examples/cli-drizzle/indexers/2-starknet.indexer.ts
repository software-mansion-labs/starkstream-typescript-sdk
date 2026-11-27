import { starknetUsdcTransfers } from "@/lib/schema";
import { drizzleStorage, useDrizzleStorage } from "@starkstream/plugin-drizzle";
import { drizzle } from "@starkstream/plugin-drizzle";
import { health } from "@starkstream/plugin-health";
import { StarknetStream } from "@starkstream/starknet";
import { hash } from "starknet";
import { defineIndexer } from "starkstream/indexer";
import { useLogger } from "starkstream/plugins";
import type { StarkstreamRuntimeConfig } from "starkstream/types";

// USDC Transfers on Starknet
export default async function (runtimeConfig: StarkstreamRuntimeConfig) {
  const {
    starknet: { startingBlock },
  } = runtimeConfig;

  console.log("[2-starknet] Starknet indexer waiting.....");

  // Simulating a API call that takes 500 ms
  await new Promise((resolve) => setTimeout(resolve, 500));

  console.log("[2-starknet] Starknet indexer done waiting.....");

  // connectionString defaults to process.env["POSTGRES_CONNECTION_STRING"](postgresql) ?? "memory://" (in memory pglite)
  const database = drizzle({
    schema: {
      starknetUsdcTransfers,
    },
  });

  return defineIndexer(StarknetStream)({
    streamUrl: "https://mainnet.starkstream.io",
    finality: "accepted",
    startingBlock: BigInt(startingBlock),
    plugins: [
      health(),
      drizzleStorage({
        db: database,
        idColumn: {
          "*": "_id",
        },
        persistState: true,
        indexerName: "starknet-usdc-transfers",
        migrate: {
          migrationsFolder: "./drizzle",
        },
      }),
    ],
    filter: {
      events: [
        {
          address:
            "0x053c91253bc9682c04929ca02ed00b3e423f6710d2ee7e0d5ebb06f3ecf368a8" as `0x${string}`,
          keys: [hash.getSelectorFromName("Transfer") as `0x${string}`],
        },
      ],
    },
    async transform({ endCursor, block, context, finality }) {
      const logger = useLogger();
      const { db } = useDrizzleStorage();
      const { events } = block;

      logger.info(
        "Transforming block | orderKey: ",
        endCursor?.orderKey,
        " | finality: ",
        finality,
      );

      const transactionHashes = new Set<string>();

      for (const event of events) {
        if (event.transactionHash) {
          transactionHashes.add(event.transactionHash);
        }
      }

      if (endCursor?.orderKey === undefined) {
        return;
      }

      const rows = Array.from(transactionHashes).map((transactionHash) => ({
        number: Number(endCursor.orderKey),
        hash: transactionHash,
      }));

      if (rows.length > 0) {
        await db.insert(starknetUsdcTransfers).values(rows);
      }
    },
  });
}
