import type { StarkstreamConfig } from "starkstream/types";

export const StarkstreamDefaults: StarkstreamConfig = {
  rootDir: ".",
  indexersDir: "indexers",

  runtimeConfig: {},
  hooks: {},

  buildDir: ".starkstream",

  typescript: {
    strict: false,
    generateRuntimeConfigTypes: true,
    internalPaths: false,
  },

  node: true,
  exportConditions: ["node"],
};
