"use client";

import { useContext, useEffect } from "react";
import { useRouter } from "next/navigation";
import { AuthContext } from "@/contexts/AuthContext";
import NavBar from "@/components/NavBar";

export default function HomePage() {
  const { user, loading } = useContext(AuthContext);
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white font-mono">Loading...</div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-black">
      <NavBar />
      <main className="p-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-mono font-bold text-white uppercase tracking-wider mb-8">
            Welcome to PLUTO
          </h1>
          <p className="text-white/80 font-sans text-lg">
            The Cosmic Browser
          </p>
        </div>
      </main>
    </div>
  );
}