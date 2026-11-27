import type { RolldownOptions } from "rolldown";
import type { Starkstream } from "./starkstream";

export interface StarkstreamHooks {
  "rolldown:before": (
    starkstream: Starkstream,
    rolldownConfig: RolldownOptions,
  ) => void;
  compiled: (starkstream: Starkstream) => void;
  "dev:restart": () => Promise<void>;
  "dev:reload": () => Promise<void>;
  "rolldown:reload": () => Promise<void>;
  restart: () => void;
  close: () => void;
}
