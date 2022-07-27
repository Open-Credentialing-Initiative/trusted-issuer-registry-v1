pragma solidity >=0.8.0 <0.9.0;

contract TrustedIssuerList {
    // Stores
    Proposal[] proposals;
    AddressStore statekeepers;
    DIDStore trustedIssuers;

    // Store for the acceptance rates of the proposals
    mapping(ProposalType => uint) neededAcceptanceRate;

    constructor() {
        statekeepers.map[msg.sender] = true;
        statekeepers.keys.push(msg.sender);

        neededAcceptanceRate[ProposalType.ADD_STATEKEEPER] = 80;
        neededAcceptanceRate[ProposalType.REMOVE_STATEKEEPER] = 80;
        neededAcceptanceRate[ProposalType.CHANGE_ACCEPTANCE_RATE] = 100;
        neededAcceptanceRate[ProposalType.RETIRE] = 100;
    }

    function createProposal(ProposalType _proposalType, address _statekeeper, uint _newRate, ProposalType _rateType) onlyStatekeepers public {
        Proposal memory proposal;
        proposal.proposalType = _proposalType;
        proposal.statekeeper = _statekeeper; // Statkeeper address if its a ADD_STATEKEEPER or REMOVE_STATEKEEPER proposal, otherwise use empty address "0x0000000000000000000000000000000000000000"
        proposal.rate = _newRate; // new acceptance rate if its a CHANGE_ACCEPTANCE_RATE proposal, otherwise use 0
        proposal.rateType = _rateType;  // proposal type you want to change if its a CHANGE_ACCEPTANCE_RATE proposal, otherwise use random proposal type
        proposal.state = State.IN_PROGRESS;
        proposals.push(proposal);
    }

    function getProposals() view public returns (Proposal[] memory allProposals) {
        return proposals;
    }

    function vote(uint _proposalId, bool _yea) public onlyStatekeepers notVotedYet(_proposalId) {
        require(proposals[_proposalId].state == State.IN_PROGRESS, "Proposal was already voted on.");
        if (_yea) {
            proposals[_proposalId].yea.push(msg.sender);
        } else {
            proposals[_proposalId].nay.push(msg.sender);
        }
    }

    // If voting is finished, this will close the voting and execute the proposal if necessary amount votes is reached.
    function enforceProposal(uint _proposalId) public onlyStatekeepers neededVotesReached(_proposalId) {
        require(proposals[_proposalId].state == State.IN_PROGRESS, "Proposal was already enforced.");
        uint needed = getNeededVotes(_proposalId);

        // We now know that enough votes (either yea or nay) have been cast.
        // Set a new default state
        proposals[_proposalId].state = State.REJECTED;

        if (proposals[_proposalId].yea.length < needed) {
            return;
        }

        // The vote was accepted by the statekeepers. Whatever the proposal type is, we will now enforce it.

        if (proposals[_proposalId].proposalType == ProposalType.ADD_STATEKEEPER) {
            proposals[_proposalId].state = State.ACCEPTED;
            addStatekeeper(proposals[_proposalId].statekeeper);
        }

        if (proposals[_proposalId].proposalType == ProposalType.REMOVE_STATEKEEPER) {
            proposals[_proposalId].state = State.ACCEPTED;
            removeStatekeeper(proposals[_proposalId].statekeeper);
        }

        if (proposals[_proposalId].proposalType == ProposalType.CHANGE_ACCEPTANCE_RATE) {
            proposals[_proposalId].state = State.ACCEPTED;
            neededAcceptanceRate[proposals[_proposalId].rateType] = proposals[_proposalId].rate;
        }

        if (proposals[_proposalId].proposalType == ProposalType.RETIRE) {
            proposals[_proposalId].state = State.ACCEPTED;
            killContract();
        }
    }

    function addStatekeeper(address _statekeeperAddress) internal {
        if (!statekeepers.map[_statekeeperAddress]) {
            statekeepers.map[_statekeeperAddress] = true;
            statekeepers.keys.push(_statekeeperAddress);
        } else {
            revert("Address is already a Statekeeper!");
        }
    }

    function removeStatekeeper(address _statekeeperAddress) internal {
        if (statekeepers.map[_statekeeperAddress]) {
            delete statekeepers.map[_statekeeperAddress];
        } else {
            revert("This address is not a Statekeeper!");
        }

        int index = -1;
        for (uint i = 0; i < statekeepers.keys.length; i++) {
            if (statekeepers.keys[i] == _statekeeperAddress) {
                index = int(i);
            }
        }

        if (index > -1) {
            // Move to be delete element to last position and then pop it out -> this prevents "gaps" in the array
            statekeepers.keys[uint(index)] = statekeepers.keys[statekeepers.keys.length - 1];
            statekeepers.keys.pop();
        } else {
            revert("This address is not a Statekeeper!");
        }
    }

    function getStatekeepers() public view returns (address[] memory) {
        return statekeepers.keys;
    }

    function addTrustedIssuer(string memory _issuerDID) public onlyStatekeepers {
        if (!trustedIssuers.map[_issuerDID]) {
            trustedIssuers.map[_issuerDID] = true;
            trustedIssuers.keys.push(_issuerDID);
        } else {
            revert("DID is already a Trusted Issuer!");
        }

    }

    function removeTrustedIssuer(string memory _issuerDID) public onlyStatekeepers {
        if (trustedIssuers.map[_issuerDID]) {
            delete trustedIssuers.map[_issuerDID];
        } else {
            revert("This DID is not a Trusted Issuer!");
        }

        int index = -1;
        // You can't compare strings in Solidity -> compare hashes
        // https://ethereum.stackexchange.com/questions/45813/compare-strings-in-solidity
        for (uint i = 0; i < trustedIssuers.keys.length; i++) {
            if (keccak256(abi.encodePacked(trustedIssuers.keys[i])) == keccak256(abi.encodePacked(_issuerDID))) {
                index = int(i);
            }
        }

        if (index > -1) {
        // Move to be delete element to last position and then pop it out -> this prevents "gaps" in the array
        trustedIssuers.keys[uint(index)] = trustedIssuers.keys[trustedIssuers.keys.length - 1];
            trustedIssuers.keys.pop();
        } else {
            revert("This DID is not a Trusted Issuer!");
        }
    }

    // This will be called by verifiers to get all trusted issuer DIDs
    function getTrustedIssuers() public view returns (string[] memory) {
        return trustedIssuers.keys;
    }

    // This removes all bytecode from the contract address
    function killContract() internal {
        selfdestruct(payable(msg.sender));
    }

    // Util functions

    function getNeededVotes(uint _proposalId) public view returns (uint neededVotes) {
        return((statekeepers.keys.length * neededAcceptanceRate[proposals[_proposalId].proposalType]) / 100);
    }

    function getStatekeeperLength() public view returns (uint num) {
        return(statekeepers.keys.length);
    }

    // Structs and Enums

    enum State { ACCEPTED, REJECTED, IN_PROGRESS }
    enum StoreTypes{ STATEKEEPERS, TRUSTEDISSUERS }

    // We can't get all keys of a map in Solidity -> we use it together with an array to get all keys
    struct AddressStore {
        mapping(address => bool) map;
        address[] keys;
    }

    // We can't get all keys of a map in Solidity -> we use it together with an array to get all keys
    struct DIDStore {
        mapping(string => bool) map; // We store string to support every type of DID. Only did:ethr? -> address type sufficient
        string[] keys;
    }

    enum ProposalType{ ADD_STATEKEEPER, REMOVE_STATEKEEPER, CHANGE_ACCEPTANCE_RATE, RETIRE }

    // Proposals have are a generic type that has fields for every possible propsal type.
    // This also means that with some proposals, a few fields will be left empty and not used at all.
    // TODO: Think of if we should just create different proposal structs so we don't have to store all the data...
    struct Proposal {
        ProposalType proposalType;
        address statekeeper;
        ProposalType rateType;
        uint rate;
        address[] yea;
        address[] nay;
        State state;
    }

    // Modifiers/ Middleware

    modifier onlyStatekeepers {
        require(statekeepers.map[msg.sender] == true, "Caller is not a statekeeper");
        _;
    }

    modifier notVotedYet(uint _proposalId) {
        bool hasVoted = false;
        for(uint i = 0; i < proposals[_proposalId].yea.length; i++){
            if (proposals[_proposalId].yea[i] == msg.sender) hasVoted = true;
        }
        for(uint i = 0; i < proposals[_proposalId].nay.length; i++){
            if (proposals[_proposalId].nay[i] == msg.sender) hasVoted = true;
        }
        require(hasVoted == false, "Caller has already voted.");
        _;
    }

    modifier neededVotesReached(uint _proposalId) {
        // This approach always rounds DOWN
        uint needed = getNeededVotes(_proposalId);
        uint votes = proposals[_proposalId].yea.length + proposals[_proposalId].nay.length;
        require(votes >= needed, "Not enough votes received yet.");
        _;
    }
}