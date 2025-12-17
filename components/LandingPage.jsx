"use client";

import Link from "next/link";
import NavBar from "@/components/NavBar";
import Footer from "@/components/Footer";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-black flex flex-col">
      <NavBar />
      <main className="p-8 flex-1">
        <section className="max-w-5xl mx-auto">
          <div className="grid gap-12 md:grid-cols-2 md:items-center">
            <header className="text-center md:text-left">
              <h1 className="text-6xl font-mono font-bold text-white uppercase tracking-wider mb-6">
                PLUTO
              </h1>
              <p className="text-white/80 font-sans text-xl mb-8">
                The Cosmic Browser - Explore NASA's planetary imagery
              </p>
              <div className="flex gap-4 justify-center md:justify-start">
                <Link
                  href="/login"
                  className="px-8 py-3 font-mono text-sm border border-white text-white bg-transparent transition-all duration-300 hover:bg-white hover:text-black hover:border-pink-500"
                >
                  SIGN IN
                </Link>
                <Link
                  href="/register"
                  className="px-8 py-3 font-mono text-sm border border-white text-white bg-transparent transition-all duration-300 hover:bg-white hover:text-black hover:border-blue-500"
                >
                  SIGN UP
                </Link>
              </div>
            </header>

            <section className="text-white/60 font-mono text-sm space-y-2 md:text-right md:border-l md:border-white/10 md:pl-8">
              <p>• Browse planet galleries curated from NASA imagery</p>
              <p>• Search NASA&apos;s image library by keyword</p>
              <p>• View detailed information and save favourites</p>
            </section>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}

