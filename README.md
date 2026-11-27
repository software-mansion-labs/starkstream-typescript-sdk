# Starkstream TypeScript SDK

Use `starkstream` to create and run Starknet indexers. The workspace also includes a [DNA client](packages/protocol) and [Starknet block and filter types](packages/starknet).

## Migrating an existing indexer

For existing EVM, EVM RPC, and Beacon Chain indexers, keep using the corresponding Apibara packages. For Starknet indexers, follow the steps below.

- Replace the `apibara` dependency and CLI command with `starkstream`. Change `@apibara/*` dependencies and imports to `@starkstream/*`, including subpaths such as `@starkstream/protocol/codec`.
- Rename `apibara.config.*` to `starkstream.config.*` and update CLI subpath imports such as `starkstream/config`. Rename branded types and functions, for example `ApibaraRuntimeConfig` to `StarkstreamRuntimeConfig` and `createApibara` to `createStarkstream`.
- Rename `APIBARA_RUNTIME_CONFIG` and `APIBARA_ALWAYS_REINDEX` to `STARKSTREAM_RUNTIME_CONFIG` and `STARKSTREAM_ALWAYS_REINDEX`. Stream authentication still uses `DNA_TOKEN`.
- Update build and type paths from `.apibara/` to `.starkstream/`. After installing the new dependencies, run `starkstream prepare` to regenerate types and `starkstream build` to rebuild the indexer.

## Getting started

This repo uses `pnpm` and `turbo`. You also need to install Protocol Buffer's `protoc`.

 - [Install pnpm](https://pnpm.io/)
 - Run `pnpm install` to get all packages
 - Run `pnpm build` to build the packages


## License

Copyright 2022 GNC Labs Limited

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
