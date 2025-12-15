"use client";

import { useContext } from "react";
import { useRouter } from "next/navigation";
import { AuthContext } from "@/contexts/AuthContext";

export default function Logout() {
  const { signOut } = useContext(AuthContext);
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await signOut();
      router.push("/");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  return (
    <button 
      onClick={handleLogout}
      className="text-sm font-mono border-b border-transparent pb-1 transition-all duration-300 text-white/60 hover:text-red-500 hover:border-red-500/50 cursor-pointer"
    >
      LOGOUT
    </button>
  );
}
