import fse from "fs-extra";
import { basename, join } from "pathe";
import type { Starkstream } from "starkstream/types";

const INDEXER_EXTENSIONS = [".indexer.ts", ".indexer.js", ".indexer.mjs"];

export async function scanIndexers(starkstream: Starkstream) {
  starkstream.logger.debug("Scanning indexers");

  const indexersDir = join(
    starkstream.options.rootDir,
    starkstream.options.indexersDir,
  );

  if (!fse.existsSync(indexersDir)) {
    throw new Error(`Indexers directory not found: ${indexersDir}`);
  }

  starkstream.indexers = [];

  for (const file of fse.readdirSync(indexersDir)) {
    const indexerName = indexerNameFromFile(file);
    if (indexerName) {
      starkstream.indexers.push({
        name: indexerName,
        indexer: join(indexersDir, file),
      });
    }
  }

  starkstream.logger.debug(`Found ${starkstream.indexers.length} indexers`);
}

function indexerNameFromFile(file: string) {
  for (const extension of INDEXER_EXTENSIONS) {
    if (file.endsWith(extension)) {
      return basename(file, extension);
    }
  }
}
