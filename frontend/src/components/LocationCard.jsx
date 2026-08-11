import { useState } from "react";
import {
  describeWeatherCode,
  fetchCurrentWeather,
  reverseGeocode,
  searchLocation,
} from "../data/weather";

const STATUS = {
  IDLE: "idle",
  LOADING: "loading",
  READY: "ready",
  ERROR: "error",
};

function PinIcon({ className = "h-4 w-4" }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <path d="M12 21s-7-5.1-7-11a7 7 0 0 1 14 0c0 5.9-7 11-7 11Z" />
      <circle cx="12" cy="10" r="2.5" />
    </svg>
  );
}

function CloudIcon({ className = "h-4 w-4" }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <path d="M17.5 19a4.5 4.5 0 1 0-.9-8.9 6 6 0 0 0-11.6 1.9A3.8 3.8 0 0 0 7 19h10.5Z" />
    </svg>
  );
}

function Spinner() {
  return (
    <span
      className="h-4 w-4 animate-spin rounded-full border-2 border-emerald-200 border-t-emerald-600"
      aria-hidden="true"
    />
  );
}

export default function LocationCard({ onWeatherUpdate }) {
  const [location, setLocation] = useState(null);
  const [weather, setWeather] = useState(null);
  const [weatherStatus, setWeatherStatus] = useState(STATUS.IDLE);
  const [weatherError, setWeatherError] = useState(null);
  const [query, setQuery] = useState("");
  const [locating, setLocating] = useState(false);
  const [pinError, setPinError] = useState(null);

  // Fix the location and fetch its current weather.
  const loadWeather = async (place) => {
  setLocation(place);
  setWeatherStatus(STATUS.LOADING);
  setWeatherError(null);

  try {
    const w = await fetchCurrentWeather(
      place.latitude,
      place.longitude
    );

    setWeather(w);
    setWeatherStatus(STATUS.READY);

    // Send location + weather to App.jsx
    if (onWeatherUpdate) {
      onWeatherUpdate({
        location: place,
        weather: w,
      });
    }
  } catch {
    setWeatherError(
      "Could not load weather for this location."
    );
    setWeatherStatus(STATUS.ERROR);
  }
};  

  // Option 1: use the browser's geolocation (pinned).
  const handlePin = () => {
    if (!navigator.geolocation) {
      setPinError("Geolocation is not supported by this browser. Try typing a place instead.");
      return;
    }
    setLocating(true);
    setPinError(null);

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        try {
          const place = await reverseGeocode(latitude, longitude);
          await loadWeather(
            place ?? {
              name: `${latitude.toFixed(2)}°, ${longitude.toFixed(2)}°`,
              latitude,
              longitude,
            },
          );
        } catch {
          await loadWeather({
            name: `${latitude.toFixed(2)}°, ${longitude.toFixed(2)}°`,
            latitude,
            longitude,
          });
        } finally {
          setLocating(false);
        }
      },
      () => {
        setLocating(false);
        setPinError("Location access was denied. Try typing a place instead.");
      },
      { timeout: 10000, maximumAge: 300000 },
    );
  };

  // Option 2: search for a typed place name.
  const handleSearch = async (event) => {
    event.preventDefault();
    const q = query.trim();
    if (!q) return;

    setPinError(null);
    setWeatherStatus(STATUS.LOADING);
    try {
      const place = await searchLocation(q);
      await loadWeather(place);
    } catch (err) {
      setWeatherError(err.message || "Could not find that location.");
      setWeatherStatus(STATUS.ERROR);
    }
  };

  const handleChange = () => {
    setLocation(null);
    setWeather(null);
    setWeatherStatus(STATUS.IDLE);
    setWeatherError(null);
  };
if (onWeatherUpdate) {
  onWeatherUpdate({
    location: null,
    weather: null,
  });
}
  const condition = weather ? describeWeatherCode(weather.code, weather.isDay) : null;

  return (
    <section
      aria-label="Local weather"
      className="animate-rise-in relative overflow-hidden rounded-3xl border border-white/70 bg-white/80 shadow-xl shadow-emerald-900/10 backdrop-blur-xl"
    >
      {/* Sky-tinted accent bar */}
      <div
        className="h-1 w-full bg-gradient-to-r from-sky-500 via-emerald-400 to-emerald-300"
        aria-hidden="true"
      />

      <div className="p-5 sm:p-6">
        <p className="mb-4 flex items-center gap-2 text-sm font-bold text-stone-700">
          <span className="flex h-7 w-7 items-center justify-center rounded-full bg-sky-100 text-sky-600">
            <CloudIcon className="h-4 w-4" />
          </span>
          Local weather
        </p>

        {!location ? (
          <>
            {/* Pin option */}
            <button
              type="button"
              onClick={handlePin}
              disabled={locating}
              className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-emerald-300/70 bg-white/70 px-4 py-2.5 text-sm font-semibold text-emerald-700 shadow-sm transition-all duration-200 hover:border-emerald-400 hover:bg-emerald-50/70 disabled:cursor-wait disabled:opacity-70 sm:w-auto"
            >
              {locating ? <Spinner /> : <PinIcon />}
              {locating ? "Locating…" : "Use my location"}
            </button>
            {pinError && (
              <p role="alert" className="mt-2 text-xs font-medium text-red-600">
                {pinError}
              </p>
            )}

            {/* Typed option */}
            <form onSubmit={handleSearch} className="mt-3 flex flex-col gap-2 sm:flex-row">
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Or type a city, e.g. Bengaluru"
                className="w-full flex-1 rounded-xl border border-stone-200 bg-white/70 px-4 py-2.5 text-sm text-stone-800 placeholder-stone-400 shadow-sm transition-all duration-200 focus:border-emerald-400 focus:ring-4 focus:ring-emerald-100 focus:outline-none"
              />
              <button
                type="submit"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-b from-emerald-500 to-emerald-600 px-5 py-2.5 text-sm font-semibold text-white shadow-md shadow-emerald-600/20 transition-all duration-200 hover:-translate-y-0.5 hover:from-emerald-600 hover:to-emerald-700 focus:ring-4 focus:ring-emerald-200 focus:outline-none active:translate-y-0"
              >
                Search
              </button>
            </form>
          </>
        ) : (
          <>
            {/* Fixed location */}
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="flex items-center gap-1.5 text-base font-semibold text-stone-800">
                  <span className="text-emerald-600">
                    <PinIcon className="h-4 w-4" />
                  </span>
                  <span className="truncate">{location.name}</span>
                </p>
                <p className="mt-0.5 text-xs text-stone-400">
                  {[location.admin1, location.country].filter(Boolean).join(", ") ||
                    `${location.latitude.toFixed(2)}°, ${location.longitude.toFixed(2)}°`}
                </p>
              </div>
              <button
                type="button"
                onClick={handleChange}
                className="text-xs font-semibold text-emerald-700 transition-colors hover:text-emerald-800 hover:underline"
              >
                Change
              </button>
            </div>

            {/* Weather */}
            {weatherStatus === STATUS.LOADING && (
              <div className="mt-4 flex items-center gap-3 rounded-2xl border border-emerald-200/60 bg-emerald-50/60 px-4 py-4 text-sm text-stone-500">
                <Spinner />
                Loading current conditions…
              </div>
            )}

            {weatherStatus === STATUS.ERROR && (
              <p role="alert" className="mt-4 text-sm font-medium text-red-600">
                {weatherError}
              </p>
            )}

            {weatherStatus === STATUS.READY && weather && condition && (
              <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-3 rounded-2xl border border-emerald-200/60 bg-emerald-50/60 px-4 py-4">
                <span className="text-4xl leading-none" aria-hidden="true">
                  {condition.icon}
                </span>
                <div className="min-w-0">
                  <p className="text-3xl font-bold text-stone-900">
                    {weather.temperature}
                    <span className="ml-0.5 text-lg font-semibold text-stone-500">
                      {weather.unit}
                    </span>
                  </p>
                  <p className="text-sm text-stone-500">{condition.label}</p>
                </div>
                <dl className="ml-auto grid grid-cols-2 gap-x-6 gap-y-1 text-sm text-stone-600 sm:grid-cols-2">
                  <div className="flex items-center gap-1.5">
                    <dt className="text-stone-400">Feels like</dt>
                    <dd className="font-semibold text-stone-700">
                      {weather.apparentTemperature}
                      {weather.unit}
                    </dd>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <dt className="text-stone-400">Humidity</dt>
                    <dd className="font-semibold text-stone-700">{weather.humidity}%</dd>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <dt className="text-stone-400">Wind</dt>
                    <dd className="font-semibold text-stone-700">{weather.windSpeed} km/h</dd>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <dt className="text-stone-400">Precipitation</dt>
                    <dd className="font-semibold text-stone-700">
                      {weather.precipitation > 0 ? `${weather.precipitation} mm` : "None"}
                    </dd>
                  </div>
                </dl>
              </div>
            )}
          </>
        )}
      </div>
    </section>
  );
}
