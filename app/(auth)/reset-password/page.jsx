"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { sendPasswordResetEmail } from "firebase/auth";
import { auth } from "@/app/utils/firebase";
import ErrorMessage from "@/components/ErrorMessage";

export default function ResetPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [sent, setSent] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSent(false);

    if (!email || !email.includes("@")) {
      setError("Please enter a valid email address");
      return;
    }

    setLoading(true);
    try {
      await sendPasswordResetEmail(auth, email);
      setSent(true);
    } catch (err) {
      setError(err.message || "Failed to send reset email");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-8">
      <div className="w-full max-w-md mx-auto border border-white/10 bg-black/30 p-8">
        <h1 className="text-2xl font-mono font-bold text-white uppercase tracking-wider mb-6 text-center">
          Reset Password
        </h1>

        <form onSubmit={handleSubmit}>
          <ErrorMessage message={error} />

          {sent ? (
            <div className="mb-4 p-3 bg-green-600/20 border border-green-600/50 text-green-300 text-sm font-mono">
              If an account exists for that email, a password reset link has been sent.
            </div>
          ) : null}

          <label className="block text-white/70 font-mono text-xs uppercase tracking-wider mb-2">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your account email"
            className="w-full px-3 py-2 mb-4 bg-black/40 border border-white/10 text-white placeholder-white/40 font-mono text-sm focus:outline-none focus:border-pink-500/60"
          />

          <div className="flex gap-3">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-4 py-2 font-mono text-sm border border-white text-white bg-transparent transition-all duration-200 hover:bg-white hover:text-black disabled:opacity-50"
            >
              {loading ? "Sending..." : "Send Reset Email"}
            </button>

            <button
              type="button"
              onClick={() => router.push('/login')}
              className="px-4 py-2 font-mono text-sm border border-white/20 text-white/80 bg-transparent transition-all duration-200 hover:bg-white/10"
            >
              Back to Login
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
