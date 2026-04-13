import React from "react";
import { useDataContext } from "../context/DataContext";
// Sidebar is rendered by the app layout (App.js)

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