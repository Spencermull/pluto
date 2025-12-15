"use client";

import ErrorMessage from "@/components/ErrorMessage";

export default function Input({
  value,
  onChange,
  placeholder,
  label,
  error,
  type = 'text',
  autoCapitalize,
}) {
  return (
    <div className="mb-4">
      {label && (
        <label className="block text-sm font-mono text-white/80 mb-2 uppercase tracking-wider">
          {label}
        </label>
      )}

      <input
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        type={type}
        autoCapitalize={autoCapitalize}
        className="w-full px-4 py-2.5 bg-black/50 border border-white/10 text-white placeholder-white/40 font-mono text-sm focus:outline-none focus:border-pink-500/50 focus:bg-black/70 transition-all duration-300"
      />

      {error && <ErrorMessage message={error} />}
    </div>
  );
}
