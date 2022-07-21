import {AbiItem} from "web3-utils";

export const CONTRACT_ADDRESS = '0xd9dbAb3757d0327c461eFf7371b494Bb45BB016f';
export const CONTRACT_ABI: AbiItem[] = [
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
    "inputs": [],
    "stateMutability": "nonpayable",
    "type": "constructor"
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
    "name": "getStatekeeperLength",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "num",
        "type": "uint256"
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
  }
];