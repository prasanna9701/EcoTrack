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
  itxn,
  gtxn,
  assertMatch,
  Asset,
  Account,
  op,
} from '@algorandfoundation/algorand-typescript'
import type { uint64, bytes } from '@algorandfoundation/algorand-typescript'

// --- Type Definitions ---

type RetirementRecord = {
  amount: uint64
  timestamp: uint64
}

// ARC-28 event: [retiree, amount, timestamp]
type CreditsRetired = [bytes, uint64, uint64]

// --- Contract ---

export class CarbonCreditToken extends Contract {
  // The ASA ID of the carbon credit token
  assetId = GlobalState<uint64>({ key: 'assetId' })

  // The creator/admin address (stored as bytes)
  creator = GlobalState<bytes>({ key: 'creator' })

  // Per-address retirement count (for indexing retirement records)
  retirementCounts = BoxMap<bytes, uint64>({ keyPrefix: 'rc' })

  // Retirement records keyed by concat(address, index)
  retirements = BoxMap<bytes, RetirementRecord>({ keyPrefix: 'rt' })

  /**
   * Called on application creation.
   * Stores the creator address. ASA is created in bootstrap().
   */
  public createApplication(): void {
    this.creator.value = Txn.sender.bytes
  }

  /**
   * Bootstrap: create the EcoTrack Carbon Credit ASA.
   * Must be called after funding the app account.
   *
   * @param mbrPay - Payment to fund app for ASA MBR
   * @returns The created asset ID
   */
  public bootstrap(mbrPay: gtxn.PaymentTxn): uint64 {
    // Only creator can bootstrap
    assert(
      Txn.sender.bytes === this.creator.value,
      'Only creator can bootstrap',
    )

    // Ensure not already bootstrapped
    assert(!this.assetId.hasValue, 'Already bootstrapped')

    // Verify payment goes to app
    assertMatch(mbrPay, {
      receiver: Global.currentApplicationAddress,
    })

    // Create the ASA via inner transaction
    const createTxn = itxn
      .assetConfig({
        total: Uint64(10_000_000),
        decimals: Uint64(0),
        assetName: 'EcoTrack Carbon Credit',
        unitName: 'ECC',
        manager: Global.currentApplicationAddress,
        reserve: Global.currentApplicationAddress,
        clawback: Global.currentApplicationAddress,
        fee: 0,
      })
      .submit()

    this.assetId.value = createTxn.createdAsset.id
    return createTxn.createdAsset.id
  }

  /**
   * Mint carbon credits to a recipient.
   * Only callable by the contract creator.
   *
   * @param recipient - Address to receive credits
   * @param amount - Number of credits to mint (1 = 1 MT CO2)
   */
  public mint(
    recipient: Account,
    amount: uint64,
  ): void {
    // Only creator can mint
    assert(
      Txn.sender.bytes === this.creator.value,
      'Only creator can mint',
    )

    assert(this.assetId.hasValue, 'Not bootstrapped')

    // Transfer tokens from contract to recipient via inner txn
    itxn
      .assetTransfer({
        xferAsset: Asset(this.assetId.value),
        assetReceiver: recipient,
        assetAmount: amount,
        fee: 0,
      })
      .submit()
  }

  /**
   * Retire (burn) carbon credits.
   * Caller sends credits to the contract via axferTxn.
   * Retirement is recorded immutably in box storage.
   *
   * @param amount - Amount being retired
   * @param axferTxn - The asset transfer of credits to contract
   * @param mbrPay - Payment to cover box storage MBR
   */
  public retire(
    amount: uint64,
    axferTxn: gtxn.AssetTransferTxn,
    mbrPay: gtxn.PaymentTxn,
  ): void {
    assert(this.assetId.hasValue, 'Not bootstrapped')

    // Verify the asset transfer sends credits to this contract
    assertMatch(axferTxn, {
      xferAsset: Asset(this.assetId.value),
      assetReceiver: Global.currentApplicationAddress,
      assetAmount: amount,
    })

    // Verify MBR payment goes to app
    assertMatch(mbrPay, {
      receiver: Global.currentApplicationAddress,
    })

    const senderBytes: bytes = Txn.sender.bytes
    const timestamp: uint64 = Global.latestTimestamp

    // Get or initialize retirement count for this address
    let count: uint64 = Uint64(0)
    if (this.retirementCounts(senderBytes).exists) {
      count = this.retirementCounts(senderBytes).value
    }

    // Create retirement record key: concat(sender, count as bytes)
    const recordKey: bytes = op.concat(senderBytes, op.itob(count))

    const record: RetirementRecord = {
      amount: amount,
      timestamp: timestamp,
    }
    this.retirements(recordKey).value = clone(record)

    // Increment count
    this.retirementCounts(senderBytes).value = count + Uint64(1)

    // Emit ARC-28 event
    emit<CreditsRetired>('CreditsRetired', senderBytes, amount, timestamp)
  }

  /**
   * Get the ASA ID of the carbon credit token.
   */
  public getAssetId(): uint64 {
    assert(this.assetId.hasValue, 'Not bootstrapped')
    return this.assetId.value
  }

  /**
   * Get the retirement count for an address.
   */
  public getRetirementCount(addr: Account): uint64 {
    const addrBytes: bytes = addr.bytes
    if (this.retirementCounts(addrBytes).exists) {
      return this.retirementCounts(addrBytes).value
    }
    return Uint64(0)
  }
}
