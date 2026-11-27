import { defineConfig } from "starkstream/config";

export default defineConfig({
  rolldownConfig: {
    external: [
      "@opentelemetry/exporter-jaeger",
      "@opentelemetry/winston-transport",
    ],
  },
});
