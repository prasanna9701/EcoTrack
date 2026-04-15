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
} from '@algorandfoundation/algorand-typescript'
import type { uint64, bytes } from '@algorandfoundation/algorand-typescript'

// --- Type Definitions ---

type OfferRecord = {
  seller: bytes
  assetId: uint64
  amount: uint64
  remaining: uint64
  pricePerUnit: uint64
  active: uint64
}

// ARC-28 event: [buyer, amount, offerId, timestamp]
type OffsetRetired = [bytes, uint64, uint64, uint64]

// --- Contract ---

export class OffsetMarketplace extends Contract {
  // Auto-incrementing offer ID
  nextOfferId = GlobalState<uint64>({ key: 'nextId' })

  // Offer records
  offers = BoxMap<uint64, OfferRecord>({ keyPrefix: 'o' })

  /**
   * Called on application creation.
   */
  public createApplication(): void {
    this.nextOfferId.value = Uint64(1)
  }

  /**
   * Opt the contract into an ASA so it can receive tokens.
   *
   * @param asset - The ASA to opt into
   * @param mbrPay - Payment to cover ASA opt-in MBR
   */
  public optInToAsset(asset: Asset, mbrPay: gtxn.PaymentTxn): void {
    assertMatch(mbrPay, {
      receiver: Global.currentApplicationAddress,
    })

    itxn
      .assetTransfer({
        xferAsset: asset,
        assetReceiver: Global.currentApplicationAddress,
        assetAmount: 0,
        fee: 0,
      })
      .submit()
  }

  /**
   * List carbon credits for sale.
   * Seller transfers ASA tokens to the contract as escrow.
   *
   * @param assetId - The ASA ID being listed
   * @param amount - Number of credits to list
   * @param pricePerUnit - Price per credit in microAlgos
   * @param axferTxn - Asset transfer of credits into escrow
   * @param mbrPay - Payment for box MBR
   * @returns The offer ID
   */
  public listOffer(
    assetId: uint64,
    amount: uint64,
    pricePerUnit: uint64,
    axferTxn: gtxn.AssetTransferTxn,
    mbrPay: gtxn.PaymentTxn,
  ): uint64 {
    // Verify the asset transfer sends tokens to this contract
    assertMatch(axferTxn, {
      xferAsset: Asset(assetId),
      assetReceiver: Global.currentApplicationAddress,
      assetAmount: amount,
    })

    assertMatch(mbrPay, {
      receiver: Global.currentApplicationAddress,
    })

    assert(amount > Uint64(0), 'Amount must be positive')
    assert(pricePerUnit > Uint64(0), 'Price must be positive')

    const offerId: uint64 = this.nextOfferId.value

    const offer: OfferRecord = {
      seller: Txn.sender.bytes,
      assetId: assetId,
      amount: amount,
      remaining: amount,
      pricePerUnit: pricePerUnit,
      active: Uint64(1),
    }
    this.offers(offerId).value = clone(offer)

    this.nextOfferId.value = offerId + Uint64(1)
    return offerId
  }

  /**
   * Buy and retire carbon credits (Option B: contract holds ASA, records retirement on buyer's behalf).
   * Buyer sends ALGO, contract records the retirement immutably.
   *
   * @param offerId - The offer to buy from
   * @param amount - Number of credits to buy and retire
   * @param payTxn - ALGO payment from buyer
   */
  public buyAndRetire(
    offerId: uint64,
    amount: uint64,
    payTxn: gtxn.PaymentTxn,
  ): void {
    assert(this.offers(offerId).exists, 'Offer not found')

    const offer = clone(this.offers(offerId).value)
    assert(offer.active === Uint64(1), 'Offer not active')
    assert(amount > Uint64(0), 'Amount must be positive')
    assert(offer.remaining >= amount, 'Insufficient credits')

    // Calculate total cost
    const totalCost: uint64 = offer.pricePerUnit * amount

    // Verify buyer payment
    assertMatch(payTxn, {
      receiver: Global.currentApplicationAddress,
      amount: totalCost,
    })

    // Forward payment to seller via inner txn
    itxn
      .payment({
        receiver: Account(offer.seller),
        amount: totalCost,
        fee: 0,
      })
      .submit()

    // Update offer remaining
    offer.remaining = offer.remaining - amount
    if (offer.remaining === Uint64(0)) {
      offer.active = Uint64(0)
    }
    this.offers(offerId).value = clone(offer)

    // Emit retirement event (Option B: contract keeps ASA, records retirement for buyer)
    emit<OffsetRetired>('OffsetRetired',
      Txn.sender.bytes,
      amount,
      offerId,
      Global.latestTimestamp,
    )
  }

  /**
   * Cancel an offer and return escrowed tokens to the seller.
   *
   * @param offerId - The offer to cancel
   */
  public cancelOffer(offerId: uint64): void {
    assert(this.offers(offerId).exists, 'Offer not found')

    const offer = clone(this.offers(offerId).value)
    assert(offer.active === Uint64(1), 'Offer not active')
    assert(
      Txn.sender.bytes === offer.seller,
      'Only the seller can cancel',
    )

    // Return remaining tokens to seller
    if (offer.remaining > Uint64(0)) {
      itxn
        .assetTransfer({
          xferAsset: Asset(offer.assetId),
          assetReceiver: Txn.sender,
          assetAmount: offer.remaining,
          fee: 0,
        })
        .submit()
    }

    // Mark offer as inactive
    offer.active = Uint64(0)
    offer.remaining = Uint64(0)
    this.offers(offerId).value = clone(offer)
  }

  /**
   * Get the next offer ID (for reading current offer count).
   */
  public getNextOfferId(): uint64 {
    return this.nextOfferId.value
  }
}
