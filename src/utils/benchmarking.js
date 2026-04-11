/**
 * @file benchmarking.js
 * @description Grades user carbon data empirically against industry medians
 */

export const INDUSTRY_STANDARDS = {
  indian_household: { medianMT: 0.25 }, // approx 300 kwh @ 0.82 
  tech: { medianMT: 15 },
  retail: { medianMT: 35 },
  manufacturing: { medianMT: 150 },
  default: { medianMT: 0.25 }
};

/**
 * Calculates comparative performance logic mathematically
 * @param {number} userMT - User's calculated Metric Tons
 * @param {string} industryType - Target industry median pool
 * @returns {Object} JSON mapping percentile structures and letter grading
 */
export const calculatePerformance = (userMT, industryType = 'tech') => {
  const normType = industryType.toLowerCase();
  const median = INDUSTRY_STANDARDS[normType]?.medianMT || INDUSTRY_STANDARDS.default.medianMT;

  const difference = median - userMT;
  const percentDiff = Math.abs((difference / median) * 100).toFixed(0);

  let grade = 'C';
  let comparisonString = `Average`;
  let feedback = `You are matching the industry average.`;

  if (userMT < median * 0.5) {
      grade = 'A';
      comparisonString = "Top 10%";
      feedback = `You are emitting ${percentDiff}% less than the industry average. Keep it up!`;
  } else if (userMT < median * 0.9) {
      grade = 'B';
      comparisonString = "Top 30%";
      feedback = `You are emitting ${percentDiff}% less than the industry average. Good work!`;
  } else if (userMT <= median * 1.1) {
      grade = 'C';
      comparisonString = "Average";
      feedback = `You are around the industry average. Procuring credits could elevate your ranking.`;
  } else {
      grade = 'F';
      comparisonString = "Bottom 20%";
      feedback = `You are emitting ${percentDiff}% more than the industry average. Offset action recommended.`;
  }

  return { grade, comparisonString, feedback };
};
