import React from "react";
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

const metricCardStyles = {
  backgroundColor: "rgba(15, 23, 42, 0.85)",
  borderRadius: "12px",
  padding: "12px 16px",
  border: "1px solid rgba(74, 222, 128, 0.3)",
  boxShadow: "0 8px 24px rgba(15,23,42,0.6)",
};

const progressBarOuterStyles = {
  width: "100%",
  height: "8px",
  borderRadius: "999px",
  backgroundColor: "#0f172a",
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
              <h3 style={{ color: "#facc15", fontSize: "18px" }}>1,240 MWh</h3>
            </div>
            <div style={metricCardStyles}>
              <p style={subTitleStyles}>CO₂ Emissions</p>
              <h3 style={{ color: "#f87171", fontSize: "18px" }}>320 t</h3>
            </div>
            <div style={metricCardStyles}>
              <p style={subTitleStyles}>Renewable Share</p>
              <h3 style={{ color: "#4ade80", fontSize: "18px" }}>62%</h3>
            </div>
            <div style={metricCardStyles}>
              <p style={subTitleStyles}>Efficiency Improvement</p>
              <h3 style={{ color: "#22c55e", fontSize: "18px" }}>+14%</h3>
            </div>
          </div>
        </section>

        {/* Energy Mix Section */}
        <section style={sectionStyles}>
          <h2 style={titleStyles}>Energy Mix</h2>
          <p style={subTitleStyles}>Current proportion of energy sources</p>
          <ul style={{ listStyle: "none", padding: 0, marginTop: "8px" }}>
            <li>
              Solar: <span style={{ color: "#facc15" }}>28%</span>
              <div style={progressBarOuterStyles}>
                <div style={progressBarInnerStyles(28, "#facc15")} />
              </div>
            </li>
            <li>
              Wind: <span style={{ color: "#60a5fa" }}>22%</span>
              <div style={progressBarOuterStyles}>
                <div style={progressBarInnerStyles(22, "#60a5fa")} />
              </div>
            </li>
            <li>
              Hydro: <span style={{ color: "#34d399" }}>12%</span>
              <div style={progressBarOuterStyles}>
                <div style={progressBarInnerStyles(12, "#34d399")} />
              </div>
            </li>
            <li>
              Grid: <span style={{ color: "#a1a1aa" }}>38%</span>
              <div style={progressBarOuterStyles}>
                <div style={progressBarInnerStyles(38, "#a1a1aa")} />
              </div>
            </li>
          </ul>
        </section>

        {/* Initiatives Section */}
        <section style={sectionStyles}>
          <h2 style={titleStyles}>Ongoing Initiatives</h2>
          <ul style={{ listStyle: "none", padding: 0, marginTop: "12px" }}>
            <li>
              Solar panel upgrade: <span style={{ color: "#4ade80" }}>75% complete</span>
            </li>
            <li>
              Smart meter deployment: <span style={{ color: "#22c55e" }}>40% complete</span>
            </li>
            <li>
              HVAC efficiency project: <span style={{ color: "#facc15" }}>Planning</span>
            </li>
            <li>
              LED lighting retrofit: <span style={{ color: "#60a5fa" }}>50% complete</span>
            </li>
          </ul>
        </section>

        {/* Trend Comparison Section */}
        <section style={sectionStyles}>
          <h2 style={titleStyles}>Trends & Comparisons</h2>
          <p style={subTitleStyles}>
            Renewable usage has increased <strong style={{ color: "#4ade80" }}>+5%</strong> compared to last month.
          </p>
          <p style={subTitleStyles}>
            Energy consumption decreased <strong style={{ color: "#f87171" }}>-3%</strong> versus last quarter.
          </p>
        </section>
      </main>
    </div>
  );
}

export default Energy;