import {
  Contract,
  GlobalState,
  BoxMap,
  Txn,
  Global,
  assert,
  emit,
  clone,
  Uint64,
  Bytes,
  assertMatch,
  gtxn,
} from '@algorandfoundation/algorand-typescript'
import type { uint64, bytes } from '@algorandfoundation/algorand-typescript'

// --- Type Definitions ---

type AttestationRecord = {
  sender: bytes
  scopeType: uint64
  timestamp: uint64
}

// ARC-28 event: [sender, recordHash, scopeType, timestamp]
type EmissionAttested = [bytes, bytes, uint64, uint64]

// --- Contract ---

export class EmissionAttestation extends Contract {
  // Box storage keyed by recordHash (content-addressed)
  attestations = BoxMap<bytes, AttestationRecord>({ keyPrefix: 'a' })

  // Global counter of total attestations
  attestationCount = GlobalState<uint64>({ key: 'count' })

  /**
   * Called on application creation.
   * Initializes the attestation counter.
   */
  public createApplication(): void {
    this.attestationCount.value = Uint64(0)
  }

  /**
   * Attest an emission record on-chain.
   * Creates a tamper-proof hash entry in box storage.
   *
   * @param recordHash - SHA-256 hash of the emission record data
   * @param scopeType - Emission scope (1, 2, or 3)
   * @param mbrPay - Payment transaction to cover box MBR
   */
  public attest(
    recordHash: bytes,
    scopeType: uint64,
    mbrPay: gtxn.PaymentTxn,
  ): void {
    // Verify MBR payment goes to this app
    assertMatch(mbrPay, {
      receiver: Global.currentApplicationAddress,
    })

    // Ensure this hash hasn't been attested before
    assert(!this.attestations(recordHash).exists, 'Record already attested')

    // Validate scope type (1, 2, or 3)
    assert(
      scopeType >= Uint64(1) && scopeType <= Uint64(3),
      'Invalid scope type',
    )

    const timestamp: uint64 = Global.latestTimestamp

    // Store the attestation in box storage
    const record: AttestationRecord = {
      sender: Txn.sender.bytes,
      scopeType: scopeType,
      timestamp: timestamp,
    }
    this.attestations(recordHash).value = clone(record)

    // Increment counter
    this.attestationCount.value = this.attestationCount.value + Uint64(1)

    // Emit ARC-28 event
    emit<EmissionAttested>('EmissionAttested',
      Txn.sender.bytes,
      recordHash,
      scopeType,
      timestamp,
    )
  }

  /**
   * Verify whether a record hash has been attested on-chain.
   *
   * @param recordHash - The hash to verify
   * @returns true if the hash exists in box storage
   */
  public verify(recordHash: bytes): boolean {
    return this.attestations(recordHash).exists
  }
}
