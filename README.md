# Trusted Issuer List in Solidity

This repository contains some explorational work on implementing a trusted issuer list for OCI in a Smart Contract. You can play around with it in [Remix](https://remix.ethereum.org/).

## Things to Try
There are still a few things to do which could improve the current implementation or event replace it:

- Abstract the removal into new function
- Check cost of transactions
- Try different approaches
    - Replace struct with only array -> maybe this is easier/ cheap
    - Maybe don't store anything -> Event-based approach?  
