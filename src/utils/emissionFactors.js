/**
 * @file emissionFactors.js
 * @description Centralized "Truth Table" for all carbon emission calculation factors.
 * These metrics provide the kgCO2e multiplier per respective unit.
 */

/**
 * Electricity emission factors in kgCO2e per kWh.
 */
export const REGIONAL_FACTORS = {
  INDIA: { value: 0.82, source: 'India Grid Standard (TSSPDCL - 2024)' }
};

export const ELECTRICITY_FACTORS = {
  GLOBAL_IEA: { value: 0.475, source: 'IEA Global Average 2023' },
  US_EGRID: { value: 0.386, source: 'US EPA eGRID 2024' },
  INDIA_GRID: REGIONAL_FACTORS.INDIA
};

/**
 * Fuel emission factors in kgCO2e.
 */
export const FUEL_FACTORS = {
  NATURAL_GAS_THERM: { value: 5.302, source: 'EPA 2024 Data (per Therm)' },
  NATURAL_GAS_M3: { value: 1.88, source: 'EPA 2024 Data (per m³)' }
};

/**
 * Business travel emission factors in kgCO2e.
 */
export const TRAVEL_FACTORS = {
  FLIGHT_SHORT_MILE: { value: 0.25, source: 'EPA 2024 Data (Short-haul per mile)' },
  FLIGHT_LONG_MILE: { value: 0.15, source: 'EPA 2024 Data (Long-haul per mile)' },
  CAR_MILE: { value: 0.40, source: 'EPA 2024 Data (Average Car per mile)' },
  CAR_KM: { value: 0.25, source: 'EPA 2024 Data (Average Car per km)' }
};

/**
 * Converts various input weight units into Metric Tons (MT).
 * 1 MT = 1000 kg.
 * 
 * @param {number} value - The numerical weight to convert.
 * @param {string} unit - The unit of the provided value ('kg', 'lbs', 'mt').
 * @returns {number} The converted weight in Metric Tons.
 */
export const normalizeToMT = (value, unit = 'kg') => {
  if (value < 0) return 0;
  
  const normalizedUnit = unit.toLowerCase();
  switch (normalizedUnit) {
    case 'kg': // Kilograms
      return value / 1000;
    case 'lbs': // Pounds (1 lb = 0.453592 kg)
      return (value * 0.453592) / 1000;
    case 'mt': // Metric tons
      return value;
    default:
      console.warn(`Unsupported unit "${unit}" provided for normalization. Defaulting to assuming MT.`);
      return value;
  }
};
