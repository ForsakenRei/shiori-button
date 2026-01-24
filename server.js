import express from "express";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const app = express();
const PORT = process.env.PORT || 3001;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const COUNTER_FILE = path.join(__dirname, "visitorCount.json");

function getVisitorCount() {
  try {
    const data = fs.readFileSync(COUNTER_FILE, "utf-8");
    return JSON.parse(data).count || 0;
  } catch {
    return 0;
  }
}

function setVisitorCount(count) {
  fs.writeFileSync(COUNTER_FILE, JSON.stringify({ count }), "utf-8");
}

app.get("/api/visitor-count", (req, res) => {
  res.json({ count: getVisitorCount() });
});

app.post("/api/visitor-count", (req, res) => {
  let count = getVisitorCount();
  count++;
  setVisitorCount(count);
  res.json({ count });
});

// get the count of audio files
app.get("/api/file-count", (req, res) => {
  const audioDir = path.join(__dirname, "public", "audio");
  fs.readdir(audioDir, (err, files) => {
    if (err) {
      res.status(500).json({ error: "Directory not found" });
    } else {
      const count = files.filter((f) => f !== "audioList.json").length;
      res.json({ count });
    }
  });
});

//use latest dateAdded in audioList.json as update timestamp
app.get("/api/lastmod", (req, res) => {
  const audioListPath = path.join(
    __dirname,
    "public",
    "audio",
    "audioList.json",
  );
  fs.readFile(audioListPath, "utf-8", (err, data) => {
    if (err) {
      res.status(500).json({ error: "File not found" });
      return;
    }
    try {
      const list = JSON.parse(data);
      const latest = list.reduce((max, item) => {
        if (item.dateAdded && (!max || item.dateAdded > max)) {
          return item.dateAdded;
        }
        return max;
      }, null);
      res.json({ lastModified: latest || null });
    } catch (e) {
      res.status(500).json({ error: "Invalid JSON" });
    }
  });
});

// Serve static files from dist (production build)
app.use(express.static(path.join(__dirname, "dist")));

// SPA fallback
app.get(/^\/(?!api).*/, (req, res) => {
  res.sendFile(path.join(__dirname, "dist", "index.html"));
});

app.listen(PORT, () => {
  console.log(`Backend running on port ${PORT}`);
});
