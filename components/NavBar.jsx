"use client";

// TODO: Standardize transition durations to 200ms to match the rest of the app 
import { useContext } from "react";
import Link from "next/link";
import { AuthContext } from "@/contexts/AuthContext";

export default function NavBar() {
  const { user, signOut } = useContext(AuthContext);

  return (
    <nav className="border-b border-pink-400/20 bg-black/50 backdrop-blur-sm sticky top-0 z-50 px-8 py-4">
      <div className="max-w-4xl mx-auto flex items-center justify-between">
        <Link
          href={user ? "/home" : "/"}
          className="text-2xl font-mono font-semibold text-white hover:text-white/80 transition-colors cursor-pointer"
        >
          PLUTO
        </Link>

        <div className="flex items-center gap-6">
          {user && (
            <>
              <Link
                href="/home"
                className="text-base font-mono border-b border-transparent pb-1 transition-all duration-300 text-white/60 hover:text-pink-500 hover:border-pink-500/50 cursor-pointer"
              >
                HOME
              </Link>
              <Link
                href="/favorites"
                className="text-base font-mono border-b border-transparent pb-1 transition-all duration-300 text-white/60 hover:text-yellow-400 hover:border-yellow-400/50 cursor-pointer"
              >
                FAVOURITES
              </Link>
              <Link
                href="/profile"
                className="text-base font-mono border-b border-transparent pb-1 transition-all duration-300 text-white/60 hover:text-blue-500 hover:border-blue-500/50 cursor-pointer"
              >
                PROFILE
              </Link>
              <button
                onClick={async () => {
                  try {
                    await signOut();
                  } catch (error) {
                    console.error("Logout error:", error);
                  }
                }}
                className="text-base font-mono border-b border-transparent pb-1 transition-all duration-300 text-white/60 hover:text-red-500 hover:border-red-500/50 cursor-pointer"
              >
                LOGOUT
              </button>
            </>
          )}

          {!user && (
            <Link
              href="/login"
              className="text-base font-mono border-b border-transparent pb-1 transition-all duration-300 text-white/60 hover:text-green-500 hover:border-green-500/50 cursor-pointer"
            >
              LOGIN
            </Link>
          )}

          {!user && (
            <Link
              href="/register"
              className="text-base font-mono border-b border-transparent pb-1 transition-all duration-300 text-white/60 hover:text-blue-500 hover:border-blue-500/50 cursor-pointer"
            >
              REGISTER
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}
