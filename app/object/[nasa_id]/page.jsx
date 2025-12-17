"use client";

import { useEffect, useState, useContext } from "react";
import { useParams, useRouter } from "next/navigation";
import { doc, getDoc, setDoc } from "firebase/firestore";

import NavBar from "@/components/NavBar";
import Footer from "@/components/Footer";
import { db } from "@/app/utils/firebase";
import { AuthContext } from "@/contexts/AuthContext";

// Detail page for a single NASA object identified by nasa_id
export default function ObjectDetailPage() {
  const { nasa_id } = useParams();
  const router = useRouter();
  const { user } = useContext(AuthContext);

  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [notes, setNotes] = useState("");
  const [notesLoading, setNotesLoading] = useState(false);
  const [notesSaving, setNotesSaving] = useState(false);

  useEffect(() => {
    if (!nasa_id) return;

    const fetchObject = async () => {
      setLoading(true);
      setError(null);

      try {
        // Fetch a single object by NASA ID
        const response = await fetch(
          `https://images-api.nasa.gov/search?nasa_id=${encodeURIComponent(
            nasa_id
          )}&media_type=image`
        );

        if (!response.ok) {
          throw new Error("Failed to fetch object details");
        }

        const data = await response.json();

        // NASA returns matching results in collection.items
        const firstItem =
          data.collection &&
          data.collection.items &&
          data.collection.items[0]
            ? data.collection.items[0]
            : null;

        setItem(firstItem);
      } catch (err) {
        setError(err.message || "An error occurred while loading details");
      } finally {
        setLoading(false);
      }
    };

    fetchObject();
  }, [nasa_id]);

  const data = item && item.data && item.data[0] ? item.data[0] : {};
  const links = item && item.links && item.links[0] ? item.links[0] : {};

  // Load existing notes for this object and user
  useEffect(() => {
    const loadNotes = async () => {
      if (!user || !data.nasa_id) return;

      setNotesLoading(true);
      try {
        const notesRef = doc(db, "users", user.uid, "notes", data.nasa_id);
        const snap = await getDoc(notesRef);
        if (snap.exists()) {
          const noteData = snap.data();
          setNotes(noteData.text || "");
        } else {
          setNotes("");
        }
      } catch {
        
      } finally {
        setNotesLoading(false);
      }
    };

    loadNotes();
  }, [user, data.nasa_id]);

  const handleSaveNotes = async () => {
    if (!user || !data.nasa_id) return;

    setNotesSaving(true);
    try {
      const notesRef = doc(db, "users", user.uid, "notes", data.nasa_id);
      await setDoc(notesRef, {
        text: notes,
      });
    } catch (err) {
      console.error("Error saving notes:", err);
    } finally {
      setNotesSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-black flex flex-col">
      <NavBar />
      <main className="p-8 flex-1">
        <div className="max-w-4xl mx-auto">
          <button
            onClick={() => router.back()}
            className="mb-6 text-sm font-mono text-white/60 hover:text-pink-500 transition-colors underline"
          >
            ← Back
          </button>

          {loading && (
            <div className="text-white font-mono">Loading object...</div>
          )}

          {error && !loading && (
            <div className="mb-4 p-3 bg-red-500/20 border border-red-500/50 text-red-400 text-sm font-mono">
              {error}
            </div>
          )}

          {!loading && !error && !item && (
            <div className="text-white/60 font-mono">
              No details found for this NASA object.
            </div>
          )}

          {!loading && !error && item && (
            <>
              <div className="border border-white/10 bg-black/30 p-6 mb-8">
                <div className="flex flex-col md:flex-row gap-6">
                  {links.href && (
                    <img
                      src={links.href}
                      alt={data.title || "NASA Image"}
                      className="w-full md:w-72 h-72 object-cover border border-white/10"
                      onError={(e) => {
                        e.target.style.display = "none";
                      }}
                    />
                  )}

                  <div className="flex-1">
                    <h1 className="text-3xl font-mono font-bold text-white uppercase tracking-wider mb-4">
                      {data.title || "N/A"}
                    </h1>

                    <p className="text-white/80 font-sans text-sm mb-6 whitespace-pre-line">
                      {data.description || "N/A"}
                    </p>

                    <div className="text-white/60 font-mono text-xs space-y-2">
                      <div>
                        <span className="text-white/40">NASA ID: </span>
                        {data.nasa_id || "N/A"}
                      </div>
                      <div>
                        <span className="text-white/40">Date: </span>
                        {data.date_created || "N/A"}
                      </div>
                      <div>
                        <span className="text-white/40">Center: </span>
                        {data.center || "N/A"}
                      </div>
                      <div>
                        <span className="text-white/40">Photographer: </span>
                        {data.photographer || data.secondary_creator || "N/A"}
                      </div>
                      <div>
                        <span className="text-white/40">Keywords: </span>
                        {Array.isArray(data.keywords) && data.keywords.length > 0
                          ? data.keywords.join(", ")
                          : "N/A"}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="border border-white/10 bg-black/20 p-6">
                <h2 className="text-xl font-mono font-bold text-white uppercase tracking-wider mb-4">
                  Notes
                </h2>

                {!user && (
                  <p className="text-white/60 font-mono text-sm">
                    Sign in to add personal notes for this object.
                  </p>
                )}

                {user && (
                  <>
                    {notesLoading ? (
                      <p className="text-white/60 font-mono text-sm mb-4">
                        Loading notes...
                      </p>
                    ) : null}
                    <textarea
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      placeholder="Write your notes about this object..."
                      className="w-full min-h-30 bg-black/40 border border-white/20 text-white font-mono text-sm p-3 mb-4 focus:outline-none focus:border-pink-500/60"
                    />
                    <button
                      onClick={handleSaveNotes}
                      disabled={notesSaving}
                      className="px-6 py-2 font-mono text-sm border border-white text-white bg-transparent transition-all duration-300 hover:bg-white hover:text-black hover:border-pink-500 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {notesSaving ? "Saving..." : "Save Notes"}
                    </button>
                  </>
                )}
              </div>
            </>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}


