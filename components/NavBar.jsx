"use client";

import { useContext } from "react";
import { useRouter } from "next/navigation";
import { AuthContext } from "@/contexts/AuthContext";

export default function NavBar() {
  const router = useRouter();
  const { user, signOut } = useContext(AuthContext);

  const handleLogoClick = () => {
    if (user) {
      router.push("/home");
    } else {
      router.push("/");
    }
  };

  return (
    <nav className="border-b border-pink-400/20 bg-black/50 backdrop-blur-sm sticky top-0 z-50 px-8 py-4">
      <div className="max-w-4xl mx-auto flex items-center justify-between">
        <button
          onClick={handleLogoClick}
          className="text-xl font-mono font-semibold text-white hover:text-white/80 transition-colors cursor-pointer"
        >
          PLUTO
        </button>

        <div className="flex items-center gap-6">
          {user && (
            <>
              <button
                onClick={() => router.push("/home")}
                className="text-sm font-mono border-b border-transparent pb-1 transition-all duration-300 text-white/60 hover:text-pink-500 hover:border-pink-500/50 cursor-pointer"
              >
                HOME
              </button>
              <button
                onClick={async () => {
                  try {
                    await signOut();
                    router.push("/");
                  } catch (error) {
                    console.error("Logout error:", error);
                  }
                }}
                className="text-sm font-mono border-b border-transparent pb-1 transition-all duration-300 text-white/60 hover:text-red-500 hover:border-red-500/50 cursor-pointer"
              >
                LOGOUT
              </button>
            </>
          )}

          {!user && (
            <button
              onClick={() => router.push("/login")}
              className="text-sm font-mono border-b border-transparent pb-1 transition-all duration-300 text-white/60 hover:text-green-500 hover:border-green-500/50 cursor-pointer"
            >
              LOGIN
            </button>
          )}

          {!user && (
            <button
              onClick={() => router.push("/register")}
              className="text-sm font-mono border-b border-transparent pb-1 transition-all duration-300 text-white/60 hover:text-blue-500 hover:border-blue-500/50 cursor-pointer"
            >
              REGISTER
            </button>
          )}
        </div>
      </div>
    </nav>
  );
}
