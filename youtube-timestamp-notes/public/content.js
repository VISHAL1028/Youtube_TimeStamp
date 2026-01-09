console.log("YT Notes content script loaded");

chrome.runtime.onMessage.addListener((req, sender, sendResponse) => {
  const video = document.querySelector("video");

  // 🔴 ALWAYS respond
  if (!video) {
    sendResponse(null);
    return true;
  }

  if (req.type === "GET_TIME") {
    sendResponse({ time: Math.floor(video.currentTime) });
    return true; // 🔥 REQUIRED
  }

  if (req.type === "SEEK") {
    video.currentTime = req.time;
    sendResponse(true);
    return true;
  }
});

/* ===============================
   Floating panel (UI only)
================================ */
const panel = document.createElement("div");
panel.id = "yt-note-panel";
panel.innerHTML = `
  <textarea placeholder="Quick note..."></textarea>
  <button>Save</button>
`;
document.body.appendChild(panel);

const style = document.createElement("style");
style.innerHTML = `
#yt-note-panel {
  position: fixed;
  top: 120px;
  right: 20px;
  width: 220px;
  background: #111827;
  color: white;
  padding: 10px;
  border-radius: 12px;
  z-index: 9999;
}
#yt-note-panel textarea {
  width: 100%;
  height: 60px;
  margin-bottom: 6px;
}
#yt-note-panel button {
  width: 100%;
  background: #6366f1;
  color: white;
  border: none;
  padding: 6px;
  cursor: pointer;
}
`;
document.head.appendChild(style);
