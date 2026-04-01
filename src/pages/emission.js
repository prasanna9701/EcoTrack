import React from "react";
// Sidebar is rendered by the app layout (App.js)

const pageStyles = {
  minHeight: "100vh",
  display: "flex",
  background:
    "radial-gradient(circle at top left, #022c22 0, #020617 45%, #020617 100%)",
  color: "#e5e7eb",
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
    backgroundColor: 'rgba(15,23,42,0.85)',
    borderRadius: '16px',
    border: '1px solid rgba(74,222,128,0.3)',
  };
  
  const infoTitleStyles = {
    color: '#bbf7d0',
    fontSize: '16px',
    marginBottom: '8px',
  };
  
  const infoListStyles = {
    listStyle: 'disc',
    paddingLeft: '20px',
    color: '#d1d5db',
    fontSize: '13px',
    lineHeight: '1.6',
  };
const sectionStyles = {
  backgroundColor: "rgba(15, 23, 42, 0.9)",
  borderRadius: "16px",
  padding: "18px",
  border: "1px solid rgba(148, 163, 184, 0.26)",
  marginBottom: "18px",
};

const titleStyles = {
  fontSize: "20px",
  fontWeight: 600,
  marginBottom: "10px",
};

const subTitleStyles = {
  fontSize: "13px",
  color: "#9ca3af",
  marginBottom: "12px",
};

const cardGrid = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
  gap: "14px",
};

const cardStyles = {
  backgroundColor: "rgba(2, 6, 23, 0.9)",
  padding: "16px",
  borderRadius: "12px",
  border: "1px solid rgba(148, 163, 184, 0.2)",
};

const cardTitle = {
  fontSize: "13px",
  color: "#9ca3af",
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
  color: "#a7f3d0",
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
  color: status === "Tracked" ? "#bbf7d0" : "#fde68a",
  backgroundColor:
    status === "Tracked" ? "rgba(22, 163, 74, 0.2)" : "rgba(202, 138, 4, 0.2)",
  border:
    status === "Tracked"
      ? "1px solid rgba(74, 222, 128, 0.45)"
      : "1px solid rgba(250, 204, 21, 0.35)",
});

function Emission() {
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
              <div style={cardValue}>4,200 t CO₂e</div>
            </div>

            <div style={cardStyles}>
              <div style={cardTitle}>Scope 2</div>
              <div style={cardValue}>6,900 t CO₂e</div>
            </div>

            <div style={cardStyles}>
              <div style={cardTitle}>Scope 3</div>
              <div style={cardValue}>7,320 t CO₂e</div>
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
                <td style={tableRow}>2,100 t</td>
                <td style={tableRow}>
                  <span style={statusBadge("Tracked")}>Tracked</span>
                </td>
              </tr>

              <tr>
                <td style={tableRow}>Electricity</td>
                <td style={tableRow}>Office buildings</td>
                <td style={tableRow}>3,400 t</td>
                <td style={tableRow}>
                  <span style={statusBadge("Tracked")}>Tracked</span>
                </td>
              </tr>

              <tr>
                <td style={tableRow}>Supply Chain</td>
                <td style={tableRow}>Vendor logistics</td>
                <td style={tableRow}>4,700 t</td>
                <td style={tableRow}>
                  <span style={statusBadge("Estimated")}>Estimated</span>
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
              background: "#020617",
              borderRadius: "999px",
              overflow: "hidden",
            }}
          >
            <div
              style={{
                width: "58%",
                height: "100%",
                background:
                  "linear-gradient(90deg,#16a34a,#22c55e,#4ade80)",
              }}
            />
          </div>

          <p style={{ marginTop: "8px", fontSize: "12px", color: "#4ade80" }}>
            58% toward 2030 Net-Zero Target
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