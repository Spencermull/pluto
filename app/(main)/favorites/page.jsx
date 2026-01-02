"use client";

// TODO: Replace <a> tags with Next.js Link components for better client-side navigation
import { useContext, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

import { AuthContext } from "@/contexts/AuthContext";
import { useFavorites } from "@/hooks/useFavorites";
import { useNotes } from "@/hooks/useNotes";
import NavBar from "@/components/NavBar";
import Footer from "@/components/Footer";

export default function FavoritesPage() {
  const { user, loading } = useContext(AuthContext);
  const router = useRouter();
  const { favoritesList, loading: favLoading } = useFavorites(user);
  const { notesMap } = useNotes(user);

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
  }, [user, loading, router]);

  if (loading || favLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white font-mono">Loading...</div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-black flex flex-col">
      <NavBar />
      <main className="p-8 flex-1">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-4xl font-mono font-bold text-white uppercase tracking-wider mb-8">
            Favourites
          </h1>

          {favoritesList.length === 0 ? (
            <div className="text-white/60 font-mono text-center py-12 border border-white/10 bg-black/30">
              No favourites yet.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {favoritesList.map((fav) => (
                  <Link
                    key={fav.id}
                    href={`/object/${encodeURIComponent(fav.id)}`}
                    className="border border-white/10 bg-black/30 hover:border-pink-500/50 hover:scale-[1.02] transition-all duration-200 overflow-hidden block group relative"
                  >
                    {notesMap[fav.id] && (
                      <div
                        className="absolute top-3 left-3 text-xs font-mono px-2 py-1 border border-blue-400/60 text-blue-300 bg-black/60 group-hover:scale-105 transition-transform duration-150"
                        title={notesMap[fav.id] && (notesMap[fav.id].length > 160 ? notesMap[fav.id].slice(0, 160) + '…' : notesMap[fav.id])}
                      >
                        NOTES
                      </div>
                    )}
                    {fav.thumbnail && (
                      <img
                        src={fav.thumbnail}
                        alt={fav.title || "Favourite image"}
                        className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                        onError={(e) => {
                          e.target.style.display = "none";
                        }}
                      />
                    )}
                    <div className="p-4">
                      <h3 className="text-sm font-mono font-bold text-white mb-2 line-clamp-2">
                        {fav.title || "N/A"}
                      </h3>
                      <p className="text-white/60 font-mono text-xs break-all">
                        NASA ID: {fav.id}
                      </p>
                    </div>
                  </Link>
                ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}


