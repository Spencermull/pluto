"use client";

import { useContext, useEffect } from "react";
import { useRouter } from "next/navigation";
import { AuthContext } from "@/contexts/AuthContext";

export default function AuthRedirect({ children }) {
  const { user, loading } = useContext(AuthContext);
  const router = useRouter();

  useEffect(() => {
    if (!loading && user) {
 
      router.replace("/home");
    }
  }, [user, loading, router]);


  if (loading) return null;


  if (user) return null;

  return children;
}
