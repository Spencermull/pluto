"use client";
/*
TODOS: Once many search types are implemented I am going to organize them into something like filtering or tabs unsure as of now.

*/
import { useState } from "react";

export default function NASAImageSearch() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSearch = async (e) => {
    e.preventDefault();
    
    // Prevent empty searches
    if (!query.trim()) {
      return;
    }

    // Reset state for new search
    setLoading(true);
    setError(null);
    setResults([]);

    try {
      // Fetch from NASA Image API 
      const response = await fetch(
        `https://images-api.nasa.gov/search?q=${encodeURIComponent(query)}&media_type=image`
      );
      
      if (!response.ok) {
        throw new Error("Failed to fetch NASA images");
      }

      const data = await response.json();
      

      // Checks if collection and items exist before setting results
      if (data.collection && data.collection.items) {
        setResults(data.collection.items);
      } else {
        setResults([]);
      }
    } catch (err) {
      setError(err.message || "An error occurred");
      setResults([]);
    } finally {
      
      setLoading(false);
    }
  };

  return (
    <div className="w-full">
      <form onSubmit={handleSearch} className="mb-8">
        <div className="flex gap-4">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search NASA images..."
            className="flex-1 px-4 py-2.5 bg-black/50 border border-white/10 text-white placeholder-white/40 font-mono text-sm focus:outline-none focus:border-pink-500/50 focus:bg-black/70 transition-all duration-300"
          />
          <button
            type="submit"
            disabled={loading}
            className="px-8 py-2.5 font-mono text-sm border border-white text-white bg-transparent transition-all duration-300 hover:bg-white hover:text-black hover:border-pink-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "SEARCHING..." : "SEARCH"}
          </button>
        </div>
      </form>

      {error && (
        <div className="mb-4 p-3 bg-red-500/20 border border-red-500/50 text-red-400 text-sm font-mono">
          {error}
        </div>
      )}

      {results.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-xl font-mono font-bold text-white uppercase tracking-wider mb-4">
            Results ({results.length})
          </h2>
          <div className="space-y-6">
            {results.map((item, index) => {
              // NASA API returns each item with data and links as arrays
              // Extract first element from each array, or use empty object as fallback
              const data = item.data && item.data[0] ? item.data[0] : {};
              const links = item.links && item.links[0] ? item.links[0] : {};
              
              return (
                <div
                  // Use NASA ID as key if available, otherwise fall back to index
                  key={item.data?.[0]?.nasa_id || index}
                  className="border border-white/10 bg-black/30 p-6"
                >
                  <div className="flex gap-6">
                    {/* Only render image if link exists */}
                    {links.href && (
                      <img
                        src={links.href}
                        alt={data.title || "NASA Image"}
                        className="w-48 h-48 object-cover border border-white/10"
                        // Hide image if it fails to load 
                        onError={(e) => {
                          e.target.style.display = "none";
                        }}
                      />
                    )}
                    <div className="flex-1">
                      <h3 className="text-lg font-mono font-bold text-white mb-2">
                        {data.title || "N/A"}
                      </h3>
                      <p className="text-white/80 font-sans text-sm mb-4">
                        {data.description || "N/A"}
                      </p>
                      <div className="text-white/60 font-mono text-xs space-y-1">
                        <div>
                          <span className="text-white/40">NASA ID: </span>
                          {data.nasa_id || "N/A"}
                        </div>
                        <div>
                          <span className="text-white/40">Date: </span>
                          {data.date_created || "N/A"}
                        </div>
                        {/* Try photographer first, then secondary_creator, then "N/A" */}
                        <div>
                          <span className="text-white/40">Photographer: </span>
                          {data.photographer || data.secondary_creator || "N/A"}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Show "no results" message only when search is complete, no results, query exists, and no error */}
      {!loading && results.length === 0 && query && !error && (
        <div className="text-white/60 font-mono text-center py-8">
          No results found. Try a different search term.
        </div>
      )}
    </div>
  );
}

