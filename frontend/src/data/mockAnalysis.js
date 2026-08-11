/**
 * Mock data for the AI analysis.
 * TODO: replace `simulateAnalysis` with a real API call (e.g. POST /api/analyze
 * with the image file) once the backend is available.
 */

const MOCK_RESULTS = [
  {
    cropName: "Tomato",
    disease: "Late Blight",
    confidence: 0.94,
    severity: "High",
    action:
      "Remove and destroy infected leaves immediately. Apply a copper-based fungicide every 7–10 days, and improve airflow by spacing plants and pruning lower foliage. Avoid overhead watering.",
  },
  {
    cropName: "Wheat",
    disease: "Leaf Rust",
    confidence: 0.88,
    severity: "Moderate",
    action:
      "Apply a labeled fungicide (e.g. triazole or strobilurin) at the first sign of infection. Rotate crops and plant rust-resistant wheat varieties next season.",
  },
  {
    cropName: "Rice",
    disease: "Healthy Leaf",
    confidence: 0.97,
    severity: "None",
    action:
      "No action needed. Keep up the current watering and fertilization schedule, and continue scouting weekly for early signs of disease.",
  },
  {
    cropName: "Maize",
    disease: "Northern Leaf Blight",
    confidence: 0.82,
    severity: "Moderate",
    action:
      "Apply a preventive fungicide and ensure proper crop rotation. Remove crop debris after harvest to reduce overwintering inoculum.",
  },
];

/**
 * Pretends to run the AI model on the uploaded photo.
 * Returns a Promise that resolves to a mock analysis result.
 * Pass `index` to force a specific mock result (used by the dashboard demo
 * state so the pre-loaded sample image always matches its analysis).
 */
export function simulateAnalysis(delayMs = 1800, index = null) {
  return new Promise((resolve) => {
    setTimeout(() => {
      const pick =
        index != null ? MOCK_RESULTS[index % MOCK_RESULTS.length] : MOCK_RESULTS[Math.floor(Math.random() * MOCK_RESULTS.length)];
      resolve({ ...pick });
    }, delayMs);
  });
}
