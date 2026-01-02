"use client";

import { useState, useEffect } from "react";
import { doc, setDoc, getDoc, onSnapshot, collection } from "firebase/firestore";
import { db } from "@/app/utils/firebase";

/**
 * Custom hook to manage user notes
 * @param {Object} user - Firebase user object
 * @returns {Object} { notesMap, notesCount, saveNote, getNote, loading }
 */
export function useNotes(user) {
  const [notesMap, setNotesMap] = useState({});
  const [notesCount, setNotesCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setNotesMap({});
      setNotesCount(0);
      setLoading(false);
      return;
    }

    const notesRef = collection(db, "users", user.uid, "notes");
    const unsubscribe = onSnapshot(
      notesRef,
      (snapshot) => {
        const notes = Object.fromEntries(
          snapshot.docs.map((docSnap) => [
            docSnap.id,
            docSnap.data()?.text || "",
          ])
        );
        setNotesMap(notes);
        setNotesCount(snapshot.size);
        setLoading(false);
      },
      (error) => {
        console.error("Error fetching notes:", error);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [user]);

  const saveNote = async (nasaId, text) => {
    if (!user || !nasaId) return;

    try {
      const notesRef = doc(db, "users", user.uid, "notes", nasaId);
      await setDoc(notesRef, { text });
    } catch (err) {
      console.error("Error saving note:", err);
      throw err;
    }
  };

  const getNote = async (nasaId) => {
    if (!user || !nasaId) return "";

    try {
      const notesRef = doc(db, "users", user.uid, "notes", nasaId);
      const snap = await getDoc(notesRef);
      if (snap.exists()) {
        return snap.data()?.text || "";
      }
      return "";
    } catch (err) {
      console.error("Error loading note:", err);
      return "";
    }
  };

  return {
    notesMap,
    notesCount,
    saveNote,
    getNote,
    loading,
  };
}

