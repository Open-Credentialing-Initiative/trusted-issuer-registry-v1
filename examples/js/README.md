# Calling the Trusted Issuer Registry in JS

This is an example project that showcases how you can call Trusted Issuer Registry in JavaScript.

## Getting Started

1. Install dependencies: `npm install`
2. Prepare interface to Ethereum blockchain: Get an API key from [Infura](https://infura.io/) and define it in `.env`. You can also change the `registry.js`file and exchange the Infura link with a link to your node.
3. Make sure the `CONTRACT_ADDRESS` and `CONTRACT_ABI` in `config.js` is correct (have a look into the digital wallet conformance criteria.
4. Run the project: `npm run dev` and see the output in your console.