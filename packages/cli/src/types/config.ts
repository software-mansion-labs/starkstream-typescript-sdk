import type { ConsolaReporter } from "@starkstream/indexer/plugins";
import type {
  C12InputConfig,
  ConfigWatcher,
  ResolvedConfig,
  WatchConfigOptions,
} from "c12";
import type { NestedHooks } from "hookable";
import type { WatchOptions } from "rolldown";
import type { RolldownOptions } from "rolldown";
import type { DeepPartial } from "./_utils";
import type { StarkstreamHooks } from "./hooks";

export type RegisterFn = () => Promise<void>;

export type LoggerFactoryFn = ({
  indexer,
  indexers,
  preset,
}: LoggerFactoryArgs) => ConsolaReporter;

export type LoggerFactoryArgs = {
  indexer: string;
  indexers: string[];
  preset?: string;
};

/**
 * Starkstream Config type (starkstream.config)
 */
export interface StarkstreamConfig<
  T extends Record<
    string,
    DeepPartial<Pick<StarkstreamConfig<T, R>, "runtimeConfig">>
  > = Record<string, never>,
  R extends Record<string, unknown> = Record<string, never>,
> extends Partial<Omit<StarkstreamOptions<T, R>, "preset" | "presets" | "dev">>,
    C12InputConfig<StarkstreamConfig<T, R>> {
  runtimeConfig?: R;
  presets?: T;
  preset?: keyof T;
}

export type StarkstreamDynamicConfig = Pick<
  StarkstreamConfig,
  "runtimeConfig" | "preset" | "presets"
>;

/**
 * Config loader options
 */
export interface LoadConfigOptions {
  watch?: boolean;
  c12?: WatchConfigOptions;
}

export interface StarkstreamOptions<
  T extends Record<
    string,
    DeepPartial<Pick<StarkstreamConfig<T, R>, "runtimeConfig">>
  > = Record<string, never>,
  R extends Record<string, unknown> = Record<string, never>,
> {
  // Internal
  _config: StarkstreamConfig<T, R>;
  _c12:
    | ResolvedConfig<StarkstreamConfig<T, R>>
    | ConfigWatcher<StarkstreamConfig<T, R>>;

  // Presets
  presets?: T;
  preset?: keyof T;

  // General
  debug: boolean;
  runtimeConfig: R;
  rootDir: string;
  buildDir: string;
  outputDir: string;
  indexersDir: string;
  disableLogs?: boolean;

  // Dev
  dev: boolean;
  watchOptions: WatchOptions["watch"];

  // Hooks
  hooks: NestedHooks<StarkstreamHooks>;

  // Rolldown
  rolldownConfig?: Partial<RolldownOptions>;

  /**
   * @deprecated Use rolldownConfig instead. This option will be removed in future releases.
   */
  rollupConfig?: unknown;
  sourceMap?: boolean;
  entry: string;
  node: boolean;
  exportConditions?: string[];

  // Advanced
  typescript: {
    strict?: boolean;
    internalPaths?: boolean;
    generateRuntimeConfigTypes?: boolean;
  };
}
