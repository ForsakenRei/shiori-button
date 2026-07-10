import express from "express";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const app = express();
const PORT = process.env.PORT || 3001;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const UMAMI_BASE_URL = process.env.UMAMI_BASE_URL?.replace(/\/$/, "");
const UMAMI_WEBSITE_ID = process.env.UMAMI_WEBSITE_ID;
const UMAMI_TOKEN = process.env.UMAMI_TOKEN;
const UMAMI_START_AT = toMilliseconds(process.env.UMAMI_START_AT, 0);

function toMilliseconds(value, fallback) {
  if (value === undefined || value === null || value === "") {
    return fallback;
  }

  if (typeof value === "number" && Number.isFinite(value)) {
    return value < 1e12 ? value * 1000 : value;
  }

  const numericValue = Number(value);
  if (Number.isFinite(numericValue)) {
    return numericValue < 1e12 ? numericValue * 1000 : numericValue;
  }

  const parsedDate = Date.parse(value);
  return Number.isNaN(parsedDate) ? fallback : parsedDate;
}

function getUmamiAuthHeader() {
  if (UMAMI_TOKEN) {
    return `Bearer ${UMAMI_TOKEN}`;
  }
  return null;
}

async function fetchUmamiVisitors() {
  if (!UMAMI_BASE_URL) {
    throw new Error("UMAMI_BASE_URL is not configured");
  }

  if (!UMAMI_WEBSITE_ID) {
    throw new Error("UMAMI_WEBSITE_ID is not configured");
  }

  const authHeader = getUmamiAuthHeader();
  if (!authHeader) {
    throw new Error("UMAMI_TOKEN is not configured");
  }

  const params = new URLSearchParams({
    startAt: String(UMAMI_START_AT),
    endAt: String(Date.now()),
  });

  const requestUrl = `${UMAMI_BASE_URL}/api/websites/${UMAMI_WEBSITE_ID}/stats?${params.toString()}`;

  const response = await fetch(requestUrl, {
    headers: {
      Accept: "application/json",
      Authorization: authHeader,
    },
  });

  if (!response.ok) {
    const errText = await response.text();
    if (response.status === 404) {
      throw new Error(
        `Umami API request failed (404) for ${requestUrl}. ` +
          "This base URL does not appear to expose the Umami admin API. " +
          "Point UMAMI_BASE_URL at the actual Umami API origin, not the public site URL.",
      );
    }
    throw new Error(
      `Umami API request failed (${response.status}): ${errText}`,
    );
  }

  const stats = await response.json();
  if (typeof stats?.visitors !== "number") {
    throw new Error(
      "Umami API response does not contain numeric visitors field",
    );
  }

  return stats.visitors;
}

app.get("/api/visitor-count", async (req, res) => {
  try {
    const count = await fetchUmamiVisitors();
    res.json({ count });
  } catch (error) {
    console.error("Failed to fetch Umami visitor count:", error);
    res.status(500).json({ error: "Failed to fetch visitor count from Umami" });
  }
});

app.post("/api/visitor-count", async (req, res) => {
  try {
    const count = await fetchUmamiVisitors();
    res.json({ count });
  } catch (error) {
    console.error("Failed to fetch Umami visitor count:", error);
    res.status(500).json({ error: "Failed to fetch visitor count from Umami" });
  }
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
