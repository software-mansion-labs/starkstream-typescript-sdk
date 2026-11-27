import type { DeepPartial, StarkstreamConfig } from "starkstream/types";

export function defineConfig<
  T extends Record<
    string,
    DeepPartial<Pick<StarkstreamConfig<T, R>, "runtimeConfig">>
  > = Record<string, never>,
  R extends Record<string, unknown> = Record<string, never>,
>(config: StarkstreamConfig<T, R>): StarkstreamConfig<T, R> {
  return config;
}
