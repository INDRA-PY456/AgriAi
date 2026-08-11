const SEVERITY_STYLES = {
  None: {
    badge: "bg-emerald-100 text-emerald-700 ring-emerald-200",
    bar: "bg-emerald-500",
  },
  Low: {
    badge: "bg-emerald-100 text-emerald-700 ring-emerald-200",
    bar: "bg-emerald-500",
  },
  Moderate: {
    badge: "bg-amber-100 text-amber-700 ring-amber-200",
    bar: "bg-amber-500",
  },
  High: {
    badge: "bg-orange-100 text-orange-700 ring-orange-200",
    bar: "bg-orange-500",
  },
  Severe: {
    badge: "bg-red-100 text-red-700 ring-red-200",
    bar: "bg-red-500",
  },
  Unknown: {
    badge: "bg-stone-100 text-stone-600 ring-stone-200",
    bar: "bg-stone-400",
  },
};

function Icon({ children, className = "h-5 w-5" }) {
  return (
    <span
      className={`flex shrink-0 items-center justify-center rounded-full ${className}`}
      aria-hidden="true"
    >
      {children}
    </span>
  );
}

function Section({ title, icon, children, className = "" }) {
  return (
    <div className={`rounded-2xl border border-stone-100 bg-white/70 p-5 ${className}`}>
      <h3 className="mb-3 flex items-center gap-2 text-sm font-bold text-stone-800">
        {icon}
        {title}
      </h3>
      {children}
    </div>
  );
}

export default function ResultCard({ result }) {
  if (!result) return null;

  const severity = SEVERITY_STYLES[result.severity] ?? SEVERITY_STYLES.Unknown;

  // Gemini returns confidence as 0-100.
  // This also supports the old mock format of 0-1.
  const confidence =
    Number(result.confidence) <= 1
      ? Number(result.confidence) * 100
      : Number(result.confidence);

  const confidencePercent = Math.min(
    100,
    Math.max(0, confidence)
  ).toFixed(1);

  const risk = Number(result.risk ?? 0);
  const riskPercent = Math.min(100, Math.max(0, risk));

  const symptoms = Array.isArray(result.symptoms)
    ? result.symptoms
    : [];

  const cropName = result.crop || result.cropName || "Unknown crop";
  const disease = result.disease || "Condition could not be determined";
  const treatment = result.treatment || result.action || "No treatment information available.";
  const prevention =
    result.prevention || "Continue monitoring the crop for changes.";
  const bestTime =
    result.bestTimeToAct || "Timing could not be determined.";
  const weatherWarning =
    result.weatherWarning || "No weather warning available.";

  return (
    <section
      aria-label="AI crop analysis result"
      className="animate-rise-in relative overflow-hidden rounded-3xl border border-white/70 bg-white/80 shadow-xl shadow-emerald-900/10 backdrop-blur-xl"
    >
      {/* Accent */}
      <div
        className="h-1 w-full bg-gradient-to-r from-emerald-600 via-emerald-400 to-sky-400"
        aria-hidden="true"
      />

      {/* Header */}
      <div className="border-b border-stone-100 px-5 py-6 sm:px-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            <Icon className="h-11 w-11 bg-emerald-100 text-emerald-700">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-6 w-6"
              >
                <path d="M12 21c4.5-2.5 7-6.2 7-11.5C14.5 9.5 9.5 11 8 15c-.5 1.5-.2 3.5 1 5" />
                <path d="M12 21c-2.5-2-4-4.5-4-7.5" />
                <path d="M12 21V9" />
              </svg>
            </Icon>

            <div>
              <p className="text-[0.65rem] font-semibold uppercase tracking-[0.14em] text-stone-400">
                Detected crop
              </p>

              <h2 className="font-display text-2xl font-semibold text-stone-900">
                {cropName}
              </h2>
            </div>
          </div>

          <span
            className={`inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-sm font-semibold shadow-sm ring-1 ${severity.badge}`}
          >
            <span
              className={`h-2 w-2 rounded-full ${severity.bar}`}
              aria-hidden="true"
            />
            {result.severity || "Unknown"} severity
          </span>
        </div>

        <div className="mt-5 rounded-2xl bg-stone-50/80 p-4">
          <p className="text-xs font-semibold uppercase tracking-wider text-stone-400">
            Most likely condition
          </p>

          <p className="mt-1 text-lg font-semibold text-stone-800">
            {disease}
          </p>
        </div>
      </div>

      {/* Confidence + Risk */}
      <div className="grid gap-4 border-b border-stone-100 p-5 sm:grid-cols-2 sm:p-6">
        {/* Confidence */}
        <div className="rounded-2xl border border-emerald-100 bg-emerald-50/60 p-4">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-stone-500">
              AI confidence
            </p>

            <p className="text-lg font-bold text-emerald-700">
              {confidencePercent}%
            </p>
          </div>

          <div
            className="mt-3 h-2 overflow-hidden rounded-full bg-emerald-100"
            role="progressbar"
            aria-valuenow={Number(confidencePercent)}
            aria-valuemin={0}
            aria-valuemax={100}
          >
            <div
              className="h-full rounded-full bg-emerald-500 transition-all duration-700"
              style={{ width: `${confidencePercent}%` }}
            />
          </div>
        </div>

        {/* Risk */}
        <div className="rounded-2xl border border-amber-100 bg-amber-50/60 p-4">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-stone-500">
              Crop risk
            </p>

            <p className="text-lg font-bold text-amber-700">
              {riskPercent}%
            </p>
          </div>

          <div
            className="mt-3 h-2 overflow-hidden rounded-full bg-amber-100"
            role="progressbar"
            aria-valuenow={riskPercent}
            aria-valuemin={0}
            aria-valuemax={100}
          >
            <div
              className="h-full rounded-full bg-amber-500 transition-all duration-700"
              style={{ width: `${riskPercent}%` }}
            />
          </div>
        </div>
      </div>

      {/* Main information */}
      <div className="grid gap-4 p-5 sm:p-6 md:grid-cols-2">
        {/* Symptoms */}
        <Section
          title="Visible symptoms"
          icon={
            <Icon className="h-7 w-7 bg-red-100 text-red-600">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-4 w-4"
              >
                <circle cx="12" cy="12" r="9" />
                <path d="M12 8v4" />
                <path d="M12 16h.01" />
              </svg>
            </Icon>
          }
        >
          {symptoms.length > 0 ? (
            <ul className="space-y-2">
              {symptoms.map((symptom, index) => (
                <li
                  key={index}
                  className="flex gap-2 text-sm leading-relaxed text-stone-600"
                >
                  <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-red-400" />
                  {symptom}
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-stone-500">
              No specific symptoms were provided.
            </p>
          )}
        </Section>

        {/* Best time */}
        <Section
          title="Best time to act"
          icon={
            <Icon className="h-7 w-7 bg-sky-100 text-sky-600">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-4 w-4"
              >
                <circle cx="12" cy="12" r="9" />
                <path d="M12 7v5l3 2" />
              </svg>
            </Icon>
          }
        >
          <p className="text-sm leading-relaxed text-stone-600">
            {bestTime}
          </p>
        </Section>

        {/* Treatment */}
        <Section
          title="Recommended treatment"
          className="md:col-span-2 border-emerald-200/60 bg-emerald-50/60"
          icon={
            <Icon className="h-7 w-7 bg-emerald-100 text-emerald-700">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-4 w-4"
              >
                <path d="M12 3v18" />
                <path d="M5 8c3 0 5 2 7 5 2-3 4-5 7-5" />
                <path d="M5 16c3 0 5-2 7-5 2 3 4 5 7 5" />
              </svg>
            </Icon>
          }
        >
          <p className="text-sm leading-relaxed text-stone-600">
            {treatment}
          </p>
        </Section>

        {/* Prevention */}
        <Section
          title="Prevention"
          icon={
            <Icon className="h-7 w-7 bg-purple-100 text-purple-600">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-4 w-4"
              >
                <path d="M12 3 5 6v5c0 4.8 2.9 8.2 7 10 4.1-1.8 7-5.2 7-10V6l-7-3Z" />
                <path d="m9 12 2 2 4-4" />
              </svg>
            </Icon>
          }
        >
          <p className="text-sm leading-relaxed text-stone-600">
            {prevention}
          </p>
        </Section>

        {/* Weather warning */}
        <Section
          title="Weather-aware warning"
          className="border-sky-200/60 bg-sky-50/60"
          icon={
            <Icon className="h-7 w-7 bg-sky-100 text-sky-700">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-4 w-4"
              >
                <path d="M17.5 19a4.5 4.5 0 1 0-.9-8.9 6 6 0 0 0-11.6 1.9A3.8 3.8 0 0 0 7 19h10.5Z" />
                <path d="M12 13v3" />
                <path d="M12 18h.01" />
              </svg>
            </Icon>
          }
        >
          <p className="text-sm leading-relaxed text-stone-600">
            {weatherWarning}
          </p>
        </Section>
      </div>

      {/* Disclaimer */}
      <div className="border-t border-stone-100 px-5 py-4 sm:px-6">
        <p className="text-center text-xs leading-relaxed text-stone-400">
          AI-generated agricultural guidance is advisory only. Confirm
          diagnosis and treatment with a local agricultural expert before
          applying chemicals or other treatments.
        </p>
      </div>
    </section>
  );
}