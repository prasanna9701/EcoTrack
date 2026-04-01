import React, { useState } from "react";
// Sidebar is rendered by the app layout (App.js)

const pageStyles = {
  minHeight: "100vh",
  display: "flex",
  background:
    "radial-gradient(circle at top left, #022c22 0, #020617 45%, #020617 100%)",
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
  marginBottom: "16px",
};

const sectionStyles = {
  backgroundColor: "rgba(15, 23, 42, 0.9)",
  borderRadius: "16px",
  padding: "18px",
  border: "1px solid rgba(148, 163, 184, 0.26)",
  marginBottom: "18px",
};

const reportCardStyles = {
  backgroundColor: "rgba(15,23,42,0.85)",
  borderRadius: "12px",
  padding: "16px",
  border: "1px solid rgba(74,222,128,0.3)",
  boxShadow: "0 8px 24px rgba(15,23,42,0.6)",
  display: "flex",
  flexDirection: "column",
  justifyContent: "space-between",
};

const reportTitleStyles = { fontSize: "16px", fontWeight: 500, marginBottom: "8px" };
const reportSummaryStyles = { fontSize: "13px", color: "#9ca3af" };
const reportValueStyles = { fontSize: "18px", fontWeight: 600, color: "#4ade80" };

const buttonStyles = {
  marginTop: "12px",
  padding: "6px 12px",
  borderRadius: "8px",
  backgroundColor: "#22c55e",
  color: "#fff",
  fontSize: "12px",
  cursor: "pointer",
  border: "none",
};

const uploadListStyles = {
  marginTop: "12px",
  display: "flex",
  flexDirection: "column",
  gap: "6px",
};

const uploadItemStyles = {
  display: "flex",
  justifyContent: "space-between",
  padding: "6px 10px",
  borderRadius: "8px",
  backgroundColor: "rgba(22,22,22,0.6)",
  color: "#d1d5db",
};

function Reports() {
  const [uploadedFiles, setUploadedFiles] = useState([]);

  const handleFileUpload = (e) => {
    const files = Array.from(e.target.files).map((file) => ({
      name: file.name,
      size: (file.size / 1024).toFixed(1) + " KB",
      date: new Date().toLocaleDateString(),
    }));
    setUploadedFiles((prev) => [...prev, ...files]);
  };

  const removeFile = (index) => {
    setUploadedFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const reports = [
    { title: "Electricity Bill", summary: "Monthly energy consumption and cost", value: "$1,240" },
    { title: "Renewable Energy Report", summary: "Solar and wind energy generated", value: "620 kWh" },
    { title: "Carbon Emission Report", summary: "CO₂ emissions from operations", value: "320 t" },
  ];

  return (
    <div style={pageStyles}>
      <main style={mainStyles}>
        <h1 style={titleStyles}>Reports Dashboard</h1>
        <p style={subTitleStyles}>
          Access, review, and upload your energy, utility, and carbon reports.
        </p>

        {/* Report Cards */}
        <section
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(220px,1fr))",
            gap: "16px",
          }}
        >
          {reports.map((report, idx) => (
            <div key={idx} style={reportCardStyles}>
              <h2 style={reportTitleStyles}>{report.title}</h2>
              <p style={reportSummaryStyles}>{report.summary}</p>
              <p style={reportValueStyles}>{report.value}</p>
              <button style={buttonStyles}>View / Download</button>
            </div>
          ))}
        </section>

        {/* Upload Section */}
        <section style={sectionStyles}>
          <h2 style={titleStyles}>Upload Reports</h2>
          <input
            type="file"
            multiple
            onChange={handleFileUpload}
            style={{ marginBottom: "12px", color: "#fff" }}
          />
          <div style={uploadListStyles}>
            {uploadedFiles.map((file, idx) => (
              <div key={idx} style={uploadItemStyles}>
                <span>{file.name} ({file.size})</span>
                <button
                  onClick={() => removeFile(idx)}
                  style={{ ...buttonStyles, backgroundColor: "#f87171", fontSize: "11px" }}
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}

export default Reports;