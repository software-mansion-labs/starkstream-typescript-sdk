import { defineCommand } from "citty";
import { checkForUnknownArgs } from "starkstream/common";
import { addIndexer } from "starkstream/create";

export default defineCommand({
  meta: {
    name: "add",
    description:
      "starkstream add helps you add a new indexer to your project with sensible defaults.",
  },
  args: {
    indexerId: {
      type: "positional",
      description: "Indexer ID - must be in kebab-case",
      required: false,
    },
    chain: {
      type: "string",
      description: "Blockchain (default: starknet)",
    },
    network: {
      type: "string",
      description: "Network - mainnet, sepolia, other",
    },
    storage: {
      type: "string",
      description: "Storage - postgres, none",
    },
    dnaUrl: {
      type: "string",
      description: "DNA URL - https://dna.example.com",
    },
    dir: {
      type: "string",
      description:
        "Root directory - starkstream project root where starkstream.config is located | default: current working directory",
    },
  },
  async run({ args, cmd }) {
    await checkForUnknownArgs(args, cmd);

    const { indexerId, chain, network, storage, dnaUrl, dir } = args;

    await addIndexer({
      argIndexerId: indexerId,
      argChain: chain,
      argNetwork: network,
      argStorage: storage,
      argDnaUrl: dnaUrl,
      argRootDir: dir,
    });
  },
});
