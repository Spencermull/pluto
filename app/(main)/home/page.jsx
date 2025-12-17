"use client";

import { useContext, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { AuthContext } from "@/contexts/AuthContext";
import NavBar from "@/components/NavBar";
import Footer from "@/components/Footer";
import NASAImageSearch from "@/NASA/NASAImageSearch";
import NASAImageGallery from "@/NASA/NASAImageGallery";

export default function HomePage() {
  const { user, loading } = useContext(AuthContext);
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("gallery");

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
        <div className="max-w-6xl mx-auto">
          <header className="mb-8">
            <h1 className="text-4xl font-mono font-bold text-white uppercase tracking-wider mb-4">
              Welcome to PLUTO
            </h1>
            <p className="text-white/80 font-sans text-lg mb-6">
              The Cosmic Browser - Explore NASA's planetary imagery
            </p>
            
            <div className="flex gap-4 border-b border-white/10">
              <button
                onClick={() => setActiveTab("gallery")}
                className={`px-6 py-3 font-mono text-sm border-b-2 ${
                  activeTab === "gallery" ? "border-pink-500 text-white" : "border-transparent text-white/60 hover:text-white"
                }`}
              >
                PLANET GALLERY
              </button>
              <button
                onClick={() => setActiveTab("search")}
                className={`px-6 py-3 font-mono text-sm border-b-2 ${
                  activeTab === "search" ? "border-pink-500 text-white" : "border-transparent text-white/60 hover:text-white"
                }`}
              >
                SEARCH
              </button>
            </div>
          </header>

          <div className="mt-8">
            {activeTab === "gallery" ? <NASAImageGallery /> : <NASAImageSearch />}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}