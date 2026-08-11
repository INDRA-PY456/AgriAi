import { useRef, useState } from "react";

const ACCEPTED = "image/*";

export default function ImageUploader({ image, onSelect, onRemove }) {
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState(null);
  const inputRef = useRef(null);

  const handleFiles = (files) => {
    const file = files && files[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setError("That doesn't look like an image. Please choose a JPG, PNG, or WebP file.");
      return;
    }

    setError(null);
    onSelect(file);
  };

  const handleDrop = (event) => {
    event.preventDefault();
    setIsDragging(false);
    handleFiles(event.dataTransfer.files);
  };

  const handleRemove = (event) => {
    event.preventDefault();
    event.stopPropagation();
    onRemove();
    if (inputRef.current) inputRef.current.value = "";
  };

  return (
    <div>
      <label
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
        className={`group relative flex cursor-pointer flex-col items-center justify-center overflow-hidden rounded-3xl border-2 border-dashed bg-white/70 shadow-sm shadow-emerald-900/5 backdrop-blur-xl transition-all duration-300 ${
          isDragging
            ? "scale-[1.01] border-emerald-500 bg-emerald-50/80 shadow-lg shadow-emerald-600/10"
            : "border-emerald-300/70 hover:border-emerald-400 hover:bg-white/90 hover:shadow-md hover:shadow-emerald-900/5"
        }`}
      >
        <input
          ref={inputRef}
          type="file"
          accept={ACCEPTED}
          className="sr-only"
          onChange={(e) => handleFiles(e.target.files)}
        />

        {image ? (
          <div className="relative w-full">
            <img
              src={image.previewUrl}
              alt="Uploaded crop or leaf preview"
              className="max-h-80 w-full object-contain"
            />
            <div className="pointer-events-none absolute inset-0 flex items-center justify-center bg-black/0 transition-colors duration-200 group-hover:bg-black/20">
              <span className="rounded-full bg-white/90 px-4 py-1.5 text-sm font-medium text-emerald-700 opacity-0 shadow-md backdrop-blur transition-opacity duration-200 group-hover:opacity-100">
                Click or drop to replace
              </span>
            </div>
            <button
              type="button"
              onClick={handleRemove}
              aria-label="Remove uploaded image"
              className="absolute top-3 right-3 flex h-8 w-8 items-center justify-center rounded-full bg-white/90 text-stone-600 shadow-md backdrop-blur transition-all duration-200 hover:scale-105 hover:bg-red-50 hover:text-red-600"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
                className="h-4 w-4"
                aria-hidden="true"
              >
                <path d="M6.28 5.22a.75.75 0 0 0-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 1 0 1.06 1.06L10 11.06l3.72 3.72a.75.75 0 1 0 1.06-1.06L11.06 10l3.72-3.72a.75.75 0 0 0-1.06-1.06L10 8.94 6.28 5.22Z" />
              </svg>
            </button>
          </div>
        ) : (
          <div className="flex flex-col items-center px-6 py-12 text-center sm:py-16">
            <div
              className={`mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-emerald-500 to-emerald-700 text-white shadow-lg shadow-emerald-600/30 transition-transform duration-300 group-hover:scale-105 ${
                isDragging ? "from-emerald-600 to-emerald-800" : ""
              }`}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-7 w-7"
                aria-hidden="true"
              >
                <path d="M12 16V4" />
                <path d="m7 9 5-5 5 5" />
                <path d="M4 20h16" />
              </svg>
            </div>
            <p className="text-base font-semibold text-stone-800">
              Drag &amp; drop your crop photo here
            </p>
            <p className="mt-1.5 text-sm text-stone-500">or click to browse from your device</p>
            <p className="mt-5 rounded-full border border-emerald-200/70 bg-white/80 px-4 py-1.5 text-xs font-medium text-emerald-700 backdrop-blur">
              JPG, PNG or WebP · Max 10 MB
            </p>
          </div>
        )}
      </label>

      {error && (
        <p role="alert" className="mt-3 flex items-center gap-2 text-sm text-red-600">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
            className="h-4 w-4 shrink-0"
            aria-hidden="true"
          >
            <path
              fillRule="evenodd"
              d="M18 10a8 8 0 1 1-16 0 8 8 0 0 1 16 0Zm-8-5a.75.75 0 0 1 .75.75v4.5a.75.75 0 0 1-1.5 0v-4.5A.75.75 0 0 1 10 5Zm0 10a1 1 0 1 0 0-2 1 1 0 0 0 0 2Z"
              clipRule="evenodd"
            />
          </svg>
          {error}
        </p>
      )}
    </div>
  );
}
