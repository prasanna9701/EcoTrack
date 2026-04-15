import {
  Contract,
  BoxMap,
  Txn,
  Global,
  assert,
  emit,
  clone,
  Uint64,
  Bytes,
  itxn,
  gtxn,
  assertMatch,
  op,
} from '@algorandfoundation/algorand-typescript'
import type { uint64, bytes } from '@algorandfoundation/algorand-typescript'

// --- Type Definitions ---

type ReportMetadata = {
  assetId: uint64
  totalEmissions: uint64
  offsets: uint64
  timestamp: uint64
}

// ARC-28 event: [issuer, assetId, reportHash, totalEmissions, offsets, timestamp]
type ReportIssued = [bytes, uint64, bytes, uint64, uint64, uint64]

// --- Contract ---

export class SustainabilityReportNFT extends Contract {
  // Reports keyed by concat(address, reportPeriodHash)
  // Enforces one report per address per period
  reports = BoxMap<bytes, ReportMetadata>({ keyPrefix: 'r' })

  /**
   * Called on application creation.
   */
  public createApplication(): void {
    // No initialization needed
  }

  /**
   * Issue a sustainability report as an ARC-69 NFT.
   * One report per address per period (enforced via box key).
   *
   * @param reportHash - SHA-256 hash of the report data
   * @param reportPeriod - Human-readable period string (e.g., "FY2025-26")
   * @param reportPeriodHash - Hash of the period (used as box key component)
   * @param totalEmissionsMT - Total emissions in metric tons
   * @param offsetsMT - Total offsets in metric tons
   * @param mbrPay - Payment for box MBR + ASA MBR
   * @returns The created NFT asset ID
   */
  public issueReport(
    reportHash: bytes,
    reportPeriod: string,
    reportPeriodHash: bytes,
    totalEmissionsMT: uint64,
    offsetsMT: uint64,
    mbrPay: gtxn.PaymentTxn,
  ): uint64 {
    // Verify MBR payment goes to app
    assertMatch(mbrPay, {
      receiver: Global.currentApplicationAddress,
    })

    // Build box key: concat(sender address, period hash)
    const boxKey: bytes = op.concat(Txn.sender.bytes, reportPeriodHash)

    // Enforce one report per address per period
    assert(
      !this.reports(boxKey).exists,
      'Report already issued for this period',
    )

    const timestamp: uint64 = Global.latestTimestamp

    // Calculate net emissions
    const netEmissions: uint64 =
      totalEmissionsMT > offsetsMT
        ? totalEmissionsMT - offsetsMT
        : Uint64(0)

    // ARC-69 note: static metadata string
    // Numeric fields are stored in the box, not the note (AVM can't convert uint64 to string easily)
    const noteStr: string = '{"standard":"arc69","description":"EcoTrack Sustainability Report","mediaType":"application/json"}'

    // Create ARC-69 NFT via inner transaction
    const createTxn = itxn
      .assetConfig({
        total: Uint64(1),
        decimals: Uint64(0),
        assetName: 'EcoTrack Report',
        unitName: 'ECORPT',
        manager: Global.currentApplicationAddress,
        reserve: Global.currentApplicationAddress,
        note: noteStr,
        fee: 0,
      })
      .submit()

    const newAssetId: uint64 = createTxn.createdAsset.id

    // Store report metadata in box
    const metadata: ReportMetadata = {
      assetId: newAssetId,
      totalEmissions: totalEmissionsMT,
      offsets: offsetsMT,
      timestamp: timestamp,
    }
    this.reports(boxKey).value = clone(metadata)

    // Emit event
    emit<ReportIssued>('ReportIssued',
      Txn.sender.bytes,
      newAssetId,
      reportHash,
      totalEmissionsMT,
      offsetsMT,
      timestamp,
    )

    return newAssetId
  }

  /**
   * Verify a report exists for a given address and period.
   *
   * @param addr - The address to check
   * @param reportPeriodHash - Hash of the period
   * @returns The report metadata as a tuple
   */
  public verifyReport(
    addr: bytes,
    reportPeriodHash: bytes,
  ): ReportMetadata {
    const boxKey: bytes = op.concat(addr, reportPeriodHash)
    assert(this.reports(boxKey).exists, 'Report not found')
    return clone(this.reports(boxKey).value)
  }
}
