import { Registry } from "./util/registry.js";
import * as config from './util/config.js';

(async () => {
  const registry = new Registry('ropsten', config.CONTRACT_ADDRESS, config.CONTRACT_ABI)
  const trustedIssuers = await registry.getTrustedIssuers()
  const isTrustedIssuer = await registry.isTrustedIssuer("did:web:example.com")
  console.log(`All trusted issuers: ${trustedIssuers}`)
  console.log(`did:web:example.com is trusted: ${isTrustedIssuer}`)
})();