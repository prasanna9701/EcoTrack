import React, { useRef } from "react";
import { useDataContext } from "../context/DataContext";
import { FaBolt, FaFire, FaFileInvoice, FaCloudUploadAlt } from "react-icons/fa";

const pageStyles = {
  minHeight: "100vh",
  display: "flex",
  background: "radial-gradient(circle at top left, #022c22 0, #020617 45%, #020617 100%)",
  color: "#e5e7eb",
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
  color: "#9ca3af",
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
  backgroundColor: "rgba(15,23,42,0.85)",
  borderRadius: "12px",
  padding: "16px",
  border: "1px solid rgba(74,222,128,0.3)",
  boxShadow: "0 8px 24px rgba(15,23,42,0.6)",
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

function Reports() {
  const { utilityData, addOrUpdateData, setIsProcessing } = useDataContext();
  const fileInputRef = useRef(null);

  // Grouping
  const electricData = utilityData.filter(d => d.type === 'Electricity');
  const gasData = utilityData.filter(d => d.type === 'Gas');

  const processFile = (file) => {
      setIsProcessing(true);
      setTimeout(() => {
          const isElectric = file.name.toLowerCase().includes('electric');
          
          addOrUpdateData({
              type: isElectric ? 'Electricity' : 'Gas',
              provider: isElectric ? 'TSSPDCL' : 'LocalGasProvider',
              billingPeriod: 'Apr 2026',
              value: isElectric ? 294 : 12,
              unit: isElectric ? 'kWh' : 'Therms',
              billId: 'INV-' + Math.floor(Math.random() * 90000 + 10000),
              accountId: 'ACC-8821B'
          });
          setIsProcessing(false);
      }, 1500);
  };

  const ReportCard = ({ item }) => (
      <div style={reportCardStyles}>
          <div style={headerRowStyles}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                 <FaFileInvoice color="#4ade80" />
                 <span style={{ fontWeight: 600, color: '#f9fafb' }}>{item.provider || 'Unknown Provider'}</span>
              </div>
              <span style={{ fontSize: '11px', padding:"2px 8px", background:"rgba(22, 163, 74, 0.2)", color:"#bbf7d0", borderRadius:"12px" }}>
                  {item.isEdited ? 'Manual Entry' : 'Processed'}
              </span>
          </div>
          
          <div style={gridStyles}>
              <div>
                 <div style={{ color: '#9ca3af', marginBottom: '2px' }}>Billing Period</div>
                 <div style={{ color: '#e5e7eb', fontWeight: 500 }}>{item.billingPeriod || '-'}</div>
              </div>
              <div>
                 <div style={{ color: '#9ca3af', marginBottom: '2px' }}>Units Used</div>
                 <div style={{ color: '#4ade80', fontWeight: 600 }}>{item.value} {item.unit}</div>
              </div>
              <div>
                 <div style={{ color: '#9ca3af', marginBottom: '2px' }}>Bill Number</div>
                 <div style={{ color: '#e5e7eb', fontFamily: 'monospace' }}>{item.billId || 'N/A'}</div>
              </div>
              <div>
                 <div style={{ color: '#9ca3af', marginBottom: '2px' }}>Account ID</div>
                 <div style={{ color: '#e5e7eb', fontFamily: 'monospace' }}>{item.accountId || 'Unknown'}</div>
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

        {utilityData.length === 0 ? (
           <div style={{ textAlign: "center", padding: "60px", backgroundColor: "rgba(15, 23, 42, 0.4)", borderRadius: "16px", border: "1px dashed rgba(148,163,184,0.3)" }}>
               <h3 style={{ color: "#34d399", marginBottom: "8px", fontSize: "18px" }}>No Reports Extracted Yet</h3>
               <p style={{ color: "#9ca3af" }}>Upload a utility bill directly here or in the Data Tab to see it mapped.</p>
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