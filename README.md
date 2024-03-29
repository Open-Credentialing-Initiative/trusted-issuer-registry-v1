<div align="center">
    <img src="https://raw.githubusercontent.com/strumswell/trusted-issuer-registry/main/img/logo-light.png#gh-light-mode-only" width="360"/>
    <img src="https://raw.githubusercontent.com/strumswell/trusted-issuer-registry/main/img/logo-dark.png#gh-dark-mode-only" width="360"/>
</div>

<div align="center">

[![OCI standard](https://img.shields.io/badge/oci-standard-blue)](https://open-credentialing-initiative.github.io/Digital-Wallet-Conformance-Criteria/latest/)
[![GitHub contributors](https://badgen.net/github/contributors/Open-Credentialing-Initiative/trusted-issuer-registry)](https://GitHub.com/Open-Credentialing-Initiative/trusted-issuer-registry/graphs/contributors/)
[![GitHub issues](https://img.shields.io/github/issues/Open-Credentialing-Initiative/trusted-issuer-registry.svg)](https://GitHub.com/Open-Credentialing-Initiative/trusted-issuer-registry/issues/)
[![GitHub pull-requests](https://img.shields.io/github/issues-pr/Open-Credentialing-Initiative/trusted-issuer-registry.svg)](https://GitHub.com/Open-Credentialing-Initiative/trusted-issuer-registry/pull/)

</div>

---

## Introduction

In a trusted and regulated ecosystem, a list of trusted issuing parties is needed. For this purpose, the OCI defined a
secure, always-available, and self-governing mechanism to manage and retrieve a list of trusted Decentralized
Identifiers (DIDs) belonging to trusted issuers. These issuers are trusted with issuing ATP and identity credentials
while observing all needed regulations.

For this purpose, an open, trustless, and decentralized network that is able to run arbitrary programs was chosen: The
Ethereum network. The programs you can run on it are called "Smart Contracts". Those are self-contained programs that
can store and manipulate their state.

This repository contains code and documentation for a trusted issuer registry smart contract and a frontend that
connects to it.

## Goals

The chosen approach aims to enforce the following policies:

- Always available: Calling the trusted issuer list is an integral part while verifying ATP or identity credentials, so
  it should be always available.
- Trustless: The architecture and the execution of the trusted issuer registry should not be owned and controlled by a
  single entity.
- Transparent: The code, state, and executions of the trusted issuer registry should be transparent to all parties in
  the ecosystem.
- Auditability: It should be possible to retrieve a previous state of the trusted issuer registry.
- Security: Changes to the trusted issuer registry should only be made by trusted entities. For this, a governance
  protocol is defined which relies on strong cryptography enforce by the Ethereum network.

## Architecture

The smart contract containing the trusted issuer registry is deployed to the Ethereum blockchain and acts as a backend.
Its state and methods can be accessed via an Ethereum node, e.g., an OCI-owned one, that exposes all needed RPC methods
or a service like [Infura](https://infura.io/).

The following two sections will go into more detail on what both the smart contract and the frontend do and how they
work.

![](./img/dark-architecture.png#gh-dark-mode-only)
![](./img/light-architecture.png##gh-light-mode-only)

### Smart Contract

The main goal of the smart contract is to store and manage the list of trusted issuers under the terms of a governance
protocol. A governance protocol is needed to make sure that only trusted entities can:

- Change the list of trusted issuers
- Vote on the list of entities that can change the list of trusted issuers

The trusted entities that can manage the trusted issuer list are called "Statekeepers". Those can do the following:

- Add/ remove a trusted issuer DID (no voting required)
- Create a voting proposal to add/ remove a Statekeepers (80% approval of all Statekeepers needed)
- Create a voting proposal to change approval rates (100% approval of all Statekeepers needed)
- Vote for proposals (yea or nay)
- Enforce a voting proposal if enough Statekeepers approved it

If a voting proposal got enough approvals, a Statekeeper can instruct the smart contract to enforce the proposal. This
could be adding/ removing a trusted issuer DID or a Statekeeper from the contract state.

### Frontend

The frontend is an easy-to-use web application that connects to the Smart Contract. Its purpose is to allow Statekeepers
to easily add/ remove trusted issuer DIDs, create proposals, and vote on proposals in an easily digestible GUI.

![frontend](./img/frontend.png)

It is a React app that uses web3.js to connect to an Ethereum wallet in the form of MetaMask. MetaMask is the bridge
between the frontend and the smart contract on the Ethereum network and allows to retrieve or modify the state of the
contract. Modifications happen in the form of transactions to the smart contract that are signed and send via MetaMask
in a user-friendly way to the Ethereum blockchain.

MetaMask keeps track of all your Ethereum accounts, their transactions, and has a direct connection to the Ethereum
blockchain. OCI Statekeepers are obligated to use a so-called hardware wallet in combination with MetaMask. In this
case, a physical device stores the private keys of your Ethereum accounts and also signs transactions. In this mode,
MetaMask only forwards your signed transactions to the Ethereum blockchain. This a needed security measure to prevent
the leaking of private keys with which potential rouge actors could illegally modify the trusted issuer list.

The officially hosted frontends can be found here:

- [OCI Trusted Issuer Registry Frontend](https://trusted-issuers.vercel.app/)

## Deployments

The trusted issuer registry smart contract is deployed to the Ethereum blockchain. The following table contains all
deployments of the smart contract and their intended use cases.

| Environment | Network | Contract Address                                                                                                             | Governance | Use Case                                                                                                                            |
|-------------|---------|------------------------------------------------------------------------------------------------------------------------------|------------|-------------------------------------------------------------------------------------------------------------------------------------|
| TBD         | Mainnet | TBD                                                                                                                          | Yes        | Production deployment                                                                                                               |
| STK-INT     | Goerli  | [0xDfC7aCC61c532350a562018d627c6fe6aBBca5e8](https://goerli.etherscan.io/address/0xDfC7aCC61c532350a562018d627c6fe6aBBca5e8) | Yes        | Development - Integration testing for OCI Statekeepers. Only approved OCI Statekeepers can add/ remove trusted issuer DIDs.         |
| WLT-INT     | Goerli  | [0xfAc0eac761d4b589b471e461F247059b2f9A8B85](https://goerli.etherscan.io/address/0xfAc0eac761d4b589b471e461F247059b2f9A8B85) | Yes        | Development - Integration testing for OCI wallet providers. Only approved OCI wallet providers can add/ remove trusted issuer DIDs. |
| PBL-INT     | Goerli  | [0x2b219C6e76A8Df00Aa90155620078d56a6e3f26c](https://goerli.etherscan.io/address/0x2b219C6e76A8Df00Aa90155620078d56a6e3f26c) | No         | Development - Open integration playground without any governance. Anyone can add/ remove trusted issuer DIDs.                       |

Make sure to use the appropriate environment for your testing purposes. Access to the governed environments can be
requested in the issues section of this repository.

## Usage & Integration

To integrate the trusted issuer registry into your application, you can use many of the available web3 libraries for
various programming languages. Those include:

- [Ethers](https://docs.ethers.org/v5/) or [web3.js](https://web3js.readthedocs.io/en/v1.10.0/) for JavaScript
- [Web3j](https://docs.web3j.io/) for Java
- [web3.py](https://web3py.readthedocs.io/en/stable/) for Python
- [Nethereum](https://docs.nethereum.com/en/latest/) for .NET
- [web3](https://docs.rs/web3/latest/web3/) for Rust

To communicate with the Ethereum blockchain and the trusted issuer registry contract on it, you need the following
things:

- A connection to an Ethereum node or a hosted service like [Infura](https://infura.io/) (recommended for development
  purposes)
- The contract ABI (Application Binary Interface) that describes the contract's functions and events
- The contract address on the Ethereum (test) network

If you also intend to modify the state of the contract, e.g. adding a trusted issuer DID, you additionally need a
*funded* Ethereum account that is allowed to modify the contract state. Only statekeeper are allowed to change the
contract state on **STK-INT** and **WLT-INT**. On **PBL-INT**, any funded address can modify the contract state. To fund
your
Ethereum address, you need to send ETH to an address you control. For the Goerli test network, you can use so-called
faucets to get free testnet ETH. This is a list of well-known faucets:

- https://goerlifaucet.com/
- https://goerli-faucet.pk910.de/
- https://faucet.quicknode.com/ethereum/goerli

**Reading the contract state, e.g. for checking if a DID is a trusted issuer, is free and does not require an Ethereum
account.** The following code snippet demonstrates how to read the contract state using the Ethers library for
JavaScript:

```javascript
const {ethers} = require("ethers");
const CONTRACT_ADDRESS_GOERLI_STK = '...';
const CONTRACT_ADDRESS_GOERLI_WLT = '...';
const CONTRACT_ADDRESS_GOERLI_PBL = '...';
const CONTRACT_ABI = [...];

(async () => {
  const provider = new ethers.providers.InfuraProvider(
    "goerli",
    "INFURA_API_KEY
  );
  const contract = new ethers.Contract(CONTRACT_ADDRESS_GOERLI_PBL, CONTRACT_ABI, provider);
  const did = "did:web:oc-i.org"

  // Check for a single DID
  const isTrustedIssuer = await contract.isTrustedIssuer(did);
  console.log(`isTrustedIssuer: ${isTrustedIssuer}`);

  // Get all trusted issuer DIDs
  const trustedIssuers = await contract.getTrustedIssuers();
  console.log(`trustedIssuers: ${trustedIssuers}`);
})()
```

You can find the correct contract addresses in the Deployments section of this README and the ABI json in the contract
folder of this repository. For more information check
the [Ethers documentation](https://docs.ethers.io/v5/), [Infura guides](https://docs.infura.io/infura/tutorials/ethereum/send-a-transaction/send-a-transaction),
or your web3 libraries documentation. For easily changing the state of trusted issuers in test scenarios, we recommend
using the [OCI Statekeeper frontend](https://trusted-issuers.vercel.app/) mentioned above.

---

## 🤝 Contributing

OCI encourages contributions from OCI member and non-member companies and individuals.
Please send issues and pull requests by following our processes and agreements. Feel free to check the issues page.

**By contributing, companies and individuals certify the assertions made in
the [Developer's Certificate of Origin](https://developercertificate.org/).**

## 🏷️ Licence

By submitting their contribution to OCI, the contributor certifies that they have the right to submit it under the open
source license indicated here.

**This project is [Apache 2.0](http://www.apache.org/licenses/LICENSE-2.0)-licensed.**

You may not use this file except in compliance with the License.
You may obtain a copy of the License at

[http://www.apache.org/licenses/LICENSE-2.0](http://www.apache.org/licenses/LICENSE-2.0)

Unless required by applicable law or agreed to in writing, material
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.

Copyright © 2022 Named editors. Contributors to [OCI](https://www.oc-i.org/).