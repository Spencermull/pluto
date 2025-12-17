"use client";

import { useContext, useEffect } from "react";
import { useRouter } from "next/navigation";
import { AuthContext } from "@/contexts/AuthContext";
import NavBar from "@/components/NavBar";
import Footer from "@/components/Footer";

export default function ProfilePage() {
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
    <div className="min-h-screen bg-black flex flex-col">
      <NavBar />
      <main className="p-8 flex-1">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-mono font-bold text-white uppercase tracking-wider mb-8">
            Profile
          </h1>
          
          <div className="border border-white/10 bg-black/30 p-12 text-center">
            <p className="text-white/60 font-mono text-lg">
              To be implemented
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

