import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import NoteCard from "../components/NoteCard";
import ThemeToggle from "../components/ThemeToggle";

/* ---------- helper ---------- */
const formatTime = (seconds) => {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, "0")}`;
};

export default function Popup() {
  const [isDark, setIsDark] = useState(false);
  const [note, setNote] = useState("");
  const [notes, setNotes] = useState([]);
  const [editIndex, setEditIndex] = useState(null);

  /* ============================
     LOAD THEME + NOTES (ONCE)
  ============================ */
  useEffect(() => {
    // theme
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme === "dark") {
      setIsDark(true);
      document.documentElement.classList.add("dark");
    }

    // notes
    chrome.storage.local.get(["notes"], (res) => {
      if (Array.isArray(res.notes)) {
        setNotes(res.notes);
      }
    });
  }, []);

  /* ============================
     PERSIST THEME
  ============================ */
  useEffect(() => {
    document.documentElement.classList.toggle("dark", isDark);
    localStorage.setItem("theme", isDark ? "dark" : "light");
  }, [isDark]);

  /* ============================
     PERSIST NOTES
  ============================ */
  useEffect(() => {
    chrome.storage.local.set({ notes });
  }, [notes]);

  /* ============================
     SAVE / UPDATE NOTE
  ============================ */
const saveNote = () => {
  if (!note.trim()) return;

  chrome.tabs.query({ active: true, currentWindow: true }, ([tab]) => {
    if (!tab?.url?.includes("youtube.com/watch")) {
      alert("Please open a YouTube video first");
      return;
    }

    chrome.tabs.sendMessage(tab.id, { type: "GET_TIME" }, (res) => {
      if (chrome.runtime.lastError || !res) {
        alert("YouTube page not ready. Reload the video page.");
        return;
      }

      const updated = [...notes];

      if (editIndex !== null) {
        updated[editIndex].text = note;
        setEditIndex(null);
      } else {
        updated.push({ time: res.time, text: note });
      }

      setNotes(updated);
      setNote("");
    });
  });
};
  /* ============================
     ACTIONS
  ============================ */
  const editNote = (i) => {
    setNote(notes[i].text);
    setEditIndex(i);
  };

  const deleteNote = (i) => {
    const updated = notes.filter((_, idx) => idx !== i);
    setNotes(updated);

    if (editIndex === i) {
      setEditIndex(null);
      setNote("");
    }
  };

  const seek = (time) => {
    chrome.tabs.query({ active: true, currentWindow: true }, ([tab]) => {
      if (!tab) return;
      chrome.tabs.sendMessage(tab.id, { type: "SEEK", time });
    });
  };

  /* ============================
     UI (UNCHANGED)
  ============================ */
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      style={{
        width: 380,
        minHeight: 480,
        padding: 20,
        background: isDark
          ? "linear-gradient(180deg, hsl(230 25% 8%) 0%, hsl(230 25% 6%) 100%)"
          : "linear-gradient(180deg, hsl(240 20% 98%) 0%, hsl(240 25% 95%) 100%)",
        borderRadius: 16
      }}
    >
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ width: 40, height: 40, borderRadius: 12, background: "hsl(239 84% 67% / 0.1)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20 }}>
            📑
          </div>
          <div>
            <h1 style={{ fontSize: 18, fontWeight: 700, margin: 0 }}>
              YT Timestamp Notes
            </h1>
            <p style={{ fontSize: 12, opacity: 0.7, margin: 0 }}>
              Save moments, learn better
            </p>
          </div>
        </div>

        <ThemeToggle
          isDark={isDark}
          onToggle={() => setIsDark(!isDark)}
        />
      </div>

      {/* Textarea */}
      <textarea
        value={note}
        onChange={(e) => setNote(e.target.value)}
        placeholder="Write a note for this moment…"
        className="glass-card"
        style={{
          width: "100%",
          height: 96,
          padding: 16,
          fontSize: 14,
          resize: "none",
          border: "none",
          outline: "none"
        }}
      />

      {/* Save Button */}
      <motion.button
        onClick={saveNote}
        disabled={!note.trim()}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className="btn-primary"
        style={{
          width: "100%",
          marginTop: 12,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 8
        }}
      >
        {editIndex !== null ? "🔄 Update Note" : "💾 Save Note"}
      </motion.button>

      {/* Notes List */}
      <div style={{ marginTop: 20, maxHeight: 260, overflowY: "auto", display: "flex", flexDirection: "column", gap: 12 }}>
        <AnimatePresence>
          {notes.length === 0 ? (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ textAlign: "center", padding: "48px 24px", opacity: 0.7 }}>
              <div style={{ fontSize: 40, marginBottom: 12 }}>📌</div>
              <p>No notes yet. Start learning 🚀</p>
            </motion.div>
          ) : (
            notes.map((n, i) => (
              <NoteCard
                key={`${n.time}-${i}`}
                time={n.time}
                text={n.text}
                index={i}
                onSeek={seek}
                onEdit={editNote}
                onDelete={deleteNote}
              />
            ))
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
