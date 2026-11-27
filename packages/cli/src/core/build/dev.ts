import { watch } from "chokidar";
import defu from "defu";
import { join } from "pathe";
import { debounce } from "perfect-debounce";
import * as rolldown from "rolldown";
import type { Starkstream } from "starkstream/types";
import { formatRolldownError } from "./error";

export async function watchDev(
  starkstream: Starkstream,
  rolldownConfig: rolldown.RolldownOptions,
) {
  let rolldownWatcher: rolldown.RolldownWatcher;
  async function load() {
    starkstream.logger.start("Setting up a dev server");
    if (rolldownWatcher) {
      await rolldownWatcher.close();
    }
    rolldownWatcher = startRolldownWatcher(starkstream, rolldownConfig);
  }
  const reload = debounce(async () => await load());

  const watchPatterns = getWatchPatterns(starkstream);

  const watchReloadEvents = new Set(["add", "addDir", "unlink", "unlinkDir"]);
  const reloadWatcher = watch(watchPatterns, { ignoreInitial: true }).on(
    "all",
    async (event) => {
      if (watchReloadEvents.has(event)) {
        await reload();
      }
    },
  );

  starkstream.hooks.hook("close", () => {
    rolldownWatcher.close();
    reloadWatcher.close();
  });

  starkstream.hooks.hook("rolldown:reload", async () => await reload());

  await load();
}

function startRolldownWatcher(
  starkstream: Starkstream,
  rolldownConfig: rolldown.RolldownOptions,
) {
  const ignorePatterns = getIgnorePatterns(starkstream);
  const watcher = rolldown.watch(
    defu(rolldownConfig, {
      watch: {
        exclude: ignorePatterns,
        ...((starkstream.options.watchOptions ?? {}) as rolldown.WatchOptions),
      },
    }),
  );
  let start: number;

  watcher.on("event", async (event) => {
    switch (event.code) {
      // The watcher is (re)starting
      case "START": {
        await starkstream.hooks.callHook("dev:restart");
        return;
      }

      // Building an individual bundle
      case "BUNDLE_START": {
        start = Date.now();
        return;
      }

      // Finished building all bundles
      case "END": {
        starkstream.hooks.callHook("compiled", starkstream);
        starkstream.logger.success(
          "Indexers built",
          start ? `in ${Date.now() - start} ms` : "",
        );
        await starkstream.hooks.callHook("dev:reload");
        return;
      }

      // Encountered an error while bundling
      case "ERROR": {
        starkstream.logger.error(formatRolldownError(event.error));
      }
    }
  });
  return watcher;
}

const getWatchPatterns = (starkstream: Starkstream) => [
  join(starkstream.options.rootDir, "indexers"),
];

const getIgnorePatterns = (starkstream: Starkstream) => [
  "**/.starkstream/**",
  "**/.git/**",
  "**/.DS_Store",
  "**/node_modules/**",
  "**/dist/**",
  "**/.turbo/**",
  // changes to starkstream.config is handled by c12 itself so we dont need rolldown to handle this
  "**/starkstream.config?(.ts|.js|.mjs)",
];
