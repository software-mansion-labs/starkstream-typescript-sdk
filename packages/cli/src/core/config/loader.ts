import { loadConfig, watchConfig } from "c12";
import { klona } from "klona/full";
import type {
  LoadConfigOptions,
  StarkstreamConfig,
  StarkstreamOptions,
} from "starkstream/types";
import { StarkstreamDefaults } from "./defaults";
import { resolvePathOptions } from "./resolvers/paths.resolver";
import { runtimeConfigResolver } from "./resolvers/runtime.resolver";

// runtimeConfigResolver handles assigning runtime values to env
const configResolvers = [resolvePathOptions, runtimeConfigResolver] as const;

export async function loadOptions(
  configOverrides: StarkstreamConfig = {},
  opts: LoadConfigOptions = {},
  dev = false,
): Promise<StarkstreamOptions> {
  const options = await _loadUserConfig(configOverrides, opts, dev);

  // Check if the runtimeConfig is serializable
  try {
    JSON.stringify(options.runtimeConfig);
  } catch (error) {
    throw new Error(
      "Non-serializable runtimeConfig. Please ensure the config is serializable.",
      { cause: error },
    );
  }

  for (const resolver of configResolvers) {
    await resolver(options);
  }

  return options;
}

async function _loadUserConfig(
  configOverrides: StarkstreamConfig = {},
  opts: LoadConfigOptions = {},
  dev = false,
): Promise<StarkstreamOptions> {
  // biome-ignore lint: noParameterAssign
  configOverrides = klona(configOverrides);

  const loadedConfig = await (opts.watch
    ? watchConfig<StarkstreamConfig>
    : loadConfig<StarkstreamConfig>)({
    name: "starkstream",
    dotenv: dev,
    cwd: configOverrides.rootDir,
    overrides: {
      ...configOverrides,
    },
    defaults: { ...StarkstreamDefaults },
    ...opts.c12,
  });

  const options = klona(loadedConfig.config) as StarkstreamOptions;

  options._config = configOverrides;
  options._c12 = loadedConfig;

  if (dev) {
    options.dev = dev;
  }

  return options;
}
