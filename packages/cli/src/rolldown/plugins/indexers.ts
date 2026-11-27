import virtual from "@rollup/plugin-virtual";
import { hash } from "ohash";
import type { RolldownPluginOption } from "rolldown";
import type { Starkstream } from "starkstream/types";

export function indexers(starkstream: Starkstream) {
  const indexers = [...new Set(starkstream.indexers)];
  return virtual({
    "#starkstream-internal-virtual/indexers": `
    ${indexers.map((i) => `import * as _${hash(i)} from '${i.indexer}';`).join("\n")}

    export const indexers = [
      ${indexers.map((i) => `{ name: "${i.name}", indexer: _${hash(i)} }`).join(",\n")}
    ];
    `,
  }) as RolldownPluginOption;
}
