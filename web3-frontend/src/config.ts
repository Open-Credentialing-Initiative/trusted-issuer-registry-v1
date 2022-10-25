import {AbiItem} from "web3-utils";

export const CONTRACT_ADDRESS_GOERLI = '0xDfC7aCC61c532350a562018d627c6fe6aBBca5e8';
export const CONTRACT_ADDRESS_GOERLI_NOGOV = '0x07a79C830352ab30d7C3241F2d16db7e33D1f197';
export const CONTRACT_ABI: AbiItem[] = [
  {
    "inputs": [],
    "stateMutability": "nonpayable",
    "type": "constructor"
  },
  {
    "inputs": [
      {
        "internalType": "string",
        "name": "_issuerDID",
        "type": "string"
      }
    ],
    "name": "addTrustedIssuer",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "enum TrustedIssuerList.ProposalType",
        "name": "_proposalType",
        "type": "uint8"
      },
      {
        "internalType": "address",
        "name": "_statekeeper",
        "type": "address"
      },
      {
        "internalType": "uint256",
        "name": "_newRate",
        "type": "uint256"
      },
      {
        "internalType": "enum TrustedIssuerList.ProposalType",
        "name": "_rateType",
        "type": "uint8"
      }
    ],
    "name": "createProposal",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "_proposalId",
        "type": "uint256"
      }
    ],
    "name": "enforceProposal",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "_proposalId",
        "type": "uint256"
      }
    ],
    "name": "getNeededVotes",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "neededVotes",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "getProposals",
    "outputs": [
      {
        "components": [
          {
            "internalType": "enum TrustedIssuerList.ProposalType",
            "name": "proposalType",
            "type": "uint8"
          },
          {
            "internalType": "address",
            "name": "statekeeper",
            "type": "address"
          },
          {
            "internalType": "enum TrustedIssuerList.ProposalType",
            "name": "rateType",
            "type": "uint8"
          },
          {
            "internalType": "uint256",
            "name": "rate",
            "type": "uint256"
          },
          {
            "internalType": "address[]",
            "name": "yea",
            "type": "address[]"
          },
          {
            "internalType": "address[]",
            "name": "nay",
            "type": "address[]"
          },
          {
            "internalType": "enum TrustedIssuerList.State",
            "name": "state",
            "type": "uint8"
          }
        ],
        "internalType": "struct TrustedIssuerList.Proposal[]",
        "name": "allProposals",
        "type": "tuple[]"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "getStatekeepers",
    "outputs": [
      {
        "internalType": "address[]",
        "name": "",
        "type": "address[]"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "getTrustedIssuers",
    "outputs": [
      {
        "internalType": "string[]",
        "name": "",
        "type": "string[]"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "string",
        "name": "_issuerDID",
        "type": "string"
      }
    ],
    "name": "isTrustedIssuer",
    "outputs": [
      {
        "internalType": "bool",
        "name": "",
        "type": "bool"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "string",
        "name": "_issuerDID",
        "type": "string"
      }
    ],
    "name": "removeTrustedIssuer",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "_proposalId",
        "type": "uint256"
      },
      {
        "internalType": "bool",
        "name": "_yea",
        "type": "bool"
      }
    ],
    "name": "vote",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  }
];