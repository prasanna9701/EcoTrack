import React, { useState } from "react";
import { useDataContext } from "../context/DataContext";
import { useWallet } from '@txnlab/use-wallet-react';
import { buyAndRetireOffset, areContractsDeployed } from '../utils/algorandContracts';
import BlockchainBadge from '../components/BlockchainBadge';
import { motion, AnimatePresence } from 'framer-motion';

const pageStyles = {
  minHeight: "100vh",
  display: "flex",
  background: "#ffffff",
  color: "#0f172a",
  fontFamily:
    "-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif",
};

const mainStyles = {
  flex: 1,
  padding: "20px 24px",
  boxSizing: "border-box",
};
const infoSectionStyles = {
    marginTop: '24px',
    padding: '16px',
    backgroundColor: '#f8fafc',
    borderRadius: '16px',
    border: '1px solid #dcfce7',
  };
  
  const infoTitleStyles = {
    color: '#166534',
    fontSize: '16px',
    marginBottom: '8px',
  };
  
  const infoListStyles = {
    listStyle: 'disc',
    paddingLeft: '20px',
    color: '#334155',
    fontSize: '13px',
    lineHeight: '1.6',
  };
const sectionStyles = {
  backgroundColor: "#ffffff",
  borderRadius: "16px",
  padding: "18px",
  border: "1px solid #e2e8f0",
  marginBottom: "18px",
};

const titleStyles = {
  fontSize: "20px",
  fontWeight: 600,
  marginBottom: "10px",
};

const subTitleStyles = {
  fontSize: "13px",
  color: "#475569",
  marginBottom: "12px",
};

const cardGrid = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
  gap: "14px",
};

const cardStyles = {
  backgroundColor: "#f8fafc",
  padding: "16px",
  borderRadius: "12px",
  border: "1px solid #e2e8f0",
};

const cardTitle = {
  fontSize: "13px",
  color: "#64748b",
};

const cardValue = {
  fontSize: "22px",
  fontWeight: 600,
  color: "#4ade80",
};

const tableStyles = {
  width: "100%",
  borderCollapse: "collapse",
  marginTop: "10px",
};

const tableHeader = {
  textAlign: "left",
  padding: "10px",
  fontSize: "13px",
  color: "#166534",
  borderBottom: "1px solid rgba(148,163,184,0.2)",
};

const tableRow = {
  padding: "10px",
  fontSize: "13px",
  borderBottom: "1px solid rgba(148,163,184,0.1)",
};

const buttonStyles = {
  padding: "8px 14px",
  borderRadius: "8px",
  border: "1px solid #4ade80",
  background: "transparent",
  color: "#4ade80",
  cursor: "pointer",
  marginBottom: "12px",
};

const statusBadge = (status) => ({
  display: "inline-block",
  padding: "4px 8px",
  borderRadius: "999px",
  fontSize: "11px",
  fontWeight: 600,
  color: status === "Verified" ? "#166534" : "#92400e",
  backgroundColor:
    status === "Verified" ? "#dcfce7" : "#fef3c7",
  border:
    status === "Verified"
      ? "1px solid #86efac"
      : "1px solid #fcd34d",
});

function Emission() {
  const { globalEmissions, isProcessing, utilityData } = useDataContext();
  const { activeAddress, transactionSigner } = useWallet();
  const [buyingOffer, setBuyingOffer] = useState(null);
  const [retireResult, setRetireResult] = useState(null);
  const [retireError, setRetireError] = useState(null);
  
  // Demo marketplace offers (in production these would come from the contract)
  const demoOffers = [
    { id: 1, seller: 'ALGO...X4Q2', project: 'Rajasthan Solar Farm', amount: 50, pricePerUnit: 500000, remaining: 50 },
    { id: 2, seller: 'ALGO...K7M1', project: 'Sundarbans Mangrove Restoration', amount: 25, pricePerUnit: 750000, remaining: 25 },
    { id: 3, seller: 'ALGO...P9R3', project: 'Tamil Nadu Wind Corridor', amount: 100, pricePerUnit: 350000, remaining: 100 },
  ];
  const scope1 = globalEmissions.breakdown?.scope1?.value || 0;
  const scope2 = globalEmissions.breakdown?.scope2?.value || 0;
  // Default to static if 0 for visual purposes of the dashboard if needed, but we connect real data:
  const scope3 = globalEmissions.breakdown?.scope3?.value || 0;
  const hasData = utilityData.length > 0;
  const reductionProgress = hasData && globalEmissions.requiredCredits > 0
    ? Math.min(100, Math.round((utilityData.length / globalEmissions.requiredCredits) * 100))
    : 0;

  return (
    <div style={pageStyles}>
      {/* ✅ Main Content */}
      <main style={mainStyles}>
        <h1 style={titleStyles}>Emission Analytics</h1>
        <p style={subTitleStyles}>
          Track Scope 1, Scope 2, and Scope 3 emissions across your organization.
        </p>

        {/* Scope Breakdown */}
        <section style={sectionStyles}>
          <h2 style={titleStyles}>Scope Breakdown</h2>

          <div style={cardGrid}>
            <div style={cardStyles}>
              <div style={cardTitle}>Scope 1</div>
               {isProcessing ? <div style={{width:'80px', height:'28px', background:'rgba(255,255,255,0.1)', borderRadius:'6px', marginTop:'4px'}} className="animate-pulse"/> : <div style={cardValue}>{scope1} t CO₂e</div>}
            </div>

            <div style={cardStyles}>
              <div style={cardTitle}>Scope 2</div>
               {isProcessing ? <div style={{width:'80px', height:'28px', background:'rgba(255,255,255,0.1)', borderRadius:'6px', marginTop:'4px'}} className="animate-pulse"/> : <div style={cardValue}>{scope2} t CO₂e</div>}
            </div>

            <div style={cardStyles}>
              <div style={cardTitle}>Scope 3</div>
               {isProcessing ? <div style={{width:'80px', height:'28px', background:'rgba(255,255,255,0.1)', borderRadius:'6px', marginTop:'4px'}} className="animate-pulse"/> : <div style={cardValue}>{scope3} t CO₂e</div>}
            </div>
          </div>
        </section>

        {/* Emission Sources */}
        <section style={sectionStyles}>
          <h2 style={titleStyles}>Emission Sources</h2>

          <button
            type="button"
            style={buttonStyles}
            onClick={() => window.alert("Emission data form coming soon.")}
          >
            + Add Emission Data
          </button>

          <table style={tableStyles}>
            <thead>
              <tr>
                <th style={tableHeader}>Category</th>
                <th style={tableHeader}>Source</th>
                <th style={tableHeader}>Emission</th>
                <th style={tableHeader}>Status</th>
              </tr>
            </thead>

            <tbody>
              <tr>
                <td style={tableRow}>Transport</td>
                <td style={tableRow}>Fleet vehicles</td>
                <td style={tableRow}>{scope1} t</td>
                <td style={tableRow}>
                  <span style={statusBadge(hasData ? "Verified" : "Under Review")}>
                    {hasData ? "Verified" : "No Data"}
                  </span>
                </td>
              </tr>

              <tr>
                <td style={tableRow}>Electricity</td>
                <td style={tableRow}>Office buildings</td>
                <td style={tableRow}>{scope2} t</td>
                <td style={tableRow}>
                  <span style={statusBadge(hasData ? "Verified" : "Under Review")}>
                    {hasData ? "Verified" : "No Data"}
                  </span>
                </td>
              </tr>

              <tr>
                <td style={tableRow}>Supply Chain</td>
                <td style={tableRow}>Vendor logistics</td>
                <td style={tableRow}>{scope3} t</td>
                <td style={tableRow}>
                  <span style={statusBadge(hasData ? "Under Review" : "Under Review")}>
                    {hasData ? "Under Review" : "No Data"}
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </section>

        {/* Reduction Progress */}
        <section style={sectionStyles}>
          <h2 style={titleStyles}>Reduction Progress</h2>

          <p style={subTitleStyles}>
            Current progress toward emission reduction target.
          </p>

          <div
            style={{
              width: "100%",
              height: "10px",
              background: "#e2e8f0",
              borderRadius: "999px",
              overflow: "hidden",
            }}
          >
            <div
              style={{
                width: `${reductionProgress}%`,
                height: "100%",
                background:
                  "linear-gradient(90deg,#16a34a,#22c55e,#4ade80)",
              }}
            />
          </div>

          <p style={{ marginTop: "8px", fontSize: "12px", color: "#4ade80" }}>
            {reductionProgress}% toward 2030 Net-Zero Target
          </p>
        </section>

        {/* Buy & Retire Carbon Offsets — Embedded Marketplace */}
        <section style={sectionStyles}>
          <h2 style={titleStyles}>Buy & Retire Carbon Offsets</h2>
          <p style={subTitleStyles}>
            Purchase verified carbon credits from the marketplace and retire them immutably on the Algorand blockchain.
          </p>

          {!activeAddress && (
            <div style={{
              padding: '16px',
              background: 'linear-gradient(135deg, #f0fdf4, #ecfdf5)',
              borderRadius: '12px',
              border: '1px solid #bbf7d0',
              marginBottom: '16px',
              fontSize: '13px',
              color: '#166534',
            }}>
              🔐 Connect your Algorand wallet (top-right) to buy and retire offsets.
            </div>
          )}

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '14px' }}>
            {demoOffers.map((offer) => (
              <motion.div
                key={offer.id}
                whileHover={{ scale: 1.02 }}
                style={{
                  ...cardStyles,
                  border: '1px solid #dcfce7',
                  cursor: 'pointer',
                  transition: 'box-shadow 0.2s',
                }}
              >
                <div style={{ fontSize: '14px', fontWeight: 600, color: '#166534', marginBottom: '4px' }}>
                  {offer.project}
                </div>
                <div style={{ fontSize: '12px', color: '#64748b', marginBottom: '8px' }}>
                  Seller: {offer.seller}
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginBottom: '12px' }}>
                  <div>
                    <div style={{ fontSize: '11px', color: '#94a3b8' }}>Available</div>
                    <div style={{ fontSize: '16px', fontWeight: 600, color: '#4ade80' }}>{offer.remaining} MT</div>
                  </div>
                  <div>
                    <div style={{ fontSize: '11px', color: '#94a3b8' }}>Price / Credit</div>
                    <div style={{ fontSize: '16px', fontWeight: 600, color: '#0f172a' }}>{(offer.pricePerUnit / 1_000_000).toFixed(2)} ALGO</div>
                  </div>
                </div>
                <button
                  onClick={async () => {
                    if (!activeAddress || !transactionSigner) {
                      setRetireError('Connect your wallet first');
                      return;
                    }
                    if (!areContractsDeployed()) {
                      setRetireError('Contracts not yet deployed');
                      return;
                    }
                    setBuyingOffer(offer.id);
                    setRetireError(null);
                    setRetireResult(null);
                    try {
                      const result = await buyAndRetireOffset({
                        offerId: offer.id,
                        amount: 1,
                        totalCostMicroAlgos: offer.pricePerUnit,
                        activeAddress,
                        transactionSigner,
                      });
                      setRetireResult({ ...result, project: offer.project, amount: 1 });
                    } catch (err) {
                      setRetireError(err.message);
                    } finally {
                      setBuyingOffer(null);
                    }
                  }}
                  disabled={buyingOffer === offer.id || !activeAddress}
                  style={{
                    width: '100%',
                    padding: '8px',
                    borderRadius: '8px',
                    border: 'none',
                    background: buyingOffer === offer.id
                      ? '#94a3b8'
                      : activeAddress
                        ? 'linear-gradient(135deg, #059669, #10b981)'
                        : '#e2e8f0',
                    color: activeAddress ? '#fff' : '#94a3b8',
                    fontWeight: 600,
                    fontSize: '13px',
                    cursor: buyingOffer === offer.id || !activeAddress ? 'not-allowed' : 'pointer',
                    transition: 'all 0.2s',
                  }}
                >
                  {buyingOffer === offer.id ? '⏳ Processing...' : 'Buy & Retire 1 Credit'}
                </button>
              </motion.div>
            ))}
          </div>

          {retireError && (
            <div style={{ marginTop: '12px', fontSize: '12px', color: '#ef4444', background: '#fef2f2', padding: '8px 12px', borderRadius: '8px', border: '1px solid #fecaca' }}>
              ⚠️ {retireError}
            </div>
          )}

          <AnimatePresence>
            {retireResult && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                style={{
                  marginTop: '16px',
                  padding: '16px',
                  background: 'linear-gradient(135deg, #ecfdf5, #d1fae5)',
                  borderRadius: '12px',
                  border: '1px solid #6ee7b7',
                }}
              >
                <div style={{ fontWeight: 600, fontSize: '14px', color: '#065f46', marginBottom: '8px' }}>
                  🌿 Retirement Certificate
                </div>
                <div style={{ fontSize: '12px', color: '#047857', marginBottom: '4px' }}>
                  <strong>Project:</strong> {retireResult.project}
                </div>
                <div style={{ fontSize: '12px', color: '#047857', marginBottom: '8px' }}>
                  <strong>Credits Retired:</strong> {retireResult.amount} MT CO₂e
                </div>
                <BlockchainBadge
                  txId={retireResult.txId}
                  label="Offset Retired on Algorand"
                  variant="compact"
                />
              </motion.div>
            )}
          </AnimatePresence>
        </section>

        <section style={infoSectionStyles}>
          <h2 style={infoTitleStyles}>Emission Scopes Explained</h2>
          <ul style={infoListStyles}>
            <li>
              <strong>Scope 1:</strong> Direct emissions from owned or controlled sources, e.g., company vehicles, boilers, or manufacturing processes.
            </li>
            <li>
              <strong>Scope 2:</strong> Indirect emissions from purchased electricity, steam, heating, and cooling.
            </li>
            <li>
              <strong>Scope 3:</strong> All other indirect emissions across the value chain, e.g., business travel, supply chain, waste, and product use.
            </li>
          </ul>
        </section>

      </main>
    </div>
  );
}

export default Emission;