import React, { useRef, useState } from "react";
import { useDataContext } from "../context/DataContext";
import { FaBolt, FaFire, FaFileInvoice, FaCloudUploadAlt, FaTrashAlt } from "react-icons/fa";
import { getPriorityExtraction, buildUtilityItemFromSample } from "../utils/extractionLogic";
import { useWallet } from '@txnlab/use-wallet-react';
import { issueSustainabilityReport, areContractsDeployed } from '../utils/algorandContracts';
import BlockchainBadge from '../components/BlockchainBadge';
import { motion } from 'framer-motion';

const pageStyles = {
  minHeight: "100vh",
  display: "flex",
  background: "#ffffff",
  color: "#0f172a",
  fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif",
};

const mainStyles = {
  flex: 1,
  padding: "20px 24px",
  boxSizing: "border-box",
};

const titleStyles = {
  fontSize: "22px",
  fontWeight: 600,
  marginBottom: "8px",
};

const subTitleStyles = {
  fontSize: "13px",
  color: "#475569",
  marginBottom: "24px",
};

const sectionTitleStyles = {
  fontSize: "18px",
  fontWeight: 600,
  marginBottom: "16px",
  display: "flex",
  alignItems: "center",
  gap: "8px"
};

const reportCardStyles = {
  backgroundColor: "#ffffff",
  borderRadius: "12px",
  padding: "16px",
  border: "1px solid #dcfce7",
  boxShadow: "0 6px 18px rgba(15,23,42,0.08)",
  display: "flex",
  flexDirection: "column",
};

const headerRowStyles = {
  display: "flex", 
  justifyContent: "space-between", 
  alignItems: "center",
  borderBottom: "1px solid rgba(148,163,184,0.1)",
  paddingBottom: "8px",
  marginBottom: "12px"
};

const gridStyles = {
  display: "grid",
  gridTemplateColumns: "repeat(2, 1fr)",
  gap: "12px",
  fontSize: "13px"
};

const uploadBtnStyles = {
  display: "flex",
  alignItems: "center",
  gap: "8px",
  padding: "8px 16px",
  borderRadius: "8px",
  backgroundColor: "#10b981",
  color: "#fff",
  border: "none",
  cursor: "pointer",
  fontWeight: 500,
  fontSize: "14px",
  transition: "all 0.2s ease"
};

const deleteBtnStyles = {
  display: "inline-flex",
  alignItems: "center",
  gap: "6px",
  padding: "6px 10px",
  borderRadius: "8px",
  backgroundColor: "#ef4444",
  color: "#fff",
  border: "none",
  cursor: "pointer",
  fontWeight: 500,
  fontSize: "12px",
  transition: "all 0.2s ease",
};

function Reports() {
  const { utilityData, addOrUpdateData, deleteData, setIsProcessing } = useDataContext();
  const { activeAddress, transactionSigner } = useWallet();
  const fileInputRef = useRef(null);
  const [issuingReport, setIssuingReport] = useState(false);
  const [reportResult, setReportResult] = useState(null);
  const [reportError, setReportError] = useState(null);

  // Grouping
  const electricData = utilityData.filter(d => d.type === 'Electricity');
  const gasData = utilityData.filter(d => d.type === 'Gas');

  const processFile = (file) => {
      setIsProcessing(true);
      setTimeout(() => {
          const sample = getPriorityExtraction(file.name);
          if (sample) {
              const item = buildUtilityItemFromSample(sample, { sourceFileName: file.name });
              addOrUpdateData(item);
          } else {
              // Fallback for non-sample files
              const isElectric = file.name.toLowerCase().includes('electric');
              addOrUpdateData({
                  type: isElectric ? 'Electricity' : 'Gas',
                  provider: isElectric ? 'TSSPDCL' : 'LocalGasProvider',
                  billingPeriod: 'Apr 2026',
                  value: isElectric ? 294 : 12,
                  unit: isElectric ? 'kWh' : 'Therms',
                  billId: 'INV-' + Math.floor(Math.random() * 90000 + 10000),
                  accountId: 'ACC-8821B',
                  sourceFileName: file.name,
              });
          }
          setIsProcessing(false);
          if (fileInputRef.current) fileInputRef.current.value = '';
      }, 1500);
  };

  const ReportCard = ({ item }) => (
      <div style={reportCardStyles}>
          <div style={headerRowStyles}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                 <FaFileInvoice color="#4ade80" />
                 <span style={{ fontWeight: 600, color: '#0f172a' }}>{item.provider || 'Unknown Provider'}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <span style={{ fontSize: '11px', padding:"2px 8px", background:"rgba(22, 163, 74, 0.2)", color:"#bbf7d0", borderRadius:"12px" }}>
                  {item.isEdited ? 'Manual Entry' : 'Processed'}
                </span>
                <button type="button" style={deleteBtnStyles} onClick={() => deleteData(item.id)}>
                  <FaTrashAlt size={12} /> Remove
                </button>
              </div>
          </div>
          
          <div style={gridStyles}>
              <div>
                 <div style={{ color: '#64748b', marginBottom: '2px' }}>Billing Period</div>
                 <div style={{ color: '#334155', fontWeight: 500 }}>{item.billingPeriod || '-'}</div>
              </div>
              <div>
                 <div style={{ color: '#64748b', marginBottom: '2px' }}>Units Used</div>
                 <div style={{ color: '#4ade80', fontWeight: 600 }}>{item.value} {item.unit}</div>
              </div>
              <div>
                 <div style={{ color: '#64748b', marginBottom: '2px' }}>Bill Number</div>
                 <div style={{ color: '#334155', fontFamily: 'monospace' }}>{item.billId || 'N/A'}</div>
              </div>
              <div>
                 <div style={{ color: '#64748b', marginBottom: '2px' }}>Account ID</div>
                 <div style={{ color: '#334155', fontFamily: 'monospace' }}>{item.accountId || 'Unknown'}</div>
              </div>
          </div>
      </div>
  );

  return (
    <div style={pageStyles}>
      <main style={mainStyles}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
                <h1 style={titleStyles}>Reports Dashboard</h1>
                <p style={subTitleStyles}>
                  View extracted data details grouped by segments.
                </p>
            </div>
            
            <button onClick={() => fileInputRef.current?.click()} style={uploadBtnStyles}>
                <FaCloudUploadAlt size={18} /> Upload Report
            </button>
            <input type="file" accept=".pdf,image/*" ref={fileInputRef} onChange={(e) => processFile(e.target.files[0])} className="hidden" style={{display:'none'}} />
        </div>

        {/* Blockchain Report Issuance */}
        {utilityData.length > 0 && (
          <div style={{ marginBottom: '24px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
              <button
                onClick={async () => {
                  if (!activeAddress || !transactionSigner) {
                    setReportError('Connect your wallet first (top-right corner)');
                    return;
                  }
                  if (!areContractsDeployed()) {
                    setReportError('Contracts not yet deployed to Testnet');
                    return;
                  }
                  setIssuingReport(true);
                  setReportError(null);
                  setReportResult(null);
                  try {
                    const totalE = utilityData.filter(d => d.type === 'Electricity').reduce((sum, d) => sum + (d.value || 0) * 0.0008, 0);
                    const totalG = utilityData.filter(d => d.type === 'Gas').reduce((sum, d) => sum + (d.value || 0) * 0.002, 0);
                    const totalEmissions = totalE + totalG;
                    const result = await issueSustainabilityReport({
                      reportData: {
                        totalEmissionsMT: totalEmissions,
                        offsetsMT: 0,
                        reportPeriod: `FY${new Date().getFullYear()}`,
                      },
                      activeAddress,
                      transactionSigner,
                    });
                    setReportResult(result);
                  } catch (err) {
                    setReportError(err.message);
                  } finally {
                    setIssuingReport(false);
                  }
                }}
                disabled={issuingReport}
                style={{
                  ...uploadBtnStyles,
                  background: issuingReport ? '#6b7280' : 'linear-gradient(135deg, #059669, #10b981)',
                  cursor: issuingReport ? 'not-allowed' : 'pointer',
                }}
              >
                {issuingReport ? '⏳ Issuing NFT...' : '🔗 Issue on Blockchain'}
              </button>
              {!activeAddress && (
                <span style={{ fontSize: '12px', color: '#94a3b8' }}>Connect wallet to issue</span>
              )}
            </div>
            {reportError && (
              <div style={{ marginTop: '8px', fontSize: '12px', color: '#ef4444', background: '#fef2f2', padding: '8px 12px', borderRadius: '8px', border: '1px solid #fecaca' }}>
                ⚠️ {reportError}
              </div>
            )}
            {reportResult && (
              <div style={{ marginTop: '8px' }}>
                <BlockchainBadge
                  txId={reportResult.txId}
                  label="Sustainability Report NFT Issued"
                  assetId={reportResult.assetId}
                  variant="full"
                />
              </div>
            )}
          </div>
        )}

        {utilityData.length === 0 ? (
           <div style={{ textAlign: "center", padding: "60px", backgroundColor: "#f8fafc", borderRadius: "16px", border: "1px dashed #94a3b8" }}>
               <h3 style={{ color: "#34d399", marginBottom: "8px", fontSize: "18px" }}>No Reports Extracted Yet</h3>
               <p style={{ color: "#64748b" }}>Upload a utility bill directly here or in the Data Tab to see it mapped.</p>
           </div>
        ) : (
           <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
               
               {/* ELECTRIC SEGMENT */}
               {electricData.length > 0 && (
                   <section>
                       <h2 style={sectionTitleStyles}>
                           <div style={{ padding: '6px', backgroundColor: 'rgba(250, 204, 21, 0.1)', borderRadius: '8px' }}>
                               <FaBolt color="#facc15" size={16} />
                           </div>
                           Electric Segment
                       </h2>
                       <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px,1fr))", gap: "16px" }}>
                           {electricData.map(item => <ReportCard key={item.id} item={item} />)}
                       </div>
                   </section>
               )}

               {/* GAS SEGMENT */}
               {gasData.length > 0 && (
                   <section>
                       <h2 style={sectionTitleStyles}>
                           <div style={{ padding: '6px', backgroundColor: 'rgba(239, 68, 68, 0.1)', borderRadius: '8px' }}>
                               <FaFire color="#ef4444" size={16} />
                           </div>
                           Gas Segment
                       </h2>
                       <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px,1fr))", gap: "16px" }}>
                           {gasData.map(item => <ReportCard key={item.id} item={item} />)}
                       </div>
                   </section>
               )}
           </div>
        )}
      </main>
    </div>
  );
}

export default Reports;