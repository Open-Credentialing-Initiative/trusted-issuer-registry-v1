import { Registry } from "./util/registry.js";
import * as config from './util/config.js';

(async () => {
  const registry = new Registry('ropsten', config.CONTRACT_ADDRESS, config.CONTRACT_ABI)
  const trustedIssuers = await registry.getTrustedIssuers()
  console.log(trustedIssuers)
})();