import React, { useState, useEffect } from "react";
import { FaSignOutAlt } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { supabase } from "./supabaseClient";
import { motion } from "framer-motion";
import { useDataContext } from "../context/DataContext";

const pageStyles = {
  minHeight: "100vh",
  display: "flex",
  background:
    "radial-gradient(circle at top left, #022c22 0, #020617 45%, #020617 100%)",
  color: "#e5e7eb",
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
  color: "#f9fafb",
};

const headerSubtitleStyles = {
  fontSize: "13px",
  color: "#9ca3af",
};

const headerRightStyles = {
  display: "flex",
  alignItems: "center",
  gap: "16px",
};

const pillStyles = {
  borderRadius: "999px",
  padding: "6px 12px",
  fontSize: "11px",
  border: "1px solid rgba(52, 211, 153, 0.5)",
  color: "#a7f3d0",
  backgroundColor: "rgba(6, 78, 59, 0.6)",
};

const logoutButtonStyles = {
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  width: "36px",
  height: "36px",
  borderRadius: "50%",
  backgroundColor: "rgba(255,255,255,0.05)",
  border: "1px solid rgba(255,255,255,0.2)",
  cursor: "pointer",
  transition: "all 0.2s ease",
};

const logoutButtonHover = {
  backgroundColor: "rgba(255,255,255,0.15)",
  transform: "scale(1.1)",
};

const contentGridStyles = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
  gap: "20px",
};

const panelStyles = {
  backgroundColor: "rgba(15, 23, 42, 0.95)",
  borderRadius: "16px",
  padding: "20px",
  border: "1px solid rgba(148, 163, 184, 0.2)",
  boxShadow: "0 12px 32px rgba(0,0,0,0.3)",
  transition: "all 0.2s ease",
};

const panelHover = {
  transform: "translateY(-4px)",
  boxShadow: "0 18px 40px rgba(0,0,0,0.4)",
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
  color: "#e5e7eb",
};

const panelTagStyles = {
  fontSize: "11px",
  padding: "4px 10px",
  borderRadius: "999px",
  backgroundColor: "rgba(22, 163, 74, 0.12)",
  color: "#bbf7d0",
  border: "1px solid rgba(74, 222, 128, 0.4)",
};

const metricRowStyles = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  marginTop: "8px",
};

const metricLabelStyles = {
  fontSize: "12px",
  color: "#9ca3af",
};

const metricValueStyles = {
  fontSize: "22px",
  fontWeight: 600,
  color: "#bbf7d0",
};

const metricDeltaStyles = (positive) => ({
  fontSize: "11px",
  color: positive ? "#4ade80" : "#facc15",
});

const progressBarOuterStyles = {
  marginTop: "12px",
  width: "100%",
  height: "8px",
  borderRadius: "999px",
  background: "rgba(15, 23, 42, 0.8)",
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
  fontSize: "12px",
};

const smallListItemStyles = {
  display: "flex",
  justifyContent: "space-between",
};

const Home = () => {
  const navigate = useNavigate();
  const [hoverLogout, setHoverLogout] = useState(false);
  const [hoverPanels, setHoverPanels] = useState({});

  const { isProcessing, globalEmissions } = useDataContext();

  const [emissionsData, setEmissionsData] = useState({
    totalMT: 0,
    performanceRank: "-% vs last year",
    positive: true,
    progress: 0,
    details: [
      { label: "Renewables share", value: "0%", color: "#a7f3d0" },
      { label: "Offsets applied", value: "0 t", color: "#a5b4fc" },
      { label: "High-risk facilities", value: "0 sites", color: "#fca5a5" },
    ]
  });

  useEffect(() => {
      const ownedCredits = 5; 
      let newProgress = globalEmissions.requiredCredits > 0 
          ? Math.min(100, Math.floor((ownedCredits / globalEmissions.requiredCredits) * 100))
          : 100;

      const dynamicDetails = [
         { label: "Offsets applied", value: `${ownedCredits} t`, color: "#a5b4fc" },
         { label: "Unaccounted required", value: `${Math.max(0, globalEmissions.requiredCredits - ownedCredits).toFixed(2)} t`, color: "#fca5a5" }
      ];

      setEmissionsData({
        totalMT: globalEmissions.totalEmissionsMT || 0,
        performanceRank: `Grade ${globalEmissions.confidenceScore === 'High' ? 'A' : 'B'} : In Sync`,
        positive: globalEmissions.confidenceScore === 'High',
        progress: newProgress,
        details: dynamicDetails
      });
  }, [globalEmissions]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/login", { replace: true });
  };

  const panels = [
    {
      title: "Real-time Emissions",
      tag: "Scope 1 • 2 • 3",
      metrics: [
        { label: "Total CO₂e", value: `${emissionsData.totalMT} t` },
        { label: "Benchmarking", value: emissionsData.performanceRank, positive: emissionsData.positive },
      ],
      progress: emissionsData.progress,
      details: emissionsData.details,
    },
    {
      title: "Key initiatives",
      tag: "In-flight",
      details: [
        { label: "Data center cooling optimization", value: "54% complete", color: "#4ade80" },
        { label: "Fleet electrification", value: "32% complete", color: "#22c55e" },
        { label: "Office lighting retrofit", value: "76% complete", color: "#a3e635" },
        { label: "Supplier engagement program", value: "Planning", color: "#facc15" },
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
            <div style={pillStyles}>Net-zero trajectory: on track</div>
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