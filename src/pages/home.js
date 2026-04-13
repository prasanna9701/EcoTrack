import React, { useState, useEffect } from "react";
import { FaSignOutAlt } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { supabase } from "./supabaseClient";
import { motion } from "framer-motion";
import { useDataContext } from "../context/DataContext";

const pageStyles = {
  minHeight: "100vh",
  display: "flex",
  background: "#ffffff",
  color: "#0f172a",
  fontFamily:
    "-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif",
};

const mainStyles = {
  flex: 1,
  display: "flex",
  flexDirection: "column",
  padding: "24px",
  boxSizing: "border-box",
};

const headerStyles = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  marginBottom: "24px",
};

const headerTitleStyles = {
  display: "flex",
  flexDirection: "column",
  gap: "4px",
};

const headerTitleTextStyles = {
  fontSize: "24px",
  fontWeight: 600,
  color: "#0f172a",
};

const headerSubtitleStyles = {
  fontSize: "13px",
  color: "#475569",
};

const headerRightStyles = {
  display: "flex",
  alignItems: "center",
  gap: "16px",
};

const pillStyles = {
  borderRadius: "999px",
  padding: "7px 12px",
  fontSize: "12px",
  border: "1px solid #bfdbfe",
  color: "#1e3a8a",
  backgroundColor: "#eff6ff",
};

const logoutButtonStyles = {
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  width: "36px",
  height: "36px",
  borderRadius: "50%",
  backgroundColor: "#ffffff",
  border: "1px solid #cbd5e1",
  cursor: "pointer",
  transition: "all 0.2s ease",
};

const logoutButtonHover = {
  backgroundColor: "#f1f5f9",
  transform: "scale(1.1)",
};

const contentGridStyles = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
  gap: "20px",
};

const panelStyles = {
  backgroundColor: "#ffffff",
  borderRadius: "16px",
  padding: "20px",
  border: "1px solid #e2e8f0",
  boxShadow: "0 8px 24px rgba(15, 23, 42, 0.08)",
  transition: "all 0.2s ease",
};

const panelHover = {
  transform: "translateY(-4px)",
  boxShadow: "0 14px 28px rgba(15, 23, 42, 0.12)",
};

const panelTitleRowStyles = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  marginBottom: "12px",
};

const panelTitleStyles = {
  fontSize: "16px",
  fontWeight: 600,
  color: "#0f172a",
};

const panelTagStyles = {
  fontSize: "11px",
  padding: "4px 10px",
  borderRadius: "999px",
  backgroundColor: "#f1f5f9",
  color: "#334155",
  border: "1px solid #cbd5e1",
};

const metricRowStyles = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  marginTop: "8px",
};

const metricLabelStyles = {
  fontSize: "12px",
  color: "#64748b",
};

const metricValueStyles = {
  fontSize: "22px",
  fontWeight: 600,
  color: "#0f172a",
};

const metricDeltaStyles = (positive) => ({
  fontSize: "12px",
  color: positive ? "#166534" : "#b45309",
  fontWeight: 600,
});

const progressBarOuterStyles = {
  marginTop: "12px",
  width: "100%",
  height: "8px",
  borderRadius: "999px",
  background: "#e2e8f0",
  overflow: "hidden",
};

const progressBarInnerStyles = {
  height: "100%",
  borderRadius: "999px",
  background: "linear-gradient(90deg, #16a34a, #22c55e, #4ade80, #a3e635)",
  boxShadow: "0 0 12px rgba(34, 197, 94, 0.7)",
};

const smallListStyles = {
  listStyle: "none",
  padding: 0,
  margin: "12px 0 0 0",
  display: "flex",
  flexDirection: "column",
  gap: "8px",
  fontSize: "13px",
};

const smallListItemStyles = {
  display: "flex",
  justifyContent: "space-between",
};

const Home = () => {
  const navigate = useNavigate();
  const [hoverLogout, setHoverLogout] = useState(false);
  const [hoverPanels, setHoverPanels] = useState({});

  const { isProcessing, globalEmissions, utilityData } = useDataContext();

  const [emissionsData, setEmissionsData] = useState({
    totalMT: 0,
    performanceRank: "Awaiting benchmark",
    positive: true,
    progress: 0,
    details: [
      { label: "Renewables share", value: "0%", color: "#334155" },
      { label: "Offsets applied", value: "0 t", color: "#334155" },
      { label: "High-risk facilities", value: "0 sites", color: "#334155" },
    ]
  });

  useEffect(() => {
      const uploadCount = utilityData.length;
      const ownedCredits = uploadCount;
      let newProgress = globalEmissions.requiredCredits > 0 
          ? Math.min(100, Math.floor((ownedCredits / globalEmissions.requiredCredits) * 100))
          : 0;

      const dynamicDetails = [
         { label: "Offsets applied", value: `${ownedCredits} t`, color: "#334155" },
         { label: "Outstanding requirement", value: `${Math.max(0, globalEmissions.requiredCredits - ownedCredits).toFixed(2)} t`, color: "#334155" }
      ];

      const initiativeProgress = Math.min(100, uploadCount * 10);
      setEmissionsData({
        totalMT: globalEmissions.totalEmissionsMT || 0,
        performanceRank: globalEmissions.confidenceScore === 'High' ? "Verified data quality" : "Data review in progress",
        positive: globalEmissions.confidenceScore === 'High',
        progress: newProgress,
        details: dynamicDetails,
        initiativeProgress
      });
  }, [globalEmissions, utilityData]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/login", { replace: true });
  };

  const panels = [
    {
      title: "Real-time Emissions",
      tag: "Scope 1-3",
      metrics: [
        { label: "Total CO₂e", value: `${emissionsData.totalMT} t` },
        { label: "Data Status", value: emissionsData.performanceRank, positive: emissionsData.positive },
      ],
      progress: emissionsData.progress,
      details: emissionsData.details,
    },
    {
      title: "Key initiatives",
      tag: "Program status",
      details: [
        { label: "Data center cooling optimization", value: `${Math.round((emissionsData.initiativeProgress || 0) * 0.8)}% complete`, color: "#334155" },
        { label: "Fleet electrification", value: `${Math.round((emissionsData.initiativeProgress || 0) * 0.6)}% complete`, color: "#334155" },
        { label: "Office lighting retrofit", value: `${Math.round((emissionsData.initiativeProgress || 0) * 0.9)}% complete`, color: "#334155" },
        { label: "Supplier engagement program", value: utilityData.length > 0 ? "In progress" : "Not started", color: "#334155" },
      ],
    },
  ];

  return (
    <div style={pageStyles}>
      <main style={mainStyles}>
        {/* Header */}
        <header style={headerStyles}>
          <div style={headerTitleStyles}>
            <h1 style={headerTitleTextStyles}>Carbon Impact Dashboard</h1>
            <p style={headerSubtitleStyles}>
              Real-time insights into emissions, energy mix, and sustainability progress.
            </p>
          </div>
          <div style={headerRightStyles}>
            <div style={pillStyles}>Net-zero trajectory: On track</div>
            <div
              style={{ ...logoutButtonStyles, ...(hoverLogout ? logoutButtonHover : {}) }}
              onMouseEnter={() => setHoverLogout(true)}
              onMouseLeave={() => setHoverLogout(false)}
              onClick={handleLogout}
              title="Logout"
            >
              <FaSignOutAlt size={18} color="#f87171" />
            </div>
          </div>
        </header>

        {/* Panels */}
        <section style={contentGridStyles}>
          {panels.map((panel, idx) => {
            const isHovered = hoverPanels[idx];
            return (
              <div
                key={idx}
                style={{ ...panelStyles, ...(isHovered ? panelHover : {}) }}
                onMouseEnter={() =>
                  setHoverPanels((prev) => ({ ...prev, [idx]: true }))
                }
                onMouseLeave={() =>
                  setHoverPanels((prev) => ({ ...prev, [idx]: false }))
                }
              >
                <div style={panelTitleRowStyles}>
                  <h2 style={panelTitleStyles}>{panel.title}</h2>
                  {panel.tag && <span style={panelTagStyles}>{panel.tag}</span>}
                </div>

                {panel.metrics && (
                  <div style={metricRowStyles}>
                    <div>
                      <div style={metricLabelStyles}>{panel.metrics[0].label}</div>
                      {isProcessing ? (
                         <div style={{ width: "80px", height: "24px", background: "rgba(255,255,255,0.1)", borderRadius: "6px", marginTop: "4px" }} className="animate-pulse" />
                      ) : (
                         <motion.div 
                           key={panel.metrics[0].value} // Dynamic re-animation trigger 
                           initial={{ opacity: 0, y: 10 }}
                           animate={{ opacity: 1, y: 0 }}
                           transition={{ duration: 0.6 }}
                           style={metricValueStyles}>
                            {panel.metrics[0].value}
                         </motion.div>
                      )}
                    </div>
                    <div style={{ textAlign: "right" }}>
                      <div style={metricLabelStyles}>{panel.metrics[1].label}</div>
                      {isProcessing ? (
                         <div style={{ width: "60px", height: "16px", background: "rgba(255,255,255,0.1)", borderRadius: "4px", marginTop: "8px", marginLeft: "auto" }} className="animate-pulse" />
                      ) : (
                         <motion.div 
                           key={panel.metrics[1].value}
                           initial={{ opacity: 0 }}
                           animate={{ opacity: 1 }}
                           style={metricDeltaStyles(panel.metrics[1].positive)}>
                            {panel.metrics[1].value}
                         </motion.div>
                      )}
                    </div>
                  </div>
                )}

                {panel.progress !== undefined && (
                  <div style={progressBarOuterStyles}>
                    <motion.div 
                      key={panel.progress}
                      style={progressBarInnerStyles}
                      initial={{ width: 0 }}
                      animate={{ width: `${panel.progress}%` }}
                      transition={{ duration: 1.5, ease: "easeOut" }}
                    />
                  </div>
                )}

                {panel.details && (
                  <ul style={smallListStyles}>
                    {panel.details.map((item, i) => (
                      <li key={i} style={{ ...smallListItemStyles, color: item.color }}>
                        <span>{item.label}</span>
                        <span>{item.value}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            );
          })}
        </section>
      </main>
    </div>
  );
};

export default Home;