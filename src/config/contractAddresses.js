/* global BigInt */
// Contract addresses — PLACEHOLDER until Testnet deployment
// After deploying, run the deploy script which overwrites this file automatically.
// Or manually replace the appId values with actual deployed App IDs.

export const CONTRACT_ADDRESSES = {
  emissionAttestation: { appId: BigInt(758853059), network: 'testnet' },
  carbonCreditToken:   { appId: BigInt(758853130), asaId: BigInt(0), network: 'testnet' }, // Need ASA ID
  offsetMarketplace:   { appId: BigInt(758853092), network: 'testnet' },
  sustainabilityNFT:   { appId: BigInt(758852975), network: 'testnet' },
};

export const EXPLORER_BASE_URL = 'https://testnet.explorer.perawallet.app';
