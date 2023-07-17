pragma solidity >=0.8.0 <0.9.0;

contract TrustedIssuerList {
    // Stores
    AddressStore statekeepers;
    DIDStore trustedIssuers;

    constructor() {
        statekeepers.map[msg.sender] = true;
        statekeepers.keys.push(msg.sender);
    }

    function getStatekeepers() public view returns (address[] memory) {
        return statekeepers.keys;
    }

    function addTrustedIssuer(string memory _issuerDID) public {
        if (!trustedIssuers.map[_issuerDID]) {
            trustedIssuers.map[_issuerDID] = true;
            trustedIssuers.keys.push(_issuerDID);
        } else {
            revert("DID is already a Trusted Issuer!");
        }

    }

    function removeTrustedIssuer(string memory _issuerDID) public {
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

    // This will be called by verifiers to check for a singular DID
    function isTrustedIssuer(string memory _issuerDID) public view returns (bool) {
        return trustedIssuers.map[_issuerDID];
    }

    // This removes all bytecode from the contract address
    function killContract() public onlyStatekeepers {
        selfdestruct(payable(msg.sender));
    }


    // Structs and Enums

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

    // Modifiers/ Middleware

    modifier onlyStatekeepers {
        require(statekeepers.map[msg.sender] == true, "Caller is not a statekeeper");
        _;
    }
}