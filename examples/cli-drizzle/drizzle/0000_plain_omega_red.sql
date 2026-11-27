CREATE TABLE IF NOT EXISTS "starknet_usdc_transfers" (
	"_id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"number" bigint,
	"hash" text
);
