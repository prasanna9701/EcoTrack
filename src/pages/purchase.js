import React, { useCallback, useMemo, useState } from "react";
import { useDataContext } from "../context/DataContext";
import { generateCarbonReport } from "../utils/carbonLogicEngine";

const pageStyles = {
  minHeight: "100vh",
  display: "flex",
  background: "#ffffff",
  color: "#0f172a",
  fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif",
  padding: "24px",
};

const mainStyles = {
  flex: 1,
  maxWidth: "900px",
  margin: "0 auto",
};

const titleStyles = { fontSize: "24px", fontWeight: 600, marginBottom: "12px" };
const subTitleStyles = { fontSize: "14px", color: "#475569", marginBottom: "20px" };

const sectionStyles = {
  backgroundColor: "#ffffff",
  borderRadius: "16px",
  padding: "24px",
  marginBottom: "24px",
  border: "1px solid #dcfce7",
  boxShadow: "0 4px 14px rgba(15,23,42,0.08)",
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
  backgroundColor: selected ? "#dcfce7" : "#f8fafc",
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

const monthMap = {
  jan: 0, feb: 1, mar: 2, apr: 3, may: 4, jun: 5,
  jul: 6, aug: 7, sep: 8, oct: 9, nov: 10, dec: 11,
};

const Purchase = () => {
  const { utilityData } = useDataContext();
  const [selectedProvider, setSelectedProvider] = useState(providers[0]);
  const [purchaseConfirmation, setPurchaseConfirmation] = useState("");
  const parseBillingPeriod = useCallback((billingPeriod) => {
    if (!billingPeriod || typeof billingPeriod !== "string") return null;
    const [monthRaw, yearRaw] = billingPeriod.trim().split(/\s+/);
    if (!monthRaw || !yearRaw) return null;
    const month = monthMap[monthRaw.slice(0, 3).toLowerCase()];
    const year = Number(yearRaw);
    if (month === undefined || Number.isNaN(year)) return null;
    return { month, year };
  }, []);

  const availablePeriods = useMemo(() => {
    const map = new Map();
    utilityData.forEach((item) => {
      const parsed = parseBillingPeriod(item.billingPeriod);
      if (!parsed) return;
      const key = `${parsed.month}-${parsed.year}`;
      if (!map.has(key)) {
        map.set(key, { ...parsed, label: `${item.billingPeriod}` });
      }
    });
    return Array.from(map.values()).sort((a, b) => (b.year - a.year) || (b.month - a.month));
  }, [parseBillingPeriod, utilityData]);
  const selectedPeriod = availablePeriods[0] || {
    month: new Date().getMonth(),
    year: new Date().getFullYear(),
    label: "Current period",
  };
  const filteredData = useMemo(
    () =>
      utilityData.filter((item) => {
        const parsed = parseBillingPeriod(item.billingPeriod);
        return parsed && parsed.month === selectedPeriod.month && parsed.year === selectedPeriod.year;
      }),
    [parseBillingPeriod, utilityData, selectedPeriod.month, selectedPeriod.year]
  );

  const totalEmission = useMemo(() => {
    let scope1Vol = 0;
    let scope2kWh = 0;
    filteredData.forEach((item) => {
      if (item.missingFields?.length > 0) return;
      if (item.type === "Gas") {
        let val = item.value || 0;
        if (item.unit === "m3") val = val * 0.353147;
        scope1Vol += val;
      } else if (item.type === "Electricity") {
        scope2kWh += item.value || 0;
      }
    });
    const payload = {};
    if (scope1Vol > 0) payload.scope1 = { volume: scope1Vol, unit: "therms" };
    if (scope2kWh > 0) payload.scope2 = { kWh: scope2kWh, region: "india" };
    return generateCarbonReport(payload).totalEmissionsMT || 0;
  }, [filteredData]);
  const purchaseAmount = totalEmission;
  const totalCost = Number((purchaseAmount * selectedProvider.pricePerTon).toFixed(2));
  const recordsInPeriod = filteredData.length;
  const hasData = recordsInPeriod > 0;

  const handlePurchase = () => {
    const formattedCredits = Number(purchaseAmount).toFixed(2);
    const formattedCost = Number(totalCost).toFixed(2);
    const confirmationMessage = `Purchased ${formattedCredits} carbon credits from Pera via ${selectedProvider.name}. $${formattedCost} has been deducted from your wallet.`;
    setPurchaseConfirmation(confirmationMessage);
    alert(confirmationMessage);
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
          <div style={{ border: "1px solid #e2e8f0", borderRadius: "12px", padding: "14px", background: "#f8fafc", marginBottom: "14px" }}>
            <div style={{ fontSize: "12px", color: "#64748b", marginBottom: "6px" }}>Reporting Period</div>
            <div style={{ fontSize: "16px", fontWeight: 600, color: "#0f172a" }}>
              {selectedPeriod.label}
            </div>
            <div style={{ marginTop: "8px", fontSize: "12px", color: "#64748b" }}>
              {recordsInPeriod} uploaded record{recordsInPeriod === 1 ? "" : "s"}
            </div>
          </div>
          <p style={subTitleStyles}>
            Total CO₂e emissions:{" "}
            <span style={{ fontWeight: 700, fontSize: "18px", color: "#4ade80" }}>
              {totalEmission} t
            </span>
          </p>
          {!hasData && (
            <p style={{ fontSize: "12px", color: "#64748b", marginTop: "-8px" }}>
              No uploaded data found for this period.
            </p>
          )}
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
            <div style={{ ...inputStyles, background: "#f8fafc", display: "flex", alignItems: "center" }}>
              ${totalCost}
            </div>
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
                ${totalCost}
              </span>
              .
            </p>
            {purchaseConfirmation && (
              <p
                style={{
                  marginTop: "12px",
                  padding: "10px 12px",
                  borderRadius: "10px",
                  background: "#dcfce7",
                  color: "#14532d",
                  fontSize: "14px",
                  fontWeight: 600,
                }}
              >
                {purchaseConfirmation}
              </p>
            )}
          </section>
        )}
      </main>
    </div>
  );
};

export default Purchase;