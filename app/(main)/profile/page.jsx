"use client";

import { useContext, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { collection, onSnapshot } from "firebase/firestore";
import { AuthContext } from "@/contexts/AuthContext";
import { db } from "@/app/utils/firebase";
import NavBar from "@/components/NavBar";
import Footer from "@/components/Footer";

export default function ProfilePage() {
  const { user, loading } = useContext(AuthContext);
  const router = useRouter();
  const [favoritesCount, setFavoritesCount] = useState(0);
  const [notesCount, setNotesCount] = useState(0);
  const [recentFavorites, setRecentFavorites] = useState([]);
  const [statsLoading, setStatsLoading] = useState(true);

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
  }, [user, loading, router]);

  useEffect(() => {
    if (!user) {
      setFavoritesCount(0);
      setNotesCount(0);
      setRecentFavorites([]);
      setStatsLoading(false);
      return;
    }

    const favsRef = collection(db, "users", user.uid, "favorites");
    const unsubFavs = onSnapshot(favsRef, (snapshot) => {
      const items = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setFavoritesCount(items.length);
      setRecentFavorites(items.slice(-3).reverse());
      setStatsLoading(false);
    });

    const notesRef = collection(db, "users", user.uid, "notes");
    const unsubNotes = onSnapshot(notesRef, (snapshot) => {
      setNotesCount(snapshot.size);
    });

    return () => {
      unsubFavs();
      unsubNotes();
    };
  }, [user]);

  if (loading || statsLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white font-mono">Loading...</div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  const accountCreatedDate = user.metadata?.creationTime 
    ? new Date(user.metadata.creationTime).toLocaleDateString()
    : "N/A";

  return (
    <div className="min-h-screen bg-black flex flex-col">
      <NavBar />
      <main className="p-8 flex-1">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-mono font-bold text-white uppercase tracking-wider mb-8">
            Profile
          </h1>
          
          <div className="space-y-6">
            <div className="border border-white/10 bg-black/30 backdrop-blur-sm p-8 hover:border-pink-500/30 transition-colors duration-200">
              <h2 className="text-xl font-mono font-bold text-white uppercase tracking-wider mb-6 pb-3 border-b border-white/10">
                Account Information
              </h2>
              <div className="space-y-4">
                <div>
                  <span className="text-white/40 block mb-1 text-xs font-mono uppercase tracking-wider">Email</span>
                  <span className="text-white/80 font-mono text-sm">{user.email || "N/A"}</span>
                </div>
                <div>
                  <span className="text-white/40 block mb-1 text-xs font-mono uppercase tracking-wider">Account Created</span>
                  <span className="text-white/80 font-mono text-sm">{accountCreatedDate}</span>
                </div>
              </div>
            </div>

            <div className="border border-white/10 bg-black/30 backdrop-blur-sm p-8 hover:border-pink-500/30 transition-colors duration-200">
              <h2 className="text-xl font-mono font-bold text-white uppercase tracking-wider mb-6 pb-3 border-b border-white/10">
                Your Activity
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <Link
                  href="/favorites"
                  className="border border-white/10 bg-black/20 p-6 hover:border-yellow-400/50 hover:scale-[1.02] transition-all duration-200 cursor-pointer"
                >
                  <div className="text-white/40 font-mono text-xs uppercase tracking-wider mb-2">Favorites</div>
                  <div className="text-3xl font-mono font-bold text-yellow-400 mb-2">{favoritesCount}</div>
                  {favoritesCount > 0 && (
                    <div className="text-white/60 font-mono text-xs mt-2">View all →</div>
                  )}
                </Link>
                <div className="border border-white/10 bg-black/20 p-6">
                  <div className="text-white/40 font-mono text-xs uppercase tracking-wider mb-2">Notes</div>
                  <div className="text-3xl font-mono font-bold text-blue-400">{notesCount}</div>
                    {notesCount > 0 && (
                      <div className="text-white/60 font-mono text-xs mt-2">Saved across your objects — <a href="/notes" className="underline text-white/80 hover:text-blue-300">View notes →</a></div>
                    )}
                </div>
              </div>

              {recentFavorites.length > 0 && (
                <div className="mt-6 pt-6 border-t border-white/10">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-sm font-mono font-bold text-white/80 uppercase tracking-wider">Recent Favorites</h3>
                    <Link
                      href="/favorites"
                      className="text-xs font-mono text-white/60 hover:text-yellow-400 transition-colors duration-200"
                    >
                      View all →
                    </Link>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {recentFavorites.map((fav) => (
                      <Link
                        key={fav.id}
                        href={`/object/${encodeURIComponent(fav.id)}`}
                        className="border border-white/10 bg-black/20 p-4 hover:border-yellow-400/50 hover:scale-[1.02] transition-all duration-200 group"
                      >
                        {fav.thumbnail && (
                          <img
                            src={fav.thumbnail}
                            alt={fav.title || "Favorite"}
                            className="w-full h-32 object-cover border border-white/10 mb-3 group-hover:scale-105 transition-transform duration-300"
                            onError={(e) => {
                              e.target.style.display = "none";
                            }}
                          />
                        )}
                        <h4 className="text-xs font-mono font-bold text-white line-clamp-2 mb-1">
                          {fav.title || "N/A"}
                        </h4>
                        <p className="text-white/40 font-mono text-[10px]">NASA ID: {fav.id}</p>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

