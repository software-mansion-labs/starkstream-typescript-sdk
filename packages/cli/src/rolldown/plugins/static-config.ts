import virtual from "@rollup/plugin-virtual";
import type { RolldownPluginOption } from "rolldown";
import { USER_ENV_STARKSTREAM_RUNTIME_CONFIG } from "starkstream/common";
import type { Starkstream } from "starkstream/types";

export function staticConfig(starkstream: Starkstream) {
  const presetString = starkstream.options.preset ?? "";
  const presetsStringified = JSON.stringify(starkstream.options.presets ?? {});
  const runtimeConfigStringified = JSON.stringify(
    starkstream.options.runtimeConfig ?? {},
  );

  return virtual({
    "#starkstream-internal-virtual/static-config": `
    export const preset = ${presetString ? `"${presetString}"` : "undefined"};
    export const presets = ${presetsStringified};
    export const runtimeConfig = ${runtimeConfigStringified};
    export const userEnvRuntimeConfig = JSON.parse(process.env.${USER_ENV_STARKSTREAM_RUNTIME_CONFIG} ?? "{}");
    `,
  }) as RolldownPluginOption;
}
