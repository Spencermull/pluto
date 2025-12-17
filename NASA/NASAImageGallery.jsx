"use client";

// TODO: Maybe add filtering by planet type or date range later
import { useState, useEffect, useContext } from "react";
import Link from "next/link";
import { doc, setDoc, deleteDoc, onSnapshot, collection } from "firebase/firestore";
import { db } from "@/app/utils/firebase";
import { AuthContext } from "@/contexts/AuthContext";

const GALLERY_RESULTS_PER_PAGE = 12;

export default function NASAImageGallery() {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [favorites, setFavorites] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const { user } = useContext(AuthContext);

  useEffect(() => {
    const fetchGallery = async () => {
      setLoading(true);
      setError(null);

      try {
        // Fetch planet images from NASA API
        const response = await fetch(
          "https://images-api.nasa.gov/search?media_type=image&q=planet"
        );

        if (!response.ok) {
          throw new Error("Failed to fetch NASA images");
        }

        const data = await response.json();

        // Extract items from NASA API response
        if (data.collection && data.collection.items) {
          setImages(data.collection.items);
        } else {
          setImages([]);
        }
      } catch (err) {
        setError(err.message || "An error occurred");
        setImages([]);
      } finally {
        setLoading(false);
      }
    };

    fetchGallery();
  }, []);

  // Listen for favorites for the current user
  useEffect(() => {
    if (!user) {
      setFavorites({});
      return;
    }

    const favsRef = collection(db, "users", user.uid, "favorites");
    const unsubscribe = onSnapshot(favsRef, (snapshot) => {
      const favs = {};
      snapshot.forEach((docSnap) => {
        favs[docSnap.id] = true;
      });
      setFavorites(favs);
    });

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
          title: data.title || "N/A",
          thumbnail: links?.href || null,
        });
      }
    } catch (err) {
      console.error("Error updating favorite:", err);
    }
  };

  if (loading) {
    return (
      <div className="text-white font-mono text-center py-8">
        Loading gallery...
      </div>
    );
  }

  if (error) {
    return (
      <div className="mb-4 p-3 bg-red-500/20 border border-red-500/50 text-red-400 text-sm font-mono">
        {error}
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="flex items-baseline justify-between mb-4">
        <h2 className="text-2xl font-mono font-bold text-white uppercase tracking-wider">
          Planet Gallery
        </h2>
        {images.length > 0 && (
          <p className="text-white/60 font-mono text-xs">
            Page {currentPage} of {Math.ceil(images.length / GALLERY_RESULTS_PER_PAGE)}
          </p>
        )}
      </div>

      {images.length > 0 ? (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {images
            .slice(
              (currentPage - 1) * GALLERY_RESULTS_PER_PAGE,
              currentPage * GALLERY_RESULTS_PER_PAGE
            )
            .map((item, index) => {
            const data = item.data && item.data[0] ? item.data[0] : {};
            const links = item.links && item.links[0] ? item.links[0] : {};
            const nasaId = data.nasa_id;
            const isFavorite = !!favorites[nasaId];

            return (
              <Link
                key={nasaId || index}
                href={`/object/${encodeURIComponent(nasaId)}`}
                className="border border-white/10 bg-black/30 hover:border-pink-500/50 hover:scale-[1.02] transition-all duration-200 overflow-hidden relative group"
              >
                {user && nasaId && (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      toggleFavorite(nasaId, data, links);
                    }}
                    className="absolute top-3 right-3 text-lg z-10 hover:scale-110 transition-transform duration-200"
                    aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
                  >
                    <span className={`${isFavorite ? "text-yellow-400" : "text-white/30"} group-hover:text-yellow-400 transition-colors duration-200`}>
                      {isFavorite ? "★" : "☆"}
                    </span>
                  </button>
                )}
                {links.href && (
                  <img
                    src={links.href}
                    alt={data.title || "NASA Image"}
                    className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                    onError={(e) => {
                      e.target.style.display = "none";
                    }}
                  />
                )}
                <div className="p-4">
                  <h3 className="text-sm font-mono font-bold text-white mb-2 line-clamp-2">
                    {data.title || "N/A"}
                  </h3>
                  <p className="text-white/60 font-mono text-xs">
                    {data.date_created ? new Date(data.date_created).getFullYear() : "N/A"}
                  </p>
                </div>
              </Link>
            );
          })}
        </div>

        {images.length > GALLERY_RESULTS_PER_PAGE && (
          <div className="flex items-center justify-center gap-4 mt-8">
            <button
              onClick={() => setCurrentPage((prev) => prev - 1)}
              disabled={currentPage === 1}
              className="px-4 py-2 font-mono text-sm border border-white/10 text-white bg-transparent hover:bg-white hover:text-black hover:border-pink-500 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
            >
              Previous
            </button>

            <span className="text-white/60 font-mono text-sm">
              Page {currentPage} of {Math.ceil(images.length / GALLERY_RESULTS_PER_PAGE)}
            </span>

            <button
              onClick={() => setCurrentPage((prev) => prev + 1)}
              disabled={currentPage >= Math.ceil(images.length / GALLERY_RESULTS_PER_PAGE)}
              className="px-4 py-2 font-mono text-sm border border-white/10 text-white bg-transparent hover:bg-white hover:text-black hover:border-pink-500 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
            >
              Next
            </button>
          </div>
        )}
        </>
      ) : (
        <div className="text-white/60 font-mono text-center py-8">
          No images found in gallery.
        </div>
      )}
    </div>
  );
}

