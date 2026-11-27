import { resolve } from "pathe";
import type { StarkstreamOptions } from "starkstream/types";

export async function resolvePathOptions(options: StarkstreamOptions) {
  options.rootDir = resolve(options.rootDir || ".");

  for (const key of ["buildDir"] as const) {
    options[key] = resolve(options.rootDir, options[key]);
  }

  if (!options.outputDir) {
    options.outputDir = resolve(options.rootDir, ".starkstream/build");
  }
}
