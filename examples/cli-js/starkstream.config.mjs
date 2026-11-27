import { defineConfig } from "starkstream/config";

export default defineConfig({
  runtimeConfig: {
    test: 123,
    check: "something",
  },
  presets: {
    dev: {
      runtimeConfig: {
        test: 999,
      },
    },
  },
});
