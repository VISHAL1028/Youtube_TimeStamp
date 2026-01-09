console.log("✅ YouTube Timestamp Notes: content.js loaded");

chrome.runtime.onMessage.addListener((req, sender, sendResponse) => {
  const video = document.querySelector("video");

  if (!video) {
    console.log("❌ No video element found");
    return;
  }

  if (req.type === "GET_TIME") {
    console.log("⏱ Sending current time:", video.currentTime);
    sendResponse({ time: Math.floor(video.currentTime) });
    return true; // IMPORTANT
  }

  if (req.type === "SEEK") {
    console.log("⏩ Seeking to:", req.time);
    video.currentTime = req.time;
  }
});
