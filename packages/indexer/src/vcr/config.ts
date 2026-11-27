import type { Cursor } from "@starkstream/protocol";

export type VcrConfig = {
  cassetteDir: string;
};

export type CassetteOptions = {
  name: string;
  startingCursor: Cursor;
  endingCursor: Cursor;
};
