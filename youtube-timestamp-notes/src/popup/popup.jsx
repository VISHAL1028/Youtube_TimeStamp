import { useEffect, useState } from "react";

export default function Popup() {
  const [note, setNote] = useState("");
  const [notes, setNotes] = useState([]);

  // 🔹 Get active tab
  const getActiveTab = async () => {
    const [tab] = await chrome.tabs.query({
      active: true,
      currentWindow: true
    });
    return tab;
  };

  // 🔹 Load notes for current video
  const loadNotes = async () => {
    const tab = await getActiveTab();
    if (!tab?.url) return;

    const videoId = new URL(tab.url).searchParams.get("v");
    if (!videoId) return;

    chrome.storage.local.get(["notes"], (data) => {
      setNotes(data.notes?.[videoId] || []);
    });
  };

  // 🔹 Save note with timestamp
 const saveNote = async () => {
  if (!note.trim()) {
    console.log("❌ Note is empty");
    return;
  }

  const tab = await getActiveTab();

  if (!tab?.url || !tab.url.includes("youtube.com/watch")) {
    console.log("❌ Not a YouTube video page");
    return;
  }

  const videoId = new URL(tab.url).searchParams.get("v");

  chrome.tabs.sendMessage(
    tab.id,
    { type: "GET_TIME" },
    (response) => {
      if (chrome.runtime.lastError) {
        console.error("❌ Message error:", chrome.runtime.lastError.message);
        return;
      }

      if (!response) {
        console.error("❌ No response from content script");
        return;
      }

      chrome.storage.local.get(["notes"], (data) => {
        const allNotes = data.notes || {};
        allNotes[videoId] = allNotes[videoId] || [];

        allNotes[videoId].push({
          time: response.time,
          text: note
        });

        chrome.storage.local.set({ notes: allNotes }, () => {
          console.log("✅ Note saved");
          setNote("");
          loadNotes();
        });
      });
    }
  );
};

  // 🔹 Seek to timestamp
  const seek = async (time) => {
    const tab = await getActiveTab();
    chrome.tabs.sendMessage(tab.id, {
      type: "SEEK",
      time
    });
  };

  useEffect(() => {
    loadNotes();
  }, []);

  return (
    <div className="container">
      <h3>YouTube Timestamp Notes</h3>

      <textarea
        value={note}
        onChange={(e) => setNote(e.target.value)}
        placeholder="Write your note..."
      />

      <button onClick={saveNote}>Save Note</button>

      <ul>
        {notes.length === 0 && <p>No notes yet</p>}
        {notes.map((n, i) => (
          <li key={i} onClick={() => seek(n.time)}>
            ⏱ {formatTime(n.time)} — {n.text}
          </li>
        ))}
      </ul>
    </div>
  );
}

// 🔹 Helper function
function formatTime(seconds) {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${s.toString().padStart(2, "0")}`;
}
