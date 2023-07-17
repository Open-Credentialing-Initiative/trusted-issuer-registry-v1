import './App.css';
import {useEffect, useState, Fragment} from 'react';
import Web3 from 'web3';
import {
  CONTRACT_ABI,
  CONTRACT_ADDRESS_GOERLI_PBL,
  CONTRACT_ADDRESS_GOERLI_STK, CONTRACT_ADDRESS_GOERLI_WLT
} from './config';
import {Contract} from "web3-eth-contract"
import {InputTypes} from "./components/InputModal";
import LoadingScreen from "./components/LoadingScreen";
import ContractSection from "./components/ContractSection";
import ProposalCard, {ProposalState, ProposalType} from "./components/ProposalCard";
import {CollectionIcon} from "@heroicons/react/outline";
import {Menu, Transition} from '@headlessui/react'
import {ChevronDownIcon} from '@heroicons/react/solid'

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ')
}

function App() {
  const [account, setAccount] = useState<string>("");
  const [statekeepers, setStatekeepers] = useState<string[]>(["No Statekeepers defined yet."]);
  const [trustedIssuers, setTrustedIssuers] = useState<string[]>(["No Trusted Issuers defined yet."]);
  const [proposals, setProposals] = useState<[]>([]);
  const [contract, setContract] = useState<Contract>();
  const [loading, setLoading] = useState(false);
  const [selectedContract, setSelectedContract] = useState(CONTRACT_ADDRESS_GOERLI_STK);

  const [web3Ref, setWeb3Ref] = useState<Web3>()

  useEffect(() => {
    initialize();
    // @ts-ignore
    if (window.ethereum && web3Ref) {
      // @ts-ignore
      window.ethereum.on('accountsChanged', async () => {
        const accounts = await web3Ref.eth.requestAccounts();
        setAccount(accounts[0]);
      })
    }
  }, [account]);

  useEffect(() => {
    initialize();
  }, [selectedContract])

  async function initialize() {
    const web3 = new Web3(Web3.givenProvider || 'http://localhost:7545');
    const accounts = await web3.eth.requestAccounts();
    const contract: Contract = new web3.eth.Contract(CONTRACT_ABI, selectedContract);
    const statekeepers = await contract.methods.getStatekeepers().call()
    const trustedIssuers = await contract.methods.getTrustedIssuers().call()

    if (selectedContract === CONTRACT_ADDRESS_GOERLI_STK) {
      const proposals = await contract.methods.getProposals().call()
      setProposals(proposals);
    }

    setWeb3Ref(web3)
    setAccount(accounts[0]);
    setStatekeepers(statekeepers);
    setTrustedIssuers(trustedIssuers);
    setContract(contract as any);
  }

  async function addTrustedIssuer(address: string) {
    if (contract) {
      try {
        setLoading(true);
        await contract.methods.addTrustedIssuer(address).send({from: account});
        setLoading(false);
        const trustedIssuers = await contract.methods.getTrustedIssuers().call()
        setTrustedIssuers(trustedIssuers);
      } catch (err) {
        console.log(err);
        setLoading(false);
      }
    }
  }

  async function removeTrustedIssuer(did: string) {
    if (contract) {
      try {
        setLoading(true);
        await contract.methods.removeTrustedIssuer(did).send({from: account});
        const trustedIssuers = await contract.methods.getTrustedIssuers().call()
        setTrustedIssuers(trustedIssuers);
        setLoading(false);
      } catch (err) {
        console.log(err);
        setLoading(false);
      }
    }
  }

  async function proposeStatekeeperAddition(address: string) {
    if (contract) {
      try {
        setLoading(true);
        await contract.methods.createProposal(ProposalType.ADD_STATEKEEPER, address, 0, 0).send({from: account});
        setLoading(false);
        const proposals = await contract.methods.getProposals().call()
        setProposals(proposals);
      } catch (err) {
        console.log(err);
        setLoading(false);
      }
    }
  }

  async function proposeStatekeeperDeletion(address: string) {
    if (contract) {
      try {
        setLoading(true);
        await contract.methods.createProposal(ProposalType.REMOVE_STATEKEEPER, address, 0, 0).send({from: account});
        setLoading(false);
        const proposals = await contract.methods.getProposals().call()
        setProposals(proposals);
      } catch (err) {
        console.log(err);
        setLoading(false);
      }
    }
  }

  async function vote(proposalId: number, yea: boolean) {
    if (contract) {
      try {
        setLoading(true);
        await contract.methods.vote(proposalId, yea).send({from: account});
        setLoading(false);
        const proposals = await contract.methods.getProposals().call()
        setProposals(proposals);
      } catch (err) {
        console.log(err);
        setLoading(false);
      }
    }
  }

  async function addStatekeeper(address: string) {
    if (contract) {
      try {
        setLoading(true);
        await contract.methods.addStatekeeper(address).send({from: account});
        setLoading(false);
        const statekeepers = await contract.methods.getStatekeepers().call()
        setStatekeepers(statekeepers);
      } catch (err) {
        console.log(err);
        setLoading(false);
      }
    }
  }

  async function removeStatekeeper(address: string) {
    if (contract) {
      try {
        setLoading(true);
        await contract.methods.removeStatekeeper(address).send({from: account});
        setLoading(false);
        const statekeepers = await contract.methods.getStatekeepers().call()
        setStatekeepers(statekeepers);
      } catch (err) {
        console.log(err);
        setLoading(false);
      }
    }
  }

  async function enforceProposal(proposalId: number) {
    if (contract) {
      try {
        setLoading(true);
        await contract.methods.enforceProposal(proposalId).send({from: account});
        setLoading(false);
        const proposals = await contract.methods.getProposals().call()
        const statekeepers = await contract.methods.getStatekeepers().call()
        setProposals(proposals);
        setStatekeepers(statekeepers);
      } catch (err) {
        console.log(err);
        setLoading(false);
      }
    }
  }

  return (
    <div className="flex-col flex">
      <header className="bg-[#09427d]">
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" aria-label="Top">
          <div className="w-full py-6 flex items-center justify-between border-b border-indigo-500 lg:border-none">
            <div className="flex items-center">
              <a href="#">
                <img
                  className="h-9 w-auto"
                  src="https://images.squarespace-cdn.com/content/v1/611d0b2d86e03a029cd4c0dc/c3ea2a92-79a5-4bfe-bed6-64529221c00c/OCI+Full+Icon2.png?format=1500w"
                  alt=""
                />
              </a>
            </div>
            <div className="flex items-center space-x-4">
              <span
                className="inline-flex items-center px-3 py-0.5 ml-1 rounded-full text-sm truncate font-medium bg-white text-indigo-600">
                <span
                  className={"absolute w-3 h-3 " + (account ? "bg-green-500" : "bg-orange-400") + " border-1 rounded-full animate-pulse"}/>
                <p className="ml-5">{account ? account : "Waiting for Wallet"}</p>
               </span>
              <Menu as="div" className="relative inline-block text-left">
                <div>
                  <Menu.Button
                    className="inline-flex items-center px-3 py-0.5 ml-1 rounded-full text-sm truncate font-medium bg-white text-indigo-600">
                    {(() => {
                      switch (selectedContract) {
                        case CONTRACT_ADDRESS_GOERLI_STK:
                          return "STK-INT (Goerli)"
                          break;
                        case CONTRACT_ADDRESS_GOERLI_WLT:
                          return "WLT-INT (Goerli)"
                          break;
                        case CONTRACT_ADDRESS_GOERLI_PBL:
                          return "PBL-INT (Goerli)"
                          break;
                        default:
                          return "Unknown contract"
                      }
                    })()}
                    <ChevronDownIcon className="-mr-1 ml-2 h-5 w-5" aria-hidden="true"/>
                  </Menu.Button>
                </div>

                <Transition
                  as={Fragment}
                  enter="transition ease-out duration-100"
                  enterFrom="transform opacity-0 scale-95"
                  enterTo="transform opacity-100 scale-100"
                  leave="transition ease-in duration-75"
                  leaveFrom="transform opacity-100 scale-100"
                  leaveTo="transform opacity-0 scale-95"
                >
                  <Menu.Items
                    className="origin-top-right absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none">
                    <div className="py-1">
                      <Menu.Item>
                        {({active}) => (
                          <a
                            href="#"
                            className={classNames(
                              active ? 'bg-gray-100 text-gray-900' : 'text-gray-700',
                              'block px-4 py-2 text-sm'
                            )}
                            onClick={() => setSelectedContract(CONTRACT_ADDRESS_GOERLI_STK)}
                          >
                            <div className="flex gap-2">
                              {selectedContract === CONTRACT_ADDRESS_GOERLI_STK &&
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none"
                                     viewBox="0 0 24 24"
                                     stroke="currentColor" strokeWidth="2">
                                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"/>
                                </svg>
                              }
                              <span className={selectedContract !== CONTRACT_ADDRESS_GOERLI_STK ? "pl-7" : ""}>STK-INT (Goerli)</span>
                            </div>

                          </a>
                        )}
                      </Menu.Item>
                      <Menu.Item>
                        {({active}) => (
                          <a
                            href="#"
                            className={classNames(
                              active ? 'bg-gray-100 text-gray-900' : 'text-gray-700',
                              'block px-4 py-2 text-sm'
                            )}
                            onClick={() => setSelectedContract(CONTRACT_ADDRESS_GOERLI_WLT)}
                          >
                            <div className="flex gap-2">
                              {selectedContract === CONTRACT_ADDRESS_GOERLI_WLT &&
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none"
                                     viewBox="0 0 24 24"
                                     stroke="currentColor" stroke-width="2">
                                  <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7"/>
                                </svg>
                              }
                              <span className={selectedContract !== CONTRACT_ADDRESS_GOERLI_WLT ? "pl-7" : ""}>WLT-INT (Goerli)</span>
                            </div>
                          </a>
                        )}
                      </Menu.Item>
                      <Menu.Item>
                        {({active}) => (
                          <a
                            href="#"
                            className={classNames(
                              active ? 'bg-gray-100 text-gray-900' : 'text-gray-700',
                              'block px-4 py-2 text-sm'
                            )}
                            onClick={() => setSelectedContract(CONTRACT_ADDRESS_GOERLI_PBL)}
                          >
                            <div className="flex gap-2">
                              {selectedContract === CONTRACT_ADDRESS_GOERLI_PBL &&
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none"
                                     viewBox="0 0 24 24"
                                     stroke="currentColor" stroke-width="2">
                                  <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7"/>
                                </svg>
                              }
                              <span className={selectedContract !== CONTRACT_ADDRESS_GOERLI_PBL ? "pl-7" : ""}>PBL-INT (Goerli)</span>
                            </div>
                          </a>
                        )}
                      </Menu.Item>
                    </div>
                  </Menu.Items>
                </Transition>
              </Menu>
            </div>
          </div>
        </nav>
      </header>
      <main>
        {web3Ref && <LoadingScreen open={loading} web3Provider={web3Ref}/>}
        <div className="py-6">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 flex">
            <h1 className="text-2xl font-semibold text-gray-900">OCI Trusted Issuers</h1>
          </div>

          {selectedContract === CONTRACT_ADDRESS_GOERLI_STK &&
            <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 mt-12">
              <div className="sm:flex sm:items-center">
                <div className="sm:flex-auto">
                  <h1 className="text-xl font-semibold text-gray-900">Proposals</h1>
                  <p className="mt-2 text-sm text-gray-700">
                    A list of proposals to be voted on.
                  </p>
                  {
                    proposals.filter(p => p[6] == ProposalState.IN_PROGRESS).length > 0
                      ?
                      <div className="grid grid-flow-row-dense grid-cols-3 gap-7 py-6">
                        {proposals.map((proposal, id) => {
                          if (proposal[6] == ProposalState.IN_PROGRESS) {
                            return (
                              <ul role="list">
                                <ProposalCard
                                  proposalId={id}
                                  proposalType={proposal[0]}
                                  proposalState={proposal[6]}
                                  address={proposal[1]}
                                  yeas={proposal[4]}
                                  nays={proposal[5]}
                                  newRate={proposal[3]}
                                  newRateType={proposal[2]}
                                  voteFunc={vote}
                                  enforceFunc={enforceProposal}
                                  currentAccount={account}
                                  contract={contract}
                                />
                              </ul>
                            )
                          }
                        })
                        }
                      </div>
                      :
                      <div
                        className="mt-5 relative block w-full border-2 border-gray-300 border-dashed rounded-lg p-12 text-center focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                        <CollectionIcon className="mx-auto h-12 w-12 text-gray-400 stroke-1"/>
                        <span
                          className="mt-2 block text-sm font-medium text-gray-900"> No open proposals to vote on. </span>
                      </div>
                  }
                </div>
              </div>
            </div>
          }
          {selectedContract === CONTRACT_ADDRESS_GOERLI_STK &&
            <ContractSection
              inputType={InputTypes.ADDRESS} title={"Statekeepers"}
              description={"A list of all the Statekeepers."}
              buttonText="Propose Statekeeper" deleteText={"Propose Deletion"} entries={statekeepers}
              modalTitle={"Create a proposal for a new statekeeper."}
              modalExampleInput={"0x00000..."} modalButtonText={"Propose Address"}
              addAction={proposeStatekeeperAddition} removeAction={proposeStatekeeperDeletion}
            />
          }
          {selectedContract === CONTRACT_ADDRESS_GOERLI_WLT &&
            <ContractSection
              inputType={InputTypes.ADDRESS} title={"Statekeepers"}
              description={"A list of all the Statekeepers."}
              buttonText="Add Statekeeper" deleteText={"Delete"} entries={statekeepers}
              modalTitle={"Add a new statekeeper."}
              modalExampleInput={"0x00000..."} modalButtonText={"Add Address"}
              addAction={addStatekeeper} removeAction={removeStatekeeper}
            />
          }
          <ContractSection
            inputType={InputTypes.DID} title={"Trusted Issuers"}
            description={"A list of all Trusted Issuers"}
            buttonText="Add Trusted Issuer" deleteText={"Delete"} entries={trustedIssuers}
            modalTitle={"Enter a new DID of a Trusted Issuer"}
            modalExampleInput={"did:ethr:..."} modalButtonText={"Add DID"} addAction={addTrustedIssuer}
            removeAction={removeTrustedIssuer}
          />
        </div>
      </main>
    </div>
  )
}

export default App;
