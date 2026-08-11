import { useEffect, useState } from "react";
import BotanicalBackground from "./components/BotanicalBackground";
import ImageUploader from "./components/ImageUploader";
import LocationCard from "./components/LocationCard";
import ResultCard from "./components/ResultCard";
import { simulateAnalysis } from "./data/mockAnalysis";

const STATUS = {
  IDLE: "idle",
  ANALYZING: "analyzing",
  DONE: "done",
};

// Sample image + matching analysis shown on first load so the dashboard
// never opens empty. Real photo (CC BY 2.0, Wikimedia Commons: "Late blight
// on tomato leaf") matching the demo result. Users can replace the image
// and re-analyze as usual.
const DEMO_IMAGE_URL = "/demo-crop.jpg";
const DEMO_RESULT_INDEX = 0; // Tomato / Late Blight (matches demo-crop.jpg)

export default function App() {
  const [image, setImage] = useState(null); // { file, previewUrl }
  const [status, setStatus] = useState(STATUS.IDLE);
  const [result, setResult] = useState(null);
  const [location, setLocation] = useState(null);
const [weather, setWeather] = useState(null);
const handleWeatherUpdate = ({ location, weather }) => {
  setLocation(location);
  setWeather(weather);
};

  // Revoke object URLs when the image changes or the app unmounts.
  useEffect(() => {
    return () => {
      if (image) URL.revokeObjectURL(image.previewUrl);
    };
  }, [image]);

  // Pre-load the demo state: upload the sample image and run a matching
  // mock analysis so the dashboard looks complete on open.
  useEffect(() => {
    let cancelled = false;
    setImage({ file: null, previewUrl: DEMO_IMAGE_URL });
    simulateAnalysis(500, DEMO_RESULT_INDEX).then((analysis) => {
      if (!cancelled) {
        setResult(analysis);
        setStatus(STATUS.DONE);
      }
    });
    return () => {
      cancelled = true;
    };
  }, []);

  const handleSelect = (file) => {
    if (image) URL.revokeObjectURL(image.previewUrl);
    setImage({ file, previewUrl: URL.createObjectURL(file) });
    setResult(null);
    setStatus(STATUS.IDLE);
  };

  const handleRemove = () => {
    setImage(null);
    setResult(null);
    setStatus(STATUS.IDLE);
  };

 const handleAnalyze = async () => {
  if (!image || status === STATUS.ANALYZING) return;

  setStatus(STATUS.ANALYZING);
  setResult(null);

  try {
    const formData = new FormData();

formData.append("image", image.file);

if (location) {
  formData.append(
    "location",
    JSON.stringify({
      name: location.name,
      admin1: location.admin1,
      country: location.country,
      latitude: location.latitude,
      longitude: location.longitude,
    })
  );
}

if (weather) {
  formData.append(
    "weather",
    JSON.stringify(weather)
  );
}

    // Location
    if (location) {
      formData.append(
        "location",
        JSON.stringify({
          name: location.name,
          admin1: location.admin1,
          country: location.country,
          latitude: location.latitude,
          longitude: location.longitude,
        })
      );
    }

    // Current weather + forecast data
    if (weather) {
      formData.append("weather", JSON.stringify(weather));
    }

    const response = await fetch(`${import.meta.env.VITE_API_URL}/api/analyze`);

    if (!response.ok) {
      throw new Error(`Server returned ${response.status}`);
    }

    const responseData = await response.json();

    setResult(responseData.data);
    setStatus(STATUS.DONE);
  } catch (error) {
    console.error("Analysis failed:", error);

    setStatus(STATUS.IDLE);

    alert(
      "Could not connect to the AgriAI backend. Make sure the backend server is running."
    );
  }
};
  return (
    <div className="app-background relative min-h-screen text-stone-900">
      <BotanicalBackground />
      <div className="relative z-10 mx-auto flex min-h-screen w-full max-w-5xl flex-col px-4 py-12 sm:px-6 sm:py-20">
        {/* Header */}
        <header className="mb-10 text-center sm:mb-14">
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-emerald-200/70 bg-white/70 px-3.5 py-1.5 text-xs font-semibold text-emerald-700 shadow-sm backdrop-blur-md">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" aria-hidden="true" />
            AI-powered crop diagnosis
          </div>
          <h1 className="font-display text-4xl font-semibold tracking-tight text-emerald-800 sm:text-5xl">
            AgriAI
          </h1>
          <p className="mx-auto mt-4 max-w-md text-sm leading-relaxed text-stone-500 sm:text-base">
            Snap a photo of a crop or leaf and get instant disease detection, severity
            assessment, and treatment advice — right in your pocket.
          </p>
        </header>

        {/* Upload (left) + weather / location / analyze (right) */}
        <div className="mt-8 grid items-start gap-6 sm:mt-10 md:grid-cols-2">
          <ImageUploader image={image} onSelect={handleSelect} onRemove={handleRemove} />

          <div className="flex flex-col gap-6">
           <LocationCard onWeatherUpdate={handleWeatherUpdate} />

            {/* Analyze */}
            <div className="flex flex-col items-center gap-3">
              <button
                type="button"
                onClick={handleAnalyze}
                disabled={!image || status === STATUS.ANALYZING}
                className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-b from-emerald-500 to-emerald-600 px-8 py-4 text-base font-semibold text-white shadow-lg shadow-emerald-600/25 transition-all duration-200 hover:-translate-y-0.5 hover:from-emerald-600 hover:to-emerald-700 hover:shadow-xl hover:shadow-emerald-600/30 focus:ring-4 focus:ring-emerald-200 focus:outline-none active:translate-y-0 active:scale-[0.98] disabled:cursor-not-allowed disabled:bg-none disabled:from-stone-200 disabled:to-stone-200 disabled:text-stone-400 disabled:shadow-none"
              >
                {status === STATUS.ANALYZING ? (
                  <>
                    <span className="flex gap-1" aria-hidden="true">
                      <span className="pulse-dot h-2 w-2 rounded-full bg-white" />
                      <span className="pulse-dot h-2 w-2 rounded-full bg-white" />
                      <span className="pulse-dot h-2 w-2 rounded-full bg-white" />
                    </span>
                    Analyzing…
                  </>
                ) : (
                  <>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="h-5 w-5"
                      aria-hidden="true"
                    >
                      <path d="M21 12a9 9 0 1 1-3-6.7" />
                      <path d="M21 3v6h-6" />
                    </svg>
                    Analyze Crop
                  </>
                )}
              </button>

              {!image && (
                <p className="text-sm text-stone-400">
                  Upload a photo above to enable analysis
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Result */}
        <div className="mt-10 sm:mt-12">
          {status === STATUS.ANALYZING && (
            <div className="animate-rise-in flex flex-col items-center rounded-3xl border border-white/70 bg-white/80 px-6 py-12 text-center shadow-lg shadow-emerald-900/10 backdrop-blur-xl">
              <div className="mb-4 h-10 w-10 animate-spin rounded-full border-4 border-emerald-100 border-t-emerald-600" />
              <p className="text-sm font-medium text-stone-700">
                Analyzing your crop photo…
              </p>
              <p className="mt-1 text-xs text-stone-400">
                Running disease detection model
              </p>
            </div>
          )}

          {status === STATUS.DONE && result && <ResultCard result={result} />}
        </div>

        {/* Footer */}
        <footer className="mt-auto pt-14 text-center text-xs text-stone-400">
          Demo mode — the sample image and results are simulated and not real medical or
          agronomic advice.
        </footer>
      </div>
    </div>
  );
}
