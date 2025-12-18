"use client";

import { useContext, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { collection, onSnapshot } from "firebase/firestore";
import { AuthContext } from "@/contexts/AuthContext";
import { db } from "@/app/utils/firebase";
import NavBar from "@/components/NavBar";
import Footer from "@/components/Footer";

export default function NotesPage() {
  const { user, loading } = useContext(AuthContext);
  const router = useRouter();
  const [notes, setNotes] = useState([]);
  const [notesLoading, setNotesLoading] = useState(true);

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
      return;
    }

    if (!user) {
      setNotes([]);
      setNotesLoading(false);
      return;
    }

    const notesRef = collection(db, "users", user.uid, "notes");
    const unsub = onSnapshot(notesRef, (snapshot) => {
      const items = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setNotes(items);
      setNotesLoading(false);
    });

    return () => unsub();
  }, [user]);

  if (loading || notesLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white font-mono">Loading notes...</div>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="min-h-screen bg-black flex flex-col">
      <NavBar />
      <main className="p-8 flex-1">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-mono font-bold text-white uppercase tracking-wider mb-8">Your Notes</h1>

          {notes.length === 0 ? (
            <div className="text-white/60 font-mono text-center py-12 border border-white/10 bg-black/30">You don't have any notes yet.</div>
          ) : (
            <div className="space-y-4">
              {notes.map((n) => (
                <Link
                  key={n.id}
                  href={`/object/${encodeURIComponent(n.id)}`}
                  className="block border border-white/10 bg-black/20 p-4 hover:border-blue-400/50 hover:scale-[1.01] transition-all duration-200"
                >
                  <div className="flex items-start gap-4">
                    <div className="flex-1">
                      <h3 className="text-sm font-mono font-bold text-white mb-2">{n.title || n.id}</h3>
                      <p className="text-white/70 font-mono text-sm line-clamp-4">{n.text || "(empty)"}</p>
                    </div>
                    <div className="text-white/40 text-xs font-mono">View →</div>
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
