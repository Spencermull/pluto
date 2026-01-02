"use client";

import { useState, useEffect } from "react";
import { doc, setDoc, deleteDoc, onSnapshot, collection } from "firebase/firestore";
import { db } from "@/app/utils/firebase";

/**
 * Custom hook to manage user favorites
 * @param {Object} user - Firebase user object
 * @returns {Object} { favorites, favoritesList, toggleFavorite, loading }
 */
export function useFavorites(user) {
  const [favorites, setFavorites] = useState({});
  const [favoritesList, setFavoritesList] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setFavorites({});
      setFavoritesList([]);
      setLoading(false);
      return;
    }

    const favsRef = collection(db, "users", user.uid, "favorites");
    const unsubscribe = onSnapshot(
      favsRef,
      (snapshot) => {
        const favsMap = Object.fromEntries(
          snapshot.docs.map((docSnap) => [docSnap.id, true])
        );
        const favsList = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        setFavorites(favsMap);
        setFavoritesList(favsList);
        setLoading(false);
      },
      (error) => {
        console.error("Error fetching favorites:", error);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [user]);

  const toggleFavorite = async (nasaId, data, links) => {
    if (!user || !nasaId) return;

    const favRef = doc(db, "users", user.uid, "favorites", nasaId);
    const isFav = !!favorites[nasaId];

    try {
      if (isFav) {
        await deleteDoc(favRef);
      } else {
        await setDoc(favRef, {
          nasa_id: nasaId,
          title: data?.title || "N/A",
          thumbnail: links?.href || null,
        });
      }
    } catch (err) {
      console.error("Error updating favorite:", err);
      throw err;
    }
  };

  return {
    favorites,
    favoritesList,
    toggleFavorite,
    loading,
  };
}

