"use client";

import { useRouter } from "next/navigation";
import NavBar from "@/components/NavBar";
import Footer from "@/components/Footer";

export default function LandingPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-black flex flex-col">
      <NavBar />
      <main className="p-8 flex-1">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-6xl font-mono font-bold text-white uppercase tracking-wider mb-6">
            PLUTO
          </h1>
          <p className="text-white/80 font-sans text-xl mb-8">
            The Cosmic Browser - Explore NASA's planetary imagery
          </p>
          <div className="text-white/60 font-mono text-sm mb-12 space-y-2">
            <p>• Browse planet galleries</p>
            <p>• Search NASA's image library</p>
            <p>• View detailed object information</p>
          </div>
          <div className="flex gap-4 justify-center">
            <button 
              onClick={() => router.push('/login')}
              className="px-8 py-3 font-mono text-sm border border-white text-white bg-transparent transition-all duration-300 hover:bg-white hover:text-black hover:border-pink-500"
            >
              SIGN IN
            </button>
            <button 
              onClick={() => router.push('/register')}
              className="px-8 py-3 font-mono text-sm border border-white text-white bg-transparent transition-all duration-300 hover:bg-white hover:text-black hover:border-blue-500"
            >
              SIGN UP
            </button>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

