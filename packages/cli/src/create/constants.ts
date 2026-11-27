import { blue, green, red } from "./colors";
import type { ColorFunc, Network } from "./types";

export type NetworkDataType = {
  name: Network;
  display: string;
  color: ColorFunc;
};

export type LanguageDataType = {
  name: "typescript" | "javascript";
  display: string;
  color: ColorFunc;
};

export type StorageDataType = {
  name: "postgres" | "none";
  display: string;
  color: ColorFunc;
};

export const networks: NetworkDataType[] = [
  { name: "mainnet", display: "Mainnet", color: blue },
  { name: "sepolia", display: "Sepolia", color: green },
  { name: "other", display: "Other", color: red },
];

export const storages: StorageDataType[] = [
  { name: "postgres", display: "Postgres", color: green },
  { name: "none", display: "None", color: red },
];

export const packageVersions = {
  // Required Dependencies
  starkstream: "^2.1.0",
  "@starkstream/protocol": "^2.1.0",
  "@starkstream/starknet": "^2.1.0",
  // Storage Dependencies
  "@starkstream/plugin-drizzle": "^2.1.0",
  "@starkstream/plugin-mongo": "^2.1.0",
  "@starkstream/plugin-sqlite": "^2.1.0",
  // Postgres Dependencies
  "@electric-sql/pglite": "^0.2.17",
  "drizzle-orm": "^0.40.1",
  pg: "^8.13.1",
  "@types/pg": "^8.11.10",
  "drizzle-kit": "^0.29.0",
  // Typescript Dependencies
  typescript: "^5.6.2",
  "@types/node": "^20.5.2",
};

export const dnaUrls = {
  mainnet: "https://mainnet.starkstream.io",
  sepolia: "https://testnet.starkstream.io",
};
