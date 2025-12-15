"use client";

export default function ErrorMessage({ message }) {
  if (!message) return null;
  return (
    <div className="mb-4 p-3 bg-red-500/20 border border-red-500/50 text-red-400 text-sm font-mono">
      {message}
    </div>
  );
}