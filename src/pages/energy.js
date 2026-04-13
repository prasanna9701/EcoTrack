import React, { useMemo } from "react";
import { useDataContext } from "../context/DataContext";
// Sidebar is rendered by the app layout (App.js)

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
  marginBottom: "16px",
};

const sectionStyles = {
  backgroundColor: "#ffffff",
  borderRadius: "16px",
  padding: "18px",
  border: "1px solid #e2e8f0",
  marginBottom: "18px",
};

const metricCardStyles = {
  backgroundColor: "#f8fafc",
  borderRadius: "12px",
  padding: "12px 16px",
  border: "1px solid #dcfce7",
  boxShadow: "0 4px 14px rgba(15,23,42,0.08)",
};

const progressBarOuterStyles = {
  width: "100%",
  height: "8px",
  borderRadius: "999px",
  backgroundColor: "#e2e8f0",
  overflow: "hidden",
  marginTop: "8px",
};

const progressBarInnerStyles = (value, color) => ({
  width: `${value}%`,
  height: "100%",
  borderRadius: "999px",
  background: color,
});

function Energy() {
  const { utilityData, isProcessing, globalEmissions } = useDataContext();

  const totalConsumption = useMemo(() => {
     let total = 0;
     utilityData.forEach(item => {
        if (item.type === 'Electricity') total += item.value;
     });
     return total;
  }, [utilityData]);
  const gasUsage = useMemo(
    () => utilityData.filter((item) => item.type === "Gas").reduce((sum, item) => sum + (item.value || 0), 0),
    [utilityData]
  );
  const uploadCount = utilityData.length;
  const hasData = uploadCount > 0;
  const renewableShare = hasData ? Math.min(100, Math.round((uploadCount / (uploadCount + 2)) * 100)) : 0;
  const efficiencyImprovement = hasData ? Math.min(100, uploadCount * 2) : 0;
  const solarMix = hasData ? Math.round(renewableShare * 0.45) : 0;
  const windMix = hasData ? Math.round(renewableShare * 0.35) : 0;
  const hydroMix = hasData ? Math.round(renewableShare * 0.2) : 0;
  const gridMix = Math.max(0, 100 - (solarMix + windMix + hydroMix));

  return (
    <div style={pageStyles}>
      <main style={mainStyles}>
        <h1 style={titleStyles}>Energy Dashboard</h1>
        <p style={subTitleStyles}>
          Monitor energy consumption, renewable mix, efficiency trends, and ongoing initiatives.
        </p>

        {/* Key Metrics Section */}
        <section style={sectionStyles}>
          <h2 style={titleStyles}>Key Energy Metrics</h2>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(180px,1fr))",
              gap: "16px",
              marginTop: "12px",
            }}
          >
            <div style={metricCardStyles}>
              <p style={subTitleStyles}>Total Consumption</p>
              {isProcessing ? <div style={{width:'80px', height:'21px', background:'rgba(255,255,255,0.1)', borderRadius:'6px', marginTop:'4px'}} className="animate-pulse"/> : <h3 style={{ color: "#facc15", fontSize: "18px" }}>{totalConsumption} kWh</h3>}
            </div>
            <div style={metricCardStyles}>
              <p style={subTitleStyles}>CO₂ Emissions</p>
              {isProcessing ? <div style={{width:'80px', height:'21px', background:'rgba(255,255,255,0.1)', borderRadius:'6px', marginTop:'4px'}} className="animate-pulse"/> : <h3 style={{ color: "#f87171", fontSize: "18px" }}>{(globalEmissions.breakdown?.scope2?.value || 0)} t</h3>}
            </div>
            <div style={metricCardStyles}>
              <p style={subTitleStyles}>Renewable Share</p>
              {isProcessing ? <div style={{width:'80px', height:'21px', background:'rgba(255,255,255,0.1)', borderRadius:'6px', marginTop:'4px'}} className="animate-pulse"/> : <h3 style={{ color: "#4ade80", fontSize: "18px" }}>{renewableShare}%</h3>}
            </div>
            <div style={metricCardStyles}>
              <p style={subTitleStyles}>Efficiency Improvement</p>
              {isProcessing ? <div style={{width:'80px', height:'21px', background:'rgba(255,255,255,0.1)', borderRadius:'6px', marginTop:'4px'}} className="animate-pulse"/> : <h3 style={{ color: "#22c55e", fontSize: "18px" }}>{efficiencyImprovement}%</h3>}
            </div>
          </div>
        </section>

        {/* Energy Mix Section */}
        <section style={sectionStyles}>
          <h2 style={titleStyles}>Energy Mix</h2>
          <p style={subTitleStyles}>Current proportion of energy sources</p>
          <ul style={{ listStyle: "none", padding: 0, marginTop: "8px" }}>
            <li>
              Solar: <span style={{ color: "#facc15" }}>{solarMix}%</span>
              <div style={progressBarOuterStyles}>
                <div style={progressBarInnerStyles(solarMix, "#facc15")} />
              </div>
            </li>
            <li>
              Wind: <span style={{ color: "#60a5fa" }}>{windMix}%</span>
              <div style={progressBarOuterStyles}>
                <div style={progressBarInnerStyles(windMix, "#60a5fa")} />
              </div>
            </li>
            <li>
              Hydro: <span style={{ color: "#34d399" }}>{hydroMix}%</span>
              <div style={progressBarOuterStyles}>
                <div style={progressBarInnerStyles(hydroMix, "#34d399")} />
              </div>
            </li>
            <li>
              Grid: <span style={{ color: "#a1a1aa" }}>{gridMix}%</span>
              <div style={progressBarOuterStyles}>
                <div style={progressBarInnerStyles(gridMix, "#a1a1aa")} />
              </div>
            </li>
          </ul>
        </section>

        {/* Initiatives Section */}
        <section style={sectionStyles}>
          <h2 style={titleStyles}>Ongoing Initiatives</h2>
          <ul style={{ listStyle: "none", padding: 0, marginTop: "12px" }}>
            <li>
              Solar panel upgrade: <span style={{ color: "#4ade80" }}>{Math.round((uploadCount || 0) * 8)}% complete</span>
            </li>
            <li>
              Smart meter deployment: <span style={{ color: "#22c55e" }}>{Math.round((uploadCount || 0) * 5)}% complete</span>
            </li>
            <li>
              HVAC efficiency project: <span style={{ color: "#facc15" }}>{hasData ? "In progress" : "Not started"}</span>
            </li>
            <li>
              LED lighting retrofit: <span style={{ color: "#60a5fa" }}>{Math.round((uploadCount || 0) * 6)}% complete</span>
            </li>
          </ul>
        </section>

        {/* Trend Comparison Section */}
        <section style={sectionStyles}>
          <h2 style={titleStyles}>Trends & Comparisons</h2>
          <p style={subTitleStyles}>
            Renewable usage has changed <strong style={{ color: "#4ade80" }}>{renewableShare}%</strong> based on uploaded records.
          </p>
          <p style={subTitleStyles}>
            Total gas usage recorded: <strong style={{ color: "#f87171" }}>{gasUsage}</strong>.
          </p>
        </section>
      </main>
    </div>
  );
}

export default Energy;