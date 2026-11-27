# `@starkstream/protocol`

This package provides a gRPC client for the [Starkstream DNA protocol](https://starkstream.io/docs/dna/protocol).

## Installation

```bash
npm add @starkstream/protocol
```

## Usage

To check the Starknet testnet stream, also install `@starkstream/starknet` and set `DNA_TOKEN` to your API key.

```ts
import { createAuthenticatedClient } from "@starkstream/protocol";
import { StarknetStream } from "@starkstream/starknet";

const client = createAuthenticatedClient(StarknetStream, "https://testnet.starkstream.io");
console.log(await client.status());
```

Use `client.streamData(request)` to iterate over stream messages.

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
