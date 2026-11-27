import fsp from "node:fs/promises";
import fse from "fs-extra";
import type { Starkstream } from "starkstream/types";
import { prettyPath } from "../path";

export async function prepare(starkstream: Starkstream) {
  await prepareDir(starkstream.options.buildDir);
  await prepareDir(starkstream.options.outputDir);

  if (!starkstream.options.disableLogs) {
    starkstream.logger.success(
      `Output directory ${prettyPath(starkstream.options.outputDir)} cleaned`,
    );
  }
}

async function prepareDir(dir: string) {
  await fsp.mkdir(dir, { recursive: true });
  await fse.emptyDir(dir);
}
