"use client";
import React, { useState, useContext } from "react";
import { useRouter } from "next/navigation";
import { AuthContext } from "@/contexts/AuthContext";
import Input from "@/components/Input";
import ErrorMessage from "@/components/ErrorMessage";

export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { signIn } = useContext(AuthContext);
  const [error, setError] = useState(null);
  const router = useRouter();

  const validateForm = () => {
    if (!email.trim()) {
      setError("Email is required");
      return false;
    }
    
    // Basic email validation could use regex but this works for the purpose
    if (!email.includes("@") || !email.includes(".")) {
      setError("Please enter a valid email address");
      return false;
    }
    
    if (!password.trim()) {
      setError("Password is required");
      return false;
    }
    
    if (password.length < 8) {
      setError("Password must be at least 8 characters");
      return false;
    }

    if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
      setError("Password must contain at least one special character");
      return false;
    }

    if (!/[A-Z]/.test(password)) {
      setError("Password must contain at least one upper case letter");
      return false;
    }

    return true;
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(null);

    if (!validateForm()) {
      return;
    }

    try {
      await signIn(email, password);
      router.push("/home");
    } catch (err) {
      setError(err.message || "Login failed");
    }
  };
  return (
    <div className="w-full max-w-md mx-auto border border-white/10 bg-black/30 p-8 transition-all duration-300">
      <h1 className="text-2xl font-mono font-bold text-white uppercase tracking-wider mb-8 text-center">
        Sign In
      </h1>

      <form onSubmit={handleLogin}>
        <ErrorMessage message={error} />
        <Input
          label="Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter email"
        />

        <Input
          label="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          type="password"
          placeholder="Enter password"
        />

        <button 
          type="submit"
          className="w-full mt-6 inline-flex items-center justify-center font-mono px-4 py-2.5 text-sm border border-white text-white bg-transparent transition-all duration-300 hover:bg-white hover:text-black hover:border-pink-500 hover:shadow-pink-glow active:bg-white active:text-black"
        >
          SIGN IN
        </button>
      </form>
      
      <div className="mt-6 text-center">
        <p className="text-white/60 font-mono text-sm mb-2">
          Don't have an account?
        </p>
        <button
          onClick={() => router.push('/register')}
          className="text-sm font-mono text-white/80 hover:text-blue-500 transition-colors underline"
        >
          Sign up here
        </button>
      </div>
    </div>
  );
}
