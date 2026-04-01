import React, { useState } from "react";

const pageStyles = {
  minHeight: "100vh",
  display: "flex",
  background: "radial-gradient(circle at top left, #022c22 0, #020617 45%, #020617 100%)",
  color: "#e5e7eb",
  fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif",
  padding: "24px",
};

const mainStyles = {
  flex: 1,
  maxWidth: "900px",
  margin: "0 auto",
};

const titleStyles = { fontSize: "24px", fontWeight: 600, marginBottom: "12px" };
const subTitleStyles = { fontSize: "14px", color: "#9ca3af", marginBottom: "20px" };

const sectionStyles = {
  backgroundColor: "rgba(15, 23, 42, 0.95)",
  borderRadius: "16px",
  padding: "24px",
  marginBottom: "24px",
  border: "1px solid rgba(74, 222, 128, 0.3)",
  boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
};

const buttonStyles = (disabled) => ({
  padding: "10px 20px",
  backgroundColor: disabled ? "#4ade8077" : "#16a34a",
  color: "#fff",
  border: "none",
  borderRadius: "10px",
  cursor: disabled ? "not-allowed" : "pointer",
  fontWeight: 600,
  transition: "background-color 0.2s",
});

const inputStyles = {
  padding: "10px",
  borderRadius: "10px",
  border: "1px solid #4ade80",
  width: "140px",
  marginRight: "12px",
  fontSize: "14px",
};

const providerCardStyles = (selected) => ({
  borderRadius: "12px",
  padding: "12px 16px",
  border: selected ? "2px solid #4ade80" : "1px solid #6b7280",
  backgroundColor: selected ? "rgba(34,197,94,0.15)" : "rgba(0,0,0,0.1)",
  cursor: "pointer",
  transition: "all 0.2s",
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
});

const badgeStyles = {
  backgroundColor: "#4ade80",
  color: "#022c22",
  borderRadius: "999px",
  padding: "2px 8px",
  fontWeight: 600,
  fontSize: "12px",
};

const providers = [
  { name: "GreenEarth", pricePerTon: 12 },
  { name: "EcoBalance", pricePerTon: 15 },
  { name: "CarbonNeutral Inc.", pricePerTon: 18 },
];

const Purchase = () => {
  const [selectedProvider, setSelectedProvider] = useState(providers[0]);
  const [purchaseAmount, setPurchaseAmount] = useState(0);

  const totalEmission = 18420; // example tCO2e from company

  const handlePurchase = () => {
    alert(
      `Purchased ${purchaseAmount} tCO2e credits from ${selectedProvider.name} for $${purchaseAmount * selectedProvider.pricePerTon}`
    );
    setPurchaseAmount(0);
  };

  return (
    <div style={pageStyles}>
      <main style={mainStyles}>
        <h1 style={titleStyles}>Purchase Carbon Credits</h1>
        <p style={subTitleStyles}>
          Offset your company's carbon emissions by purchasing verified carbon credits from trusted providers.
        </p>

        {/* Company Emissions */}
        <section style={sectionStyles}>
          <h2 style={titleStyles}>Company Emissions</h2>
          <p style={subTitleStyles}>
            Total CO₂e emissions this year:{" "}
            <span style={{ fontWeight: 700, fontSize: "18px", color: "#4ade80" }}>
              {totalEmission} t
            </span>
          </p>
        </section>

        {/* Select Provider */}
        <section style={sectionStyles}>
          <h2 style={titleStyles}>Select Carbon Credit Provider</h2>
          <div style={{ display: "flex", flexDirection: "column", gap: "12px", marginTop: "8px" }}>
            {providers.map((provider) => (
              <div
                key={provider.name}
                style={providerCardStyles(selectedProvider.name === provider.name)}
                onClick={() => setSelectedProvider(provider)}
              >
                <span>{provider.name}</span>
                <span style={badgeStyles}>${provider.pricePerTon}/tCO₂e</span>
              </div>
            ))}
          </div>
        </section>

        {/* Purchase Amount */}
        <section style={sectionStyles}>
          <h2 style={titleStyles}>Purchase Amount</h2>
          <div style={{ display: "flex", alignItems: "center", marginTop: "8px" }}>
            <input
              type="number"
              min={0}
              max={totalEmission}
              value={purchaseAmount}
              onChange={(e) => setPurchaseAmount(Number(e.target.value))}
              placeholder="Enter tons"
              style={inputStyles}
            />
            <button
              style={buttonStyles(purchaseAmount <= 0)}
              onClick={handlePurchase}
              disabled={purchaseAmount <= 0}
            >
              Purchase
            </button>
          </div>
        </section>

        {/* Purchase Summary */}
        {purchaseAmount > 0 && (
          <section style={sectionStyles}>
            <h2 style={titleStyles}>Purchase Summary</h2>
            <p style={subTitleStyles}>
              You are purchasing{" "}
              <span style={{ fontWeight: 700, color: "#4ade80" }}>{purchaseAmount} tCO₂e</span> credits
              from <strong>{selectedProvider.name}</strong> for{" "}
              <span style={{ fontWeight: 700, color: "#4ade80" }}>
                ${purchaseAmount * selectedProvider.pricePerTon}
              </span>
              .
            </p>
          </section>
        )}
      </main>
    </div>
  );
};

export default Purchase;