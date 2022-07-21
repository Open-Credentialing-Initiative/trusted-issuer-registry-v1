import {useEffect, useState} from "react";
import {Contract} from "web3-eth-contract";
import {CheckIcon, LightningBoltIcon, XIcon} from "@heroicons/react/outline";

interface ProposalCardProps {
  proposalId: number;
  proposalType: ProposalType;
  proposalState: ProposalState;
  address: string;
  yeas: string[];
  nays: string[];
  currentAccount: string;
  newRate: number;
  newRateType: ProposalType;
  voteFunc: any;
  enforceFunc: any;
  contract: Contract | undefined;
}

export enum ProposalType {
  ADD_STATEKEEPER,
  REMOVE_STATEKEEPER,
  CHANGE_ACCEPTANCE_RATE,
  RETIRE
}

export enum ProposalState {
  ACCEPTED,
  REJECTED,
  IN_PROGRESS
}

export default function ProposalCard(props: ProposalCardProps) {
  const proposalId = props.proposalId
  const proposalType = props.proposalType;
  const proposalState = props.proposalState;
  const address = props.address;
  const yeas = props.yeas;
  const nays = props.nays;
  const voteFunc = props.voteFunc;
  const newRate = props.newRate;
  const newRateType = props.newRateType;
  const enforceFunc = props.enforceFunc;
  const currentAccount = props.currentAccount;
  const contract = props.contract;

  const [neededVotes, setNeededVotes] = useState<number>(-1);

  useEffect(() => {
    if (contract) {
      contract.methods.getNeededVotes(proposalId).call().then(setNeededVotes);
    }
  }, [contract])

  return (
    <li className="col-span-2 bg-white rounded-xl shadow shadow-xl divide-y divide-gray-200">
      <div className="bg-[#09427d] px-4 py-5 rounded-t-xl border-gray-200 sm:px-6">
        <h3 className="text-md leading-6 font-bold text-white">
          {proposalType == ProposalType.ADD_STATEKEEPER && "Add Statekeeper"}
          {proposalType == ProposalType.REMOVE_STATEKEEPER && "Remove Statekeeper"}
          {proposalType == ProposalType.CHANGE_ACCEPTANCE_RATE && "Change Approval Rate"}
        </h3>
        {(proposalType == ProposalType.ADD_STATEKEEPER || proposalType == ProposalType.REMOVE_STATEKEEPER) &&
          <h3 className="text-xs leading-6 font-medium text-gray-100 break-words">{address}</h3>
        }
        {proposalType == ProposalType.CHANGE_ACCEPTANCE_RATE &&
          <h3 className="text-xs leading-6 font-medium text-gray-100 break-words">
            For
            {newRateType == ProposalType.ADD_STATEKEEPER && " adding Statekeepers "}
            {newRateType == ProposalType.REMOVE_STATEKEEPER && " adding Statekeepers "}
            {newRateType == ProposalType.CHANGE_ACCEPTANCE_RATE && " changing acceptance rates "}
            {newRateType == ProposalType.RETIRE && " retiring the contract "}
            to {newRate}%
          </h3>
        }
      </div>
      <div className="w-full flex items-center justify-between p-6 space-x-6">
        <div className="flex-1 truncate">
          <div className="flex items-center space-x-3">
            <h3 className="text-gray-900 text-sm font-medium truncate">Status:</h3>
            <span
              className="flex-shrink-0 inline-block px-2 py-0.5 text-gray-800 text-xs font-medium bg-gray-100 rounded-full">
              {proposalState == ProposalState.IN_PROGRESS && "IN PROGRESS"}
              {proposalState == ProposalState.ACCEPTED && "ACCEPTED"}
              {proposalState == ProposalState.REJECTED && "REJECTED"}
            </span>
          </div>
          <div className="flex items-center space-x-3 pt-1">
            <h3 className="text-gray-900 text-sm font-medium truncate">Required Yeas:</h3>
            <span
              className="flex-shrink-0 inline-block px-2 py-0.5 text-gray-800 text-xs font-medium bg-gray-100 rounded-full">{neededVotes}</span>
          </div>
          <div className="flex items-center space-x-3 pt-4">
            <h3 className="text-gray-900 text-sm font-medium truncate">Yeas: </h3>
            <span
              className="flex-shrink-0 inline-block px-2 py-0.5 text-green-800 text-xs font-medium bg-green-100 rounded-full">{yeas.length}</span>
          </div>
          <div className="flex items-center space-x-3 pt-2">
            <h3 className="text-gray-900 text-sm font-medium truncate">Nays: </h3>
            <span
              className="flex-shrink-0 inline-block px-2 py-0.5 text-red-800 text-xs font-medium bg-red-100 rounded-full">{nays.length}</span>
          </div>
        </div>
      </div>
      <div>
        {proposalState == ProposalState.IN_PROGRESS && !yeas.includes(currentAccount) && !nays.includes(currentAccount) &&
          <div className="-mt-px flex divide-x divide-gray-200">
            <div className="w-0 flex-1 flex cursor-pointer">
              <a onClick={() => {
                voteFunc(proposalId, true)
              }}
                 className="relative -mr-px w-0 flex-1 inline-flex items-center justify-center py-4 text-sm text-gray-700 font-medium border border-transparent rounded-bl-lg hover:text-gray-500">
                <CheckIcon className='w-5 h-5 text-gray-400'/>
                <span className="ml-3">Vote Yea</span>
              </a>
            </div>
            <div className="-ml-px w-0 flex-1 flex cursor-pointer">
              <a onClick={() => {
                voteFunc(proposalId, false)
              }}
                 className="relative w-0 flex-1 inline-flex items-center justify-center py-4 text-sm text-gray-700 font-medium border border-transparent rounded-br-lg hover:text-gray-500">
                <XIcon className='w-5 h-5 text-gray-400'/>
                <span className="ml-3">Vote Nay</span>
              </a>
            </div>
          </div>
        }
        {proposalState == ProposalState.IN_PROGRESS && (yeas.includes(currentAccount) || nays.includes(currentAccount)) &&
          <div className="-mt-px flex divide-x divide-gray-200">
            <div className="w-0 flex-1 flex cursor-pointer">
              <a onClick={() => {
                enforceFunc(proposalId)
              }}
                 className="relative -mr-px w-0 flex-1 inline-flex items-center justify-center py-4 text-sm text-gray-700
                font-medium border border-transparent rounded-bl-lg hover:text-gray-500">
                <LightningBoltIcon className='w-5 h-5 text-gray-400'/>
                <span className="ml-3">Enforce Proposal</span>
              </a>
            </div>
          </div>
        }
      </div>
    </li>
  )
}
