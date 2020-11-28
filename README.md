# Simple React DApp in TypeScript.
: This is a simple DApp for local Cosmos-SDK blockchain.

## How to Start
- run the `cosmwasm/wasmd` image in Docker, using `cosmojs` (https://github.com/cosmos/cosmjs). In `scripts/wasmd`, you can find `start.sh` that can start local Cosmos-SDK blockchain in a Docker.
- Clone the `Hunnie-Berlin/simple_dapp_react_typescript` repo: https://github.com/Hunnie-Berlin/simple_dapp_react_typescript.
- with `$npm start`, you can run the App.
- If you have an error `Error when opening TSX file: Cannot use JSX unless '--jsx' flag is provided`, edit `"jsx": "react"` in `tsconfig.json` manually. Sometimes it turns `"jsx": "react-jsx"` automatically and causes errors.
- You can view the page on:  http://localhost:3000

## Transaction Page
- With a mnemonic, a sender address, a recipient address, and an amount denominated in `ucosm`, you can make transaction, and get the balance and transaction ID(hash) from the screen.

## Search Page
- With the transaction ID(hash), you can get the block hash, the block height, the time stamp, the sender address, the recipient address and  the amount denominated in `ucosm` information.


