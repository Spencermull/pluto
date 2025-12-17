"use client";

import { createContext, useState, useEffect } from "react";

import { signInWithEmailAndPassword, onAuthStateChanged, createUserWithEmailAndPassword, signOut } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";

import { auth, db } from "@/app/utils/firebase";

const AuthContext = createContext();

export const AuthContextProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const signUp = async (email, password) => {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const newUser = userCredential.user;
    

    try {
      await setDoc(doc(db, "users", newUser.uid), {
        email: newUser.email
      
      });
    } catch (error) {
      console.error("Error creating user document:", error);
      
    }
    
    setUser(newUser);
  };

  const signIn = async (email, password) => {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    setUser(userCredential.user);
  };

  const signOutUser = async () => {
    await signOut(auth);
    setUser(null);
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });
    
    return () => unsubscribe();
  }, []);

  return (
    <AuthContext.Provider value={{ user, signUp, signIn, signOut: signOutUser, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export { AuthContext };

