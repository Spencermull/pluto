"use client";
import React, { useState, useContext } from "react";
import { useRouter } from "next/navigation";
import { AuthContext } from "@/contexts/AuthContext";
import Input from "@/components/Input";
import ErrorMessage from "@/components/ErrorMessage";

export default function RegisterForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const { signUp } = useContext(AuthContext);
  const [error, setError] = useState(null);
  const router = useRouter();

  const validateForm = () => {
    if (!email.trim()) {
      setError("Email is required");
      return false;
    }
    
    if (!email.includes("@") || !email.includes(".")) {
      setError("Please enter a valid email address");
      return false;
    }
    
    if (!password.trim()) {
      setError("Password is required");
      return false;
    }
    
    if (password.length < 12) {
      setError("Password must be at least 12 characters");
      return false;
    }
    
    if (password !== confirmPassword) {
      setError("Passwords do not match");
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

  const handleRegister = async (e) => {
    e.preventDefault();
    setError(null);

    if (!validateForm()) {
      return;
    }

    try {
      await signUp(email, password);
      router.push("/home");
    } catch (err) {
      setError(err.message || "Registration failed");
    }
  };

  return (
    <div className="w-full max-w-md mx-auto border border-white/10 bg-black/30 p-8 transition-all duration-300">
      <h1 className="text-2xl font-mono font-bold text-white uppercase tracking-wider mb-8 text-center">
        Sign Up
      </h1>

      <form onSubmit={handleRegister}>
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

        <Input
          label="Confirm Password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          type="password"
          placeholder="Confirm password"
        />

        <button 
          type="submit"
          className="w-full mt-6 inline-flex items-center justify-center font-mono px-4 py-2.5 text-sm border border-white text-white bg-transparent transition-all duration-300 hover:bg-white hover:text-black hover:border-pink-500 hover:shadow-pink-glow active:bg-white active:text-black"
        >
          SIGN UP
        </button>
      </form>
      
      <div className="mt-6 text-center">
        <p className="text-white/60 font-mono text-sm mb-2">
          Already have an account?
        </p>
        <button
          onClick={() => router.push('/login')}
          className="text-sm font-mono text-white/80 hover:text-green-500 transition-colors underline"
        >
          Sign in here
        </button>
      </div>
    </div>
  );
}

