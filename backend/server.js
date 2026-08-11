const express = require("express");
const cors = require("cors");
const multer = require("multer");
const { GoogleGenAI } = require("@google/genai");
require("dotenv").config();

const app = express();

const PORT = process.env.PORT || 5000;

const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024,
  },
});

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

app.use(cors());
app.use(express.json({ limit: "10mb" }));

// ============================================================
// CROP ANALYSIS
// ============================================================

app.post("/api/analyze", upload.single("image"), async (req, res) => {
  try {
    console.log("\n=================================");
    console.log("Crop analysis request received");
    console.log("=================================");

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "No image uploaded",
      });
    }

    console.log("Image:", req.file.originalname);
    console.log("Type:", req.file.mimetype);
    console.log("Size:", req.file.size);

    // --------------------------------------------------------
    // Read location and weather sent by frontend
    // --------------------------------------------------------

    let location = null;
    let weather = null;

    try {
      if (req.body.location) {
        location = JSON.parse(req.body.location);
      }

      if (req.body.weather) {
        weather = JSON.parse(req.body.weather);
      }
    } catch (error) {
      console.log("Could not parse location/weather:", error.message);
    }

    console.log("Location:", location);
    console.log("Weather:", weather);

    // --------------------------------------------------------
    // Build weather context
    // --------------------------------------------------------

    const locationText = location
      ? `
Location:
- Place: ${location.name || "Unknown"}
- State/Region: ${location.admin1 || "Unknown"}
- Country: ${location.country || "Unknown"}
- Latitude: ${location.latitude ?? "Unknown"}
- Longitude: ${location.longitude ?? "Unknown"}
`
      : "Location information is not available.";

    const weatherText = weather
      ? `
Current weather:
- Temperature: ${weather.temperature ?? "Unknown"} ${weather.unit || ""}
- Feels like: ${weather.apparentTemperature ?? "Unknown"} ${weather.unit || ""}
- Humidity: ${weather.humidity ?? "Unknown"}%
- Wind: ${weather.windSpeed ?? "Unknown"} km/h
- Precipitation: ${weather.precipitation ?? "Unknown"} mm
- Condition: ${weather.condition || "Unknown"}

Forecast:
${JSON.stringify(weather.forecast || [], null, 2)}
`
      : "Current weather and forecast information are not available.";

    // --------------------------------------------------------
    // Agricultural AI prompt
    // --------------------------------------------------------

  const prompt = `
You are AgriAI, an agricultural crop-health and climate-resilience assistant.

Analyze the uploaded plant/leaf image carefully.

The farmer's current location and weather information are provided below.

FARMER LOCATION:
${location ? JSON.stringify(location, null, 2) : "Location not available"}

CURRENT WEATHER:
${weather ? JSON.stringify(weather, null, 2) : "Weather not available"}

Your task is to combine:
1. Visual evidence from the leaf image
2. Farmer location
3. Current weather conditions

Provide practical, conservative agricultural guidance.

Determine:

1. Crop or plant
2. Most likely disease or health condition
3. Confidence from 0 to 100
4. Severity: None, Low, Moderate, High, Severe, or Unknown
5. Risk from 0 to 100
6. Visible symptoms
7. Recommended treatment
8. Prevention measures
9. Best time to act considering the current weather
10. Weather-related warning
11. Whether the current conditions are favorable or unfavorable for disease development or treatment

IMPORTANT:
- Do not claim certainty from an image alone.
- If the image is unclear, say so.
- If the image is not a plant or leaf, clearly state that.
- Do not invent weather information.
- Use the supplied weather data when making weather-related recommendations.
- Do not recommend spraying immediately if rain or other conditions make treatment unsuitable.
- Avoid unnecessarily specific chemical dosages.
- Recommend following locally approved product labels and agricultural guidance.
- Keep recommendations practical for farmers.

Return ONLY valid JSON in this exact structure:

{
  "crop": "string",
  "disease": "string",
  "confidence": 0,
  "severity": "None",
  "risk": 0,
  "symptoms": [
    "string"
  ],
  "treatment": "string",
  "prevention": "string",
  "bestTimeToAct": "string",
  "weatherWarning": "string",
  "weatherSuitability": "Favorable or Unfavorable or Uncertain",
  "reasoning": "short explanation connecting the crop condition with the supplied weather"
}
`;

    // --------------------------------------------------------
    // Send image + prompt to Gemini
    // --------------------------------------------------------

    const response = await ai.models.generateContent({
      model: process.env.GEMINI_MODEL || "gemini-3.5-flash-lite",
      contents: [
        {
          inlineData: {
            mimeType: req.file.mimetype,
            data: req.file.buffer.toString("base64"),
          },
        },
        {
          text: prompt,
        },
      ],
      config: {
        responseMimeType: "application/json",
      },
    });

    // --------------------------------------------------------
    // Parse Gemini response
    // --------------------------------------------------------

    let analysis;

    try {
      analysis = JSON.parse(response.text);
    } catch (error) {
      console.error("Could not parse Gemini JSON:", response.text);

      return res.status(500).json({
        success: false,
        message: "Gemini returned invalid JSON",
      });
    }

    console.log("Gemini analysis:", analysis);

    // --------------------------------------------------------
    // Return result to frontend
    // --------------------------------------------------------

    res.json({
      success: true,
      data: analysis,
    });
  } catch (error) {
    console.error("Gemini analysis error:", error);

    res.status(500).json({
      success: false,
      message: "AI analysis failed",
      error: error.message,
    });
  }
});

// ============================================================
// HEALTH CHECK
// ============================================================

app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "AgriAI backend is running",
  });
});

// ============================================================
// TEST ENDPOINT
// ============================================================

app.get("/api/test", (req, res) => {
  res.json({
    success: true,
    message: "AgriAI API connection successful",
  });
});

// ============================================================
// START SERVER
// ============================================================

app.listen(PORT, () => {
  console.log(`AgriAI backend running on port ${PORT}`);
});