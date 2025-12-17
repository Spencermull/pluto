"use client";
/*
TODOS: Once many search types are implemented I am going to organize them into something like filtering or tabs unsure as of now.
*/
import { useState } from "react";
import Link from "next/link";

const RESULTS_PER_PAGE = 20;

export default function NASAImageSearch() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasSearched, setHasSearched] = useState(false);

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
    setCurrentPage(1);
    setHasSearched(false);

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
      setHasSearched(true);
    } catch (err) {
      setError(err.message || "An error occurred");
      setResults([]);
      setHasSearched(true);
    } finally {
      setLoading(false);
    }
  };

  const suggestedSearches = ["mars", "jupiter", "saturn", "nebula", "galaxy", "astronaut"];

  const handleSuggestedSearch = async (term) => {
    setQuery(term);
    setLoading(true);
    setError(null);
    setResults([]);
    setCurrentPage(1);
    setHasSearched(false);

    try {
      const response = await fetch(
        `https://images-api.nasa.gov/search?q=${encodeURIComponent(term)}&media_type=image`
      );
      
      if (!response.ok) {
        throw new Error("Failed to fetch NASA images");
      }

      const data = await response.json();

      if (data.collection && data.collection.items) {
        setResults(data.collection.items);
      } else {
        setResults([]);
      }
      setHasSearched(true);
    } catch (err) {
      setError(err.message || "An error occurred");
      setResults([]);
      setHasSearched(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full">
      {!hasSearched && query === "" && (
        <div className="mb-6 p-4 bg-black/30 border border-white/10">
          <p className="text-white/60 font-mono text-sm mb-3">Try searching for:</p>
          <div className="flex flex-wrap gap-2">
            {suggestedSearches.map((term) => (
              <button
                key={term}
                type="button"
                onClick={() => handleSuggestedSearch(term)}
                className="px-3 py-1 text-xs font-mono border border-white/20 text-white/60 hover:text-white hover:border-pink-500/50 bg-transparent transition-all"
              >
                {term}
              </button>
            ))}
          </div>
        </div>
      )}
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
            {results.slice((currentPage - 1) * RESULTS_PER_PAGE, currentPage * RESULTS_PER_PAGE).map((item, index) => {
              const data = item.data?.[0] || {};
              const links = item.links?.[0] || {};
              const nasaId = data.nasa_id;
              
              return (
                <Link
                  key={nasaId || index}
                  href={nasaId ? `/object/${encodeURIComponent(nasaId)}` : "#"}
                  className="block border border-white/10 bg-black/30 p-6 hover:border-pink-500/60 transition-colors"
                >
                  <div className="flex gap-6">
                    {links.href && (
                      <img
                        src={links.href}
                        alt={data.title || "NASA Image"}
                        className="w-48 h-48 object-cover border border-white/10"
                        onError={(e) => e.target.style.display = "none"}
                      />
                    )}
                    <div className="flex-1">
                      <h3 className="text-lg font-mono font-bold text-white mb-2">
                        {data.title || "N/A"}
                      </h3>
                      <p className="text-white/80 font-sans text-sm mb-4 line-clamp-3">
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
                        <div>
                          <span className="text-white/40">Photographer: </span>
                          {data.photographer || data.secondary_creator || "N/A"}
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
          
          {/* Pagination */}
          {results.length > RESULTS_PER_PAGE && (
            <div className="flex items-center justify-center gap-4 mt-8">
              <button
                onClick={() => setCurrentPage(prev => prev - 1)}
                disabled={currentPage === 1}
                className="px-4 py-2 font-mono text-sm border border-white/10 text-white bg-transparent hover:bg-white hover:text-black hover:border-pink-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </button>
              
              <span className="text-white/60 font-mono text-sm">
                Page {currentPage} of {Math.ceil(results.length / RESULTS_PER_PAGE)}
              </span>
              
              <button
                onClick={() => setCurrentPage(prev => prev + 1)}
                disabled={currentPage >= Math.ceil(results.length / RESULTS_PER_PAGE)}
                className="px-4 py-2 font-mono text-sm border border-white/10 text-white bg-transparent hover:bg-white hover:text-black hover:border-pink-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
              </button>
            </div>
          )}
        </div>
      )}

   
      {!loading && hasSearched && results.length === 0 && !error && (
        <div className="text-white/60 font-mono text-center py-8">
          No results found. Try a different search term.
        </div>
      )}
    </div>
  );
}

