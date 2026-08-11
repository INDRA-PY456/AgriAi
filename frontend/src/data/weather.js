/**
 * AgriAI Weather + Location Services
 *
 * Uses free, keyless APIs:
 * - Open-Meteo Forecast API
 * - Open-Meteo Geocoding API
 * - BigDataCloud Reverse Geocoding API
 */

const FORECAST_URL = "https://api.open-meteo.com/v1/forecast";
const GEOCODE_URL = "https://geocoding-api.open-meteo.com/v1/search";
const REVERSE_URL =
  "https://api.bigdatacloud.net/data/reverse-geocode-client";

/**
 * Search a place by name.
 */
export async function searchLocation(query) {
  const url = `${GEOCODE_URL}?name=${encodeURIComponent(
    query
  )}&count=1&language=en&format=json`;

  const res = await fetch(url);

  if (!res.ok) {
    throw new Error("Could not reach the location service.");
  }

  const data = await res.json();
  const place = data.results && data.results[0];

  if (!place) {
    throw new Error(`No location found for "${query}".`);
  }

  return {
    name: place.name,
    admin1: place.admin1,
    country: place.country,
    latitude: place.latitude,
    longitude: place.longitude,
  };
}

/**
 * Convert coordinates into a human-readable location.
 */
export async function reverseGeocode(latitude, longitude) {
  try {
    const url = `${REVERSE_URL}?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`;

    const res = await fetch(url);

    if (!res.ok) return null;

    const data = await res.json();

    const name =
      data.city ||
      data.locality ||
      data.principalSubdivision;

    if (!name) return null;

    return {
      name,
      admin1: data.principalSubdivision,
      country: data.countryName,
      latitude,
      longitude,
    };
  } catch {
    return null;
  }
}

/**
 * Fetch current weather + hourly forecast + daily forecast.
 *
 * Returns:
 * - Current temperature
 * - Humidity
 * - Wind
 * - Rain
 * - Weather condition
 * - Next 24 hours
 * - Next 7 days
 */
export async function fetchCurrentWeather(latitude, longitude) {
  const params = new URLSearchParams({
    latitude: String(latitude),
    longitude: String(longitude),

    // Current conditions
    current:
      "temperature_2m,apparent_temperature,relative_humidity_2m,precipitation,rain,weather_code,wind_speed_10m,is_day",

    // Hourly forecast
    hourly:
      "temperature_2m,precipitation_probability,precipitation,rain,weather_code,relative_humidity_2m,wind_speed_10m",

    // Daily forecast
    daily:
      "weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max,precipitation_sum,rain_sum",

    forecast_days: "7",

    timezone: "auto",
  });

  const res = await fetch(`${FORECAST_URL}?${params.toString()}`);

  if (!res.ok) {
    throw new Error("Could not load weather data.");
  }

  const data = await res.json();

  const current = data.current;
  const hourly = data.hourly;
  const daily = data.daily;

  /*
   * Find the current hour in the hourly forecast.
   * Open-Meteo returns timestamps matching the requested timezone.
   */
  const currentTime = current.time;

  let currentHourIndex = hourly.time.indexOf(currentTime);

  if (currentHourIndex === -1) {
    currentHourIndex = 0;
  }

  /*
   * Build the next 24 hours.
   */
  const next24Hours = hourly.time
    .slice(currentHourIndex, currentHourIndex + 24)
    .map((time, index) => {
      const actualIndex = currentHourIndex + index;

      return {
        time,
        temperature: Math.round(hourly.temperature_2m[actualIndex]),
        rainProbability:
          hourly.precipitation_probability?.[actualIndex] ?? 0,
        precipitation:
          hourly.precipitation?.[actualIndex] ?? 0,
        rain:
          hourly.rain?.[actualIndex] ?? 0,
        humidity:
          hourly.relative_humidity_2m?.[actualIndex] ?? null,
        windSpeed:
          Math.round(hourly.wind_speed_10m?.[actualIndex] ?? 0),
        weatherCode:
          hourly.weather_code?.[actualIndex] ?? 0,
      };
    });

  /*
   * Build the next 7 days.
   */
  const next7Days = daily.time.map((date, index) => ({
    date,

    weatherCode: daily.weather_code?.[index] ?? 0,

    maxTemperature:
      Math.round(daily.temperature_2m_max?.[index] ?? 0),

    minTemperature:
      Math.round(daily.temperature_2m_min?.[index] ?? 0),

    rainProbability:
      daily.precipitation_probability_max?.[index] ?? 0,

    precipitation:
      daily.precipitation_sum?.[index] ?? 0,

    rain:
      daily.rain_sum?.[index] ?? 0,
  }));

  /*
   * Find the highest rain probability during
   * the next 24 hours.
   */
  const maxRainProbability = next24Hours.length
    ? Math.max(
        ...next24Hours.map((hour) => hour.rainProbability)
      )
    : 0;

  /*
   * Find the first significant upcoming rain.
   */
  const upcomingRain = next24Hours.find(
    (hour) =>
      hour.rainProbability >= 50 ||
      hour.precipitation >= 0.5
  );

  return {
    // -------------------------
    // CURRENT CONDITIONS
    // -------------------------

    temperature: Math.round(current.temperature_2m),

    apparentTemperature: Math.round(
      current.apparent_temperature
    ),

    humidity: current.relative_humidity_2m,

    precipitation: current.precipitation,

    rain: current.rain ?? 0,

    windSpeed: Math.round(current.wind_speed_10m),

    isDay: current.is_day === 1,

    code: current.weather_code,

    unit:
      data.current_units?.temperature_2m || "°C",

    // -------------------------
    // FORECAST
    // -------------------------

    next24Hours,

    next7Days,

    // -------------------------
    // AGRICULTURAL WEATHER DATA
    // -------------------------

    maxRainProbability,

    upcomingRain: upcomingRain || null,

    forecastSummary: {
      rainExpected: Boolean(upcomingRain),

      maxRainProbability,

      nextRainTime: upcomingRain
        ? upcomingRain.time
        : null,

      nextRainProbability: upcomingRain
        ? upcomingRain.rainProbability
        : 0,

      nextRainAmount: upcomingRain
        ? upcomingRain.precipitation
        : 0,
    },
  };
}

/**
 * Convert Open-Meteo WMO weather code
 * into a readable condition.
 */
export function describeWeatherCode(
  code,
  isDay = true
) {
  const table = {
    0: {
      label: "Clear sky",
      icon: isDay ? "☀️" : "🌙",
    },

    1: {
      label: "Mostly clear",
      icon: isDay ? "🌤️" : "🌙",
    },

    2: {
      label: "Partly cloudy",
      icon: "⛅",
    },

    3: {
      label: "Overcast",
      icon: "☁️",
    },

    45: {
      label: "Fog",
      icon: "🌫️",
    },

    48: {
      label: "Rime fog",
      icon: "🌫️",
    },

    51: {
      label: "Light drizzle",
      icon: "🌦️",
    },

    53: {
      label: "Drizzle",
      icon: "🌦️",
    },

    55: {
      label: "Dense drizzle",
      icon: "🌧️",
    },

    56: {
      label: "Freezing drizzle",
      icon: "🌧️",
    },

    57: {
      label: "Freezing drizzle",
      icon: "🌧️",
    },

    61: {
      label: "Light rain",
      icon: "🌦️",
    },

    63: {
      label: "Rain",
      icon: "🌧️",
    },

    65: {
      label: "Heavy rain",
      icon: "🌧️",
    },

    66: {
      label: "Freezing rain",
      icon: "🌧️",
    },

    67: {
      label: "Freezing rain",
      icon: "🌧️",
    },

    71: {
      label: "Light snow",
      icon: "🌨️",
    },

    73: {
      label: "Snow",
      icon: "🌨️",
    },

    75: {
      label: "Heavy snow",
      icon: "❄️",
    },

    77: {
      label: "Snow grains",
      icon: "❄️",
    },

    80: {
      label: "Light showers",
      icon: "🌦️",
    },

    81: {
      label: "Showers",
      icon: "🌧️",
    },

    82: {
      label: "Violent showers",
      icon: "⛈️",
    },

    85: {
      label: "Snow showers",
      icon: "🌨️",
    },

    86: {
      label: "Snow showers",
      icon: "🌨️",
    },

    95: {
      label: "Thunderstorm",
      icon: "⛈️",
    },

    96: {
      label: "Thunderstorm with hail",
      icon: "⛈️",
    },

    99: {
      label: "Thunderstorm with hail",
      icon: "⛈️",
    },
  };

  return (
    table[code] ?? {
      label: "Unknown conditions",
      icon: "🌡️",
    }
  );
}