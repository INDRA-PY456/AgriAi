export const demoCropAnalysis = {
  crop: 'Tomato Leaf',
  disease: 'Early Blight',
  confidence: 94,
  severity: 'Moderate',
  severityScore: 62,
  description: 'The leaf shows symptoms commonly associated with early blight, including dark spots and yellowing around affected areas.',
  progressionRisk: 72,
  progressionExplanation: 'Warm temperatures, high humidity and upcoming rainfall may increase disease progression.',
  recommendations: [
    { title: 'Remove infected leaves', description: 'Remove heavily infected leaves and dispose of them away from healthy plants.', icon: '✂️', priority: 'high' },
    { title: 'Avoid overhead watering', description: 'Keep foliage dry whenever possible. Use drip irrigation or water at the base of the plant.', icon: '💧', priority: 'high' },
    { title: 'Monitor the crop', description: 'Inspect nearby plants for similar symptoms. Early detection helps prevent spread.', icon: '🔍', priority: 'medium' },
    { title: 'Fungicide treatment', description: 'Consider an appropriate fungicide according to local agricultural guidance and product instructions.', icon: '🧴', priority: 'medium', disclaimer: 'Always follow local agricultural recommendations and product labels for chemical treatments.' },
  ],
};
