"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

export default function NASAImageGallery() {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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
      <h2 className="text-2xl font-mono font-bold text-white uppercase tracking-wider mb-6">
        Planet Gallery
      </h2>

      {images.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {images.map((item, index) => {
            const data = item.data && item.data[0] ? item.data[0] : {};
            const links = item.links && item.links[0] ? item.links[0] : {};
            const nasaId = data.nasa_id;

            return (
              <Link
                key={nasaId || index}
                href={`/object/${encodeURIComponent(nasaId)}`}
                className="border border-white/10 bg-black/30 hover:border-pink-500/50 transition-all duration-300 overflow-hidden"
              >
                {links.href && (
                  <img
                    src={links.href}
                    alt={data.title || "NASA Image"}
                    className="w-full h-48 object-cover"
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
      ) : (
        <div className="text-white/60 font-mono text-center py-8">
          No images found in gallery.
        </div>
      )}
    </div>
  );
}

