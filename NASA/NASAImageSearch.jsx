"use client";
/*
TODOS: Once many search types are implemented I am going to organize them into something like filtering or tabs unsure as of now.
*/
import { useState, useEffect, useContext } from "react";
import Link from "next/link";
import { doc, setDoc, deleteDoc, onSnapshot, collection } from "firebase/firestore";
import { db } from "@/app/utils/firebase";
import { AuthContext } from "@/contexts/AuthContext";

const RESULTS_PER_PAGE = 10;

export default function NASAImageSearch() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasSearched, setHasSearched] = useState(false);
  const [favorites, setFavorites] = useState({});
  const [notesMap, setNotesMap] = useState({});
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    yearStart: "",
    yearEnd: "",
    center: "",
    sortBy: "relevance"
  });
  const { user } = useContext(AuthContext);

  // Listen for favorites for the current user
  useEffect(() => {
    if (!user) {
      setFavorites({});
      setNotesMap({});
      return;
    }

    const favsRef = collection(db, "users", user.uid, "favorites");
    const unsubFavs = onSnapshot(favsRef, (snapshot) => {
      const favs = Object.fromEntries(snapshot.docs.map((docSnap) => [docSnap.id, true]));
      setFavorites(favs);
    });

    const notesRef = collection(db, "users", user.uid, "notes");
    const unsubNotes = onSnapshot(notesRef, (snapshot) => {
      const notes = Object.fromEntries(snapshot.docs.map((docSnap) => [docSnap.id, true]));
      setNotesMap(notes);
    });

    return () => {
      unsubFavs();
      unsubNotes();
    };
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

  const buildSearchUrl = (searchQuery) => {
    let url = `https://images-api.nasa.gov/search?q=${encodeURIComponent(searchQuery)}&media_type=image`;
    
    if (filters.yearStart) {
      url += `&year_start=${filters.yearStart}`;
    }
    if (filters.yearEnd) {
      url += `&year_end=${filters.yearEnd}`;
    }
    if (filters.center) {
      url += `&center=${encodeURIComponent(filters.center)}`;
    }
    
    return url;
  };

  const sortResults = (items) => {
    if (filters.sortBy === "date") {
      return [...items].sort((a, b) => {
        const dateA = a.data?.[0]?.date_created || "";
        const dateB = b.data?.[0]?.date_created || "";
        return dateB.localeCompare(dateA); // newest first
      });
    } else if (filters.sortBy === "title") {
      return [...items].sort((a, b) => {
        const titleA = a.data?.[0]?.title || "";
        const titleB = b.data?.[0]?.title || "";
        return titleA.localeCompare(titleB);
      });
    }
    // Default return for termless items
    return items;
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    
    if (!query.trim()) {
      return;
    }

    setLoading(true);
    setError(null);
    setResults([]);
    setCurrentPage(1);
    setHasSearched(false);

    try {
      const url = buildSearchUrl(query);
      // console.log("Searching with URL:", url); // debugging
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error("Failed to fetch NASA images");
      }

      const data = await response.json();

      if (data.collection && data.collection.items) {
        const sorted = sortResults(data.collection.items);
        setResults(sorted);
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
      const url = buildSearchUrl(term);
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error("Failed to fetch NASA images");
      }

      const data = await response.json();

      if (data.collection && data.collection.items) {
        const sorted = sortResults(data.collection.items);
        setResults(sorted);
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
                className="px-3 py-1 text-xs font-mono border border-white/20 text-white/60 hover:text-white hover:border-pink-500/50 hover:scale-105 bg-transparent transition-all duration-200"
              >
                {term}
              </button>
            ))}
          </div>
        </div>
      )}
      <form onSubmit={handleSearch} className="mb-8">
        <div className="flex gap-4 mb-4">
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
            className="px-8 py-2.5 font-mono text-sm border border-white text-white bg-transparent transition-all duration-200 hover:bg-white hover:text-black hover:border-pink-500 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "SEARCHING..." : "SEARCH"}
          </button>
          <button
            type="button"
            onClick={() => setShowFilters(!showFilters)}
            className="px-4 py-2.5 font-mono text-sm border border-white/30 text-white/80 bg-transparent transition-all duration-200 hover:bg-white/10 hover:border-pink-500/50"
          >
            {showFilters ? "HIDE FILTERS" : "FILTERS"}
          </button>
        </div>

        {showFilters && (
          <div className="border border-white/10 bg-black/30 p-6 mb-4">
            <h3 className="text-sm font-mono font-bold text-white uppercase tracking-wider mb-4">Advanced Filters</h3>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-white/40 font-mono text-xs uppercase tracking-wider mb-2">Start Year</label>
                <input
                  type="number"
                  value={filters.yearStart}
                  onChange={(e) => setFilters({ ...filters, yearStart: e.target.value })}
                  placeholder="e.g. 2020"
                  min="1900"
                  max={new Date().getFullYear()}
                  className="w-full px-3 py-2 bg-black/50 border border-white/10 text-white placeholder-white/40 font-mono text-sm focus:outline-none focus:border-pink-500/50"
                />
              </div>
              <div>
                <label className="block text-white/40 font-mono text-xs uppercase tracking-wider mb-2">End Year</label>
                <input
                  type="number"
                  value={filters.yearEnd}
                  onChange={(e) => setFilters({ ...filters, yearEnd: e.target.value })}
                  placeholder="e.g. 2024"
                  min="1900"
                  max={new Date().getFullYear()}
                  className="w-full px-3 py-2 bg-black/50 border border-white/10 text-white placeholder-white/40 font-mono text-sm focus:outline-none focus:border-pink-500/50"
                />
              </div>
              <div>
                <label className="block text-white/40 font-mono text-xs uppercase tracking-wider mb-2">Center</label>
                <input
                  type="text"
                  value={filters.center}
                  onChange={(e) => setFilters({ ...filters, center: e.target.value })}
                  placeholder="e.g. JPL, GSFC"
                  className="w-full px-3 py-2 bg-black/50 border border-white/10 text-white placeholder-white/40 font-mono text-sm focus:outline-none focus:border-pink-500/50"
                />
              </div>
              <div>
                <label className="block text-white/40 font-mono text-xs uppercase tracking-wider mb-2">Sort By</label>
                <select
                  value={filters.sortBy}
                  onChange={(e) => setFilters({ ...filters, sortBy: e.target.value })}
                  className="w-full px-3 py-2 bg-black/50 border border-white/10 text-white font-mono text-sm focus:outline-none focus:border-pink-500/50"
                >
                  <option value="relevance">Relevance</option>
                  <option value="date">Date (Newest)</option>
                  <option value="title">Title (A-Z)</option>
                </select>
              </div>
            </div>
            <button
              type="button"
              onClick={() => {
                setFilters({ yearStart: "", yearEnd: "", center: "", sortBy: "relevance" });
              }}
              className="mt-4 px-4 py-2 font-mono text-xs border border-white/20 text-white/60 hover:text-white hover:border-pink-500/50 bg-transparent transition-all duration-200"
            >
              Clear Filters
            </button>
          </div>
        )}
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
              const isFavorite = !!favorites[nasaId];
              const hasNotes = !!notesMap[nasaId];
              
              return (
                <Link
                  key={nasaId || index}
                  href={nasaId ? `/object/${encodeURIComponent(nasaId)}` : "#"}
                  className="block border border-white/10 bg-black/30 p-6 hover:border-pink-500/60 hover:scale-[1.01] transition-all duration-200 relative group"
                >
                  {user && hasNotes && (
                    <div className="absolute top-3 left-3 text-xs font-mono px-2 py-1 border border-blue-400/60 text-blue-300 bg-black/60">
                      NOTES
                    </div>
                  )}
                  {user && nasaId && (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        toggleFavorite(nasaId, data, links);
                      }}
                      className="absolute top-3 right-3 text-lg hover:scale-110 transition-transform duration-200 z-10"
                      aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
                    >
                      <span className={`${isFavorite ? "text-yellow-400" : "text-white/30"} group-hover:text-yellow-400 transition-colors duration-200`}>
                        {isFavorite ? "★" : "☆"}
                      </span>
                    </button>
                  )}
                  <div className="flex gap-6">
                    {links.href && (
                      <img
                        src={links.href}
                        alt={data.title || "NASA Image"}
                        className="w-48 h-48 object-cover border border-white/10 group-hover:scale-105 transition-transform duration-300"
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
                className="px-4 py-2 font-mono text-sm border border-white/10 text-white bg-transparent hover:bg-white hover:text-black hover:border-pink-500 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
              >
                Previous
              </button>
              
              <span className="text-white/60 font-mono text-sm">
                Page {currentPage} of {Math.ceil(results.length / RESULTS_PER_PAGE)}
              </span>
              
              <button
                onClick={() => setCurrentPage(prev => prev + 1)}
                disabled={currentPage >= Math.ceil(results.length / RESULTS_PER_PAGE)}
                className="px-4 py-2 font-mono text-sm border border-white/10 text-white bg-transparent hover:bg-white hover:text-black hover:border-pink-500 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
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

