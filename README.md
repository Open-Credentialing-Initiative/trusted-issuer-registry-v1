# OCI Trusted Issuer List

In a trusted and regulated ecosystem, a list of trusted issuing parties is needed. For this purpose, the OCI defined a secure, always-available, and self-governing mechanism to manage and retrieve a list of trusted Decentralized Identifiers (DIDs) belonging to trusted issuers. These issuers are trusted with issuing ATP and identity credentials while enforcing all needed regulations.

For this purpose, an open, trustless, and decentralized network that is able to run arbitrary programs was chosen: The Ethereum network. The programs you can run on it are called "Smart Contracts". Those are self-contained programms that can store and manipulate their state.

This repository contains code and documentation for a trusted issuer registry smart contract and a frontend that connects to it.

## Goals

The chosen approach is aiming to enforce the following policies:

- Always available: Calling the trusted issuer list is an integral part while verifying ATP or identity credentials, so it should be always available.
- Trustless: The architecture and the execution of the trusted issuer registry should not be owned and controlled by a single entity.
- Transparent: The code, state, and executions of the trusted issuer registry should be transparent to all parties in the ecosystem.
- Auditability: It should be possible to retrieve a previous state of the trusted issuer registry.
- Security: Changes to the trusted issuer registry should only be made by trusted entities. For this, a governance protocol is defined which relies on strong cryptography enforce by the Ethereum network.


## Architecture

![architecture](./img/architecture.png)

The smart contract containing the trusted issuer registry is deployed to the Ethereum blockchain and acts as a backend. It's state and methods can be accessed via an Ethereum node, e.g. an OCI owned one, that exposes all needed RPC methods or a service like [Infura](https://infura.io/).

The following two sections will go into more detail on what both the smart contract and the frontend do and how they work.

### Smart Contract

The main goal of the smart contract is to store and manage the list of trusted issuers respecting a governance protocol. A governance protocol is needed to make sure that only trusted entities can:
- Change the list of trusted issuers
- Vote on the list of entities that can change the list of trusted issuers

The trusted entities that can manage the trusted issuer list are called "Statekeepers". Those can do the following:
- Add/ remove a trusted issuer DID (no voting required)
- Create a voting proposal to add/ remove a Statekeepers (80% approval of all Statekeepers needed)
- Create a voting proposal to change approval rates (100% approval of all Statekeepers needed)
- Vote for proposals (yae or nay)
- Enforce a voting proposal if enough Statekeepers approved it

If a voting proposal got enough approvals, a Statekeeper can instruct the smart contract to enforce the proposal. This could be adding/ removing a trusted issuer DID or a Statekeeper from the contract state.

A more in-depth description of the smart contract, how to modify it, and how you could deploy it yourself can be found [here](./contract/README.md).

### Frontend

The frontend is an easy-to-use web application that connects to the Smart Contract. It's purpose is to allow Statekeepers to easily add/ remove trusted issuer DIDs, create proposals, and vote on proposals in an easily digestible GUI.

