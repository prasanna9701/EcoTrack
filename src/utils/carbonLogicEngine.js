/**
 * @file carbonLogicEngine.js
 * @description The mathematical brain of EcoTrack for calculating Scope 1, 2, and 3 emissions.
 */

import { ELECTRICITY_FACTORS, FUEL_FACTORS, TRAVEL_FACTORS, normalizeToMT } from './emissionFactors.js';

/**
 * Helper to zero-out negative inputs (preventing negative emissions unless intended).
 * @param {number} value
 * @returns {number} 0 if negative, else value.
 */
const sanitizeInput = (value) => (value && value > 0 ? value : 0);

/**
 * Calculates Scope 1 Carbon Emissions (Natural Gas).
 * @param {number} volume - Volume of Fuel used.
 * @param {string} unit - Unit of fuel ('therms' or 'm3').
 * @returns {{ value: number, source: string }} The kgCO2e emissions and its data source.
 */
export const calculateScope1 = (volume, unit = 'therms') => {
  const safeVolume = sanitizeInput(volume);
  const normUnit = unit.toLowerCase();
  
  let factorObj;
  if (normUnit === 'm3') {
    factorObj = FUEL_FACTORS.NATURAL_GAS_M3;
  } else {
    // Default to Therms
    factorObj = FUEL_FACTORS.NATURAL_GAS_THERM;
  }

  return {
    value: safeVolume * factorObj.value,
    source: factorObj.source
  };
};

/**
 * Calculates Scope 2 Carbon Emissions (Purchased Electricity).
 * @param {number} kWh - Total kWh consumed.
 * @param {string} region - Region identifier ('us' or 'global').
 * @returns {{ value: number, source: string }} The kgCO2e emissions and its data source.
 */
export const calculateScope2 = (kWh, region = 'india') => {
  const safeKwh = sanitizeInput(kWh);
  
  let factorObj = ELECTRICITY_FACTORS.INDIA_GRID; 
  if (region.toLowerCase() === 'us') {
    factorObj = ELECTRICITY_FACTORS.US_EGRID;
  } else if (region.toLowerCase() === 'global') {
    factorObj = ELECTRICITY_FACTORS.GLOBAL_IEA;
  }

  return {
    value: safeKwh * factorObj.value,
    source: factorObj.source
  };
};

/**
 * Calculates Scope 3 Carbon Emissions (Business Travel).
 * @param {number} distance - Distance traveled.
 * @param {string} type - Vehicle type ('car' or 'flight_short' or 'flight_long').
 * @param {string} unit - Distance unit ('mile' or 'km').
 * @returns {{ value: number, source: string }} The kgCO2e emissions and its data source.
 */
export const calculateScope3 = (distance, type = 'car', unit = 'mile') => {
  const safeDistance = sanitizeInput(distance);
  const normType = type.toLowerCase();
  const normUnit = unit.toLowerCase();

  let factorObj = TRAVEL_FACTORS.CAR_MILE; // Default safe fallback

  if (normType === 'car') {
    factorObj = normUnit === 'km' ? TRAVEL_FACTORS.CAR_KM : TRAVEL_FACTORS.CAR_MILE;
  } else if (normType === 'flight_short') {
    factorObj = TRAVEL_FACTORS.FLIGHT_SHORT_MILE;
    // Assuming short haul flight is typically calculated per mile in our simple setup.
    // If unit is km, we'd manually convert km to miles first: 1 km = 0.621371 miles
    const distanceModifier = normUnit === 'km' ? 0.621371 : 1;
    return {
      value: safeDistance * distanceModifier * factorObj.value,
      source: factorObj.source
    };
  } else if (normType === 'flight_long') {
    factorObj = TRAVEL_FACTORS.FLIGHT_LONG_MILE;
    const distanceModifier = normUnit === 'km' ? 0.621371 : 1;
    return {
      value: safeDistance * distanceModifier * factorObj.value,
      source: factorObj.source
    };
  }

  return {
    value: safeDistance * factorObj.value,
    source: factorObj.source
  };
};

/**
 * Generates an audit-ready JSON report containing overall carbon emission metrics.
 *
 * @param {Object} inputObject - Contains all raw inputs from the user.
 * @param {Object} [inputObject.scope1] - { volume, unit }
 * @param {Object} [inputObject.scope2] - { kWh, region }
 * @param {Array}  [inputObject.scope3List] - Array of { distance, type, unit }
 * @returns {Object} JSON Report mapping to the specified AI Agent format constraint.
 */
export const generateCarbonReport = (inputObject) => {
  // 1) Compute kgCO2e equivalents
  let scope1kg = { value: 0, source: 'No Scope 1 Input' };
  if (inputObject?.scope1) {
    scope1kg = calculateScope1(inputObject.scope1.volume, inputObject.scope1.unit);
  }

  let scope2kg = { value: 0, source: 'No Scope 2 Input' };
  if (inputObject?.scope2) {
    scope2kg = calculateScope2(inputObject.scope2.kWh, inputObject.scope2.region);
  }

  let scope3Total = 0;
  let scope3Sources = new Set();
  
  if (inputObject?.scope3List && Array.isArray(inputObject.scope3List)) {
    inputObject.scope3List.forEach(travelItem => {
      const result = calculateScope3(travelItem.distance, travelItem.type, travelItem.unit);
      scope3Total += result.value;
      scope3Sources.add(result.source);
    });
  }

  const scope3kg = {
    value: scope3Total,
    source: scope3Sources.size > 0 ? Array.from(scope3Sources).join(', ') : 'No Scope 3 Input'
  };

  // Convert kgCO2e to Metric Tons (MT)
  // Float precision enforced up to 4 decimal places
  const scope1MT = Number(normalizeToMT(scope1kg.value, 'kg').toFixed(2));
  const scope2MT = Number(normalizeToMT(scope2kg.value, 'kg').toFixed(2));
  const scope3MT = Number(normalizeToMT(scope3kg.value, 'kg').toFixed(2));

  const totalEmissionsMT = Number((scope1MT + scope2MT + scope3MT).toFixed(2));

  const requiredCredits = totalEmissionsMT;

  // Confidence factor determining logic
  let confidenceScore = 'High';
  if ((inputObject.scope2 && !inputObject.scope2.region) || (inputObject.scope3List && inputObject.scope3List.length > 0 && !inputObject.scope3List[0].type)) {
    confidenceScore = 'Medium'; // E.g., user is missing key detailed attributes and we fell back to globals!
  }

  // Dynamic actionable tips based on highest emitting scope
  const recommendations = [];
  const maxEmissions = Math.max(scope1MT, scope2MT, scope3MT);
  
  if (maxEmissions === 0) {
      recommendations.push("You're displaying a Net Zero emission portfolio; great job!");
  } else if (maxEmissions === scope2MT) {
      recommendations.push("Switching to LED lighting or purchasing renewable energy certificates could significantly reduce your Scope 2 emissions.");
      recommendations.push("Consider investing in smart thermostats for your facilities.");
  } else if (maxEmissions === scope1MT) {
      recommendations.push("Your Scope 1 emissions are high. Consider electrifying heating systems to move away from Natural Gas dependence.");
  } else if (maxEmissions === scope3MT) {
      recommendations.push("Business travel is your leading carbon factor. Try incentivizing virtual meetings or choosing rail over short-haul flights.");
  }

  return {
    totalEmissionsMT,
    requiredCredits,
    breakdown: {
      scope1: {
        value: scope1MT,
        source: scope1kg.source
      },
      scope2: {
        value: scope2MT,
        source: scope2kg.source
      },
      scope3: {
        value: scope3MT,
        source: scope3kg.source
      }
    },
    confidenceScore,
    recommendations,
    timestamp: new Date().toISOString()
  };
};
