import { demoCropAnalysis } from '../data/demoCropAnalysis.js';

/**
 * Demo implementation. Should be replaced with a real AI vision model call.
 */
export const analyzeCrop = (imageFile) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(demoCropAnalysis);
    }, 1500);
  });
};

export const calculateHealthScore = (analysis, weather) => {
  let score = 100;
  
  const diseaseImpact = analysis.severityScore * 0.4;
  score -= diseaseImpact;
  
  const weatherRisk = (weather.current.humidity > 75 ? 15 : 5) + (weather.current.rainProbability > 50 ? 10 : 3);
  score -= weatherRisk;
  
  const spreadProbability = analysis.progressionRisk * 0.15;
  score -= spreadProbability;
  
  const overall = Math.max(0, Math.min(100, Math.round(score)));
  
  return {
    overall,
    breakdown: {
      diseaseSeverity: Math.min(100, Math.max(0, Math.round(diseaseImpact * 2.5))), // roughly 0-100 scaling
      weatherRisk: Math.min(100, Math.max(0, Math.round(weatherRisk * 4))),
      spreadProbability: Math.min(100, Math.max(0, Math.round(spreadProbability * (100/15))))
    }
  };
};
