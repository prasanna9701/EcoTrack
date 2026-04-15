/**
 * algorandContracts.js
 *
 * Unified integration layer for all EcoTrack Algorand smart contracts.
 * Uses AlgoKit Utils + algosdk + @txnlab/use-wallet-react signer handoff.
 *
 * All functions require { activeAddress, transactionSigner } from useWallet().
 */

import { AlgorandClient } from '@algorandfoundation/algokit-utils';
import algosdk from 'algosdk';
import { CONTRACT_ADDRESSES, EXPLORER_BASE_URL } from '../config/contractAddresses';

// ─── Helpers ──────────────────────────────────────────────────────────────────

/**
 * Create an AlgorandClient configured for Testnet with the wallet signer.
 */
function getAlgorandClient(activeAddress, transactionSigner) {
  const algorand = AlgorandClient.testNet();
  algorand.setSigner(activeAddress, transactionSigner);
  return algorand;
}

/**
 * SHA-256 hash a string and return raw bytes (Uint8Array).
 * Used to create content-addressed record hashes.
 */
export async function sha256Hash(data) {
  const encoder = new TextEncoder();
  const buffer = await crypto.subtle.digest('SHA-256', encoder.encode(data));
  return new Uint8Array(buffer);
}

/**
 * Build a canonical string from emission record fields for hashing.
 */
function buildRecordString(provider, billingPeriod, value, unit, scopeType) {
  return `${provider}|${billingPeriod}|${value}|${unit}|${scopeType}`;
}

/**
 * Get explorer URL for a transaction.
 */
export function getExplorerTxUrl(txId) {
  return `${EXPLORER_BASE_URL}/tx/${txId}`;
}

/**
 * Get explorer URL for an asset.
 */
export function getExplorerAssetUrl(assetId) {
  return `${EXPLORER_BASE_URL}/asset/${assetId}`;
}

/**
 * Check if contracts are deployed (appId !== 0n).
 */
export function areContractsDeployed() {
  return CONTRACT_ADDRESSES.emissionAttestation.appId !== BigInt(0);
}

// ─── Contract 1: EmissionAttestation ──────────────────────────────────────────

/**
 * Attest an emission record on-chain.
 * Creates a tamper-proof SHA-256 hash in Algorand box storage.
 *
 * @param {Object} params
 * @param {string} params.provider - Utility provider name
 * @param {string} params.billingPeriod - Billing period string
 * @param {number} params.value - Usage value
 * @param {string} params.unit - Usage unit
 * @param {number} params.scopeType - Emission scope (1, 2, or 3)
 * @param {string} params.activeAddress - Connected wallet address
 * @param {Function} params.transactionSigner - Wallet signer from useWallet()
 * @returns {Promise<{txId: string, recordHash: string}>}
 */
export async function attestEmissionRecord({
  provider,
  billingPeriod,
  value,
  unit,
  scopeType,
  activeAddress,
  transactionSigner,
}) {
  if (!activeAddress || !transactionSigner) {
    throw new Error('Wallet not connected');
  }
  if (!areContractsDeployed()) {
    throw new Error('Contracts not yet deployed. App IDs are placeholder.');
  }

  const algorand = getAlgorandClient(activeAddress, transactionSigner);
  const appId = CONTRACT_ADDRESSES.emissionAttestation.appId;

  // Get app client via untyped approach
  const appClient = algorand.client.getAppClientById({
    appId,
    defaultSender: activeAddress,
  });

  // Build record hash
  const recordStr = buildRecordString(provider, billingPeriod, value, unit, scopeType);
  const recordHash = await sha256Hash(recordStr);

  // Create MBR payment for box storage
  // MBR = 2500 + 400 * (key_size + value_size) microAlgos
  // Key prefix 'a' (1 byte) + hash (32 bytes) = 33 bytes key
  // Value: sender(32) + scopeType(8) + timestamp(8) = 48 bytes
  // Total: 2500 + 400 * (33 + 48) = 2500 + 32400 = 34900 microAlgos
  // Add safety margin → 50000
  const mbrPayTxn = await algorand.createTransaction.payment({
    sender: activeAddress,
    receiver: (await appClient).appAddress,
    amount: algosdk.microAlgosToAlgoAmount(50000),
  });

  const result = await (await appClient).send.call({
    method: 'attest',
    args: [recordHash, BigInt(scopeType), mbrPayTxn],
    populateAppCallResources: true,
    coverAppCallInnerTransactionFees: true,
  });

  const txId = result.txIds[0];

  return {
    txId,
    recordHash: Buffer.from(recordHash).toString('hex'),
    explorerUrl: getExplorerTxUrl(txId),
  };
}

/**
 * Verify whether an emission record hash exists on-chain.
 *
 * @param {string} recordHashHex - The hex-encoded hash to verify
 * @returns {Promise<boolean>}
 */
export async function verifyEmissionRecord(recordHashHex) {
  if (!areContractsDeployed()) return false;

  const algorand = AlgorandClient.testNet();
  const appId = CONTRACT_ADDRESSES.emissionAttestation.appId;

  const appClient = algorand.client.getAppClientById({ appId });
  const hashBytes = new Uint8Array(
    recordHashHex.match(/.{1,2}/g).map((byte) => parseInt(byte, 16))
  );

  try {
    const result = await (await appClient).newGroup()
      .call({ method: 'verify', args: [hashBytes] })
      .simulate();
    return result.returns[0] === true;
  } catch {
    return false;
  }
}

// ─── Contract 2: CarbonCreditToken ───────────────────────────────────────────

/**
 * Mint carbon credits to a recipient (creator-only).
 *
 * @param {Object} params
 * @param {string} params.recipient - Recipient address
 * @param {number} params.amount - Number of credits
 * @param {string} params.activeAddress - Connected wallet address
 * @param {Function} params.transactionSigner - Wallet signer
 * @returns {Promise<{txId: string}>}
 */
export async function mintCarbonCredits({
  recipient,
  amount,
  activeAddress,
  transactionSigner,
}) {
  if (!activeAddress || !transactionSigner) {
    throw new Error('Wallet not connected');
  }
  if (!areContractsDeployed()) {
    throw new Error('Contracts not yet deployed');
  }

  const algorand = getAlgorandClient(activeAddress, transactionSigner);
  const appId = CONTRACT_ADDRESSES.carbonCreditToken.appId;

  const appClient = algorand.client.getAppClientById({
    appId,
    defaultSender: activeAddress,
  });

  const result = await (await appClient).send.call({
    method: 'mint',
    args: [recipient, BigInt(amount)],
    populateAppCallResources: true,
    coverAppCallInnerTransactionFees: true,
  });

  return {
    txId: result.txIds[0],
    explorerUrl: getExplorerTxUrl(result.txIds[0]),
  };
}

/**
 * Retire carbon credits (any token holder).
 *
 * @param {Object} params
 * @param {number} params.amount - Credits to retire
 * @param {string} params.activeAddress - Connected wallet address
 * @param {Function} params.transactionSigner - Wallet signer
 * @returns {Promise<{txId: string}>}
 */
export async function retireCarbonCredits({
  amount,
  activeAddress,
  transactionSigner,
}) {
  if (!activeAddress || !transactionSigner) {
    throw new Error('Wallet not connected');
  }
  if (!areContractsDeployed()) {
    throw new Error('Contracts not yet deployed');
  }

  const algorand = getAlgorandClient(activeAddress, transactionSigner);
  const appId = CONTRACT_ADDRESSES.carbonCreditToken.appId;
  const asaId = CONTRACT_ADDRESSES.carbonCreditToken.asaId;

  const appClient = algorand.client.getAppClientById({
    appId,
    defaultSender: activeAddress,
  });

  const appAddress = (await appClient).appAddress;

  // Create asset transfer of credits to contract (for retirement)
  const axferTxn = await algorand.createTransaction.assetTransfer({
    sender: activeAddress,
    receiver: appAddress,
    assetId: asaId,
    amount: BigInt(amount),
  });

  // MBR payment for retirement record box
  const mbrPayTxn = await algorand.createTransaction.payment({
    sender: activeAddress,
    receiver: appAddress,
    amount: algosdk.microAlgosToAlgoAmount(50000),
  });

  const result = await (await appClient).send.call({
    method: 'retire',
    args: [BigInt(amount), axferTxn, mbrPayTxn],
    populateAppCallResources: true,
    coverAppCallInnerTransactionFees: true,
  });

  return {
    txId: result.txIds[0],
    explorerUrl: getExplorerTxUrl(result.txIds[0]),
  };
}

// ─── Contract 3: OffsetMarketplace ───────────────────────────────────────────

/**
 * Buy and retire carbon credits from the marketplace (Option B).
 * Buyer sends ALGO, contract records retirement on buyer's behalf.
 *
 * @param {Object} params
 * @param {number} params.offerId - The offer ID
 * @param {number} params.amount - Credits to buy and retire
 * @param {number} params.totalCostMicroAlgos - Total cost in microAlgos
 * @param {string} params.activeAddress - Connected wallet address
 * @param {Function} params.transactionSigner - Wallet signer
 * @returns {Promise<{txId: string}>}
 */
export async function buyAndRetireOffset({
  offerId,
  amount,
  totalCostMicroAlgos,
  activeAddress,
  transactionSigner,
}) {
  if (!activeAddress || !transactionSigner) {
    throw new Error('Wallet not connected');
  }
  if (!areContractsDeployed()) {
    throw new Error('Contracts not yet deployed');
  }

  const algorand = getAlgorandClient(activeAddress, transactionSigner);
  const appId = CONTRACT_ADDRESSES.offsetMarketplace.appId;

  const appClient = algorand.client.getAppClientById({
    appId,
    defaultSender: activeAddress,
  });

  const appAddress = (await appClient).appAddress;

  // ALGO payment for the purchase
  const payTxn = await algorand.createTransaction.payment({
    sender: activeAddress,
    receiver: appAddress,
    amount: algosdk.microAlgosToAlgoAmount(totalCostMicroAlgos),
  });

  const result = await (await appClient).send.call({
    method: 'buyAndRetire',
    args: [BigInt(offerId), BigInt(amount), payTxn],
    populateAppCallResources: true,
    coverAppCallInnerTransactionFees: true,
  });

  return {
    txId: result.txIds[0],
    explorerUrl: getExplorerTxUrl(result.txIds[0]),
  };
}

// ─── Contract 4: SustainabilityReportNFT ─────────────────────────────────────

/**
 * Issue a sustainability report as an ARC-69 NFT.
 *
 * @param {Object} params
 * @param {Object} params.reportData - { totalEmissionsMT, offsetsMT, reportPeriod }
 * @param {string} params.activeAddress - Connected wallet address
 * @param {Function} params.transactionSigner - Wallet signer
 * @returns {Promise<{txId: string, assetId: string}>}
 */
export async function issueSustainabilityReport({
  reportData,
  activeAddress,
  transactionSigner,
}) {
  if (!activeAddress || !transactionSigner) {
    throw new Error('Wallet not connected');
  }
  if (!areContractsDeployed()) {
    throw new Error('Contracts not yet deployed');
  }

  const algorand = getAlgorandClient(activeAddress, transactionSigner);
  const appId = CONTRACT_ADDRESSES.sustainabilityNFT.appId;

  const appClient = algorand.client.getAppClientById({
    appId,
    defaultSender: activeAddress,
  });

  const appAddress = (await appClient).appAddress;

  const { totalEmissionsMT, offsetsMT, reportPeriod } = reportData;

  // Create report hash from the data
  const reportString = `${activeAddress}|${reportPeriod}|${totalEmissionsMT}|${offsetsMT}`;
  const reportHash = await sha256Hash(reportString);

  // Period hash (for box key — one report per address per period)
  const periodHash = await sha256Hash(reportPeriod);

  // MBR payment for box + ASA creation
  // Box: prefix 'r' (1) + address (32) + periodHash (32) = 65 byte key
  // Value: assetId(8) + totalEmissions(8) + offsets(8) + timestamp(8) = 32 bytes
  // MBR: 2500 + 400*(65+32) = 2500 + 38800 = 41300
  // ASA creation MBR: 100000
  // Total: ~141300 + safety → 200000
  const mbrPayTxn = await algorand.createTransaction.payment({
    sender: activeAddress,
    receiver: appAddress,
    amount: algosdk.microAlgosToAlgoAmount(200000),
  });

  const result = await (await appClient).send.call({
    method: 'issueReport',
    args: [
      reportHash,
      reportPeriod,
      periodHash,
      BigInt(Math.round(totalEmissionsMT)),
      BigInt(Math.round(offsetsMT)),
      mbrPayTxn,
    ],
    populateAppCallResources: true,
    coverAppCallInnerTransactionFees: true,
  });

  const assetId = result.return;

  return {
    txId: result.txIds[0],
    assetId: assetId?.toString() || 'unknown',
    explorerUrl: getExplorerTxUrl(result.txIds[0]),
    assetExplorerUrl: assetId ? getExplorerAssetUrl(assetId.toString()) : null,
  };
}

/**
 * Verify a sustainability report NFT exists for a given address and period.
 *
 * @param {string} address - The address to check
 * @param {string} reportPeriod - The period string
 * @returns {Promise<{exists: boolean, metadata: Object|null}>}
 */
export async function verifySustainabilityReport(address, reportPeriod) {
  if (!areContractsDeployed()) return { exists: false, metadata: null };

  const algorand = AlgorandClient.testNet();
  const appId = CONTRACT_ADDRESSES.sustainabilityNFT.appId;

  const appClient = algorand.client.getAppClientById({ appId });

  // Convert address to bytes
  const addrBytes = algosdk.decodeAddress(address).publicKey;
  const periodHash = await sha256Hash(reportPeriod);

  try {
    const result = await (await appClient).newGroup()
      .call({ method: 'verifyReport', args: [addrBytes, periodHash] })
      .simulate();

    const returnVal = result.returns[0];
    if (returnVal) {
      const [assetId, totalEmissions, offsets, timestamp] = returnVal;
      return {
        exists: true,
        metadata: {
          assetId: assetId.toString(),
          totalEmissions: Number(totalEmissions),
          offsets: Number(offsets),
          timestamp: Number(timestamp),
          reportPeriod,
        },
      };
    }
    return { exists: false, metadata: null };
  } catch {
    return { exists: false, metadata: null };
  }
}
