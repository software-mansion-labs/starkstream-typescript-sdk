import { metrics, trace } from "@opentelemetry/api";

export function createTracer() {
  return trace.getTracer("@starkstream/indexer");
}

export function createIndexerMetrics() {
  const meter = metrics.getMeter("@starkstream/indexer");

  const currentBlockGauge = meter.createGauge("current_block", {
    description: "Current block number being processed",
    unit: "{block}",
  });

  const processedBlockCounter = meter.createCounter("processed_blocks", {
    description: "Number of blocks processed",
    unit: "{blocks}",
  });

  const reorgCounter = meter.createCounter("reorgs", {
    description: "Number of reorgs (invalidate messages) received",
    unit: "{reorgs}",
  });

  return {
    currentBlockGauge,
    processedBlockCounter,
    reorgCounter,
  };
}
