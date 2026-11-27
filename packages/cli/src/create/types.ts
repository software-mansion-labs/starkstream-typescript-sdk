export type ColorFunc = (str: string | number) => string;

export type Language = "typescript" | "javascript";

export type Network = "mainnet" | "sepolia" | "other";

export type Storage = "postgres" | "none";

export type FileExtension = "js" | "ts" | "mjs";

export type IndexerOptions = {
  cwd: string;
  indexerFileId: string;
  indexerId: string;
  network: Network;
  storage: Storage;
  dnaUrl?: string;
  packageManager: string;
  language: Language;
  extension: FileExtension;
};

export type PkgInfo = {
  name: string;
  version?: string;
};
