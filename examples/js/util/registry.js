import Web3 from 'web3';
import 'dotenv/config';

export class Registry {
  web3;
  contract;

  constructor(network, contractAddress, contractAbi) {
    // Initialize web3 and set the provider to the network where the contract is deployed.
    // The provider is the interface to the Ethereum Blockchain.
    this.web3 = new Web3(
      // In production, you should not connect to infura, but directly to a trusted (OCI) node
      new Web3.providers.HttpProvider(
        `https://${network}.infura.io/v3/${process.env.INFURA_API_KEY}`
      )
    );

    // Initialize the contract with the contract address and the contract ABI.
    this.contract = new this.web3.eth.Contract(contractAbi, contractAddress)
  }

  async getTrustedIssuers() {
    return this.contract.methods.getTrustedIssuers().call()
  }

  async isTrustedIssuer(issuerDID) {
    return this.contract.methods.isTrustedIssuer(issuerDID).call()
  }
}