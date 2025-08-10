import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";

import router from "./src/routes/appRoutes.js";
import { connectDB } from "./src/config/db.js";
import rateLimiter from "./src/middleware/rateLimiter.js";

// Setup __dirname in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();

const app = express();

// CORS: only enable in development mode
if (process.env.NODE_ENV !== "production") {
  app.use(cors({ origin: "http://localhost:5173" }));
}

app.use(express.json());
app.use(rateLimiter);

// --- Backend routes ---
app.use("/diary/migranes", router);

// --- Serve frontend build in production ---
if (process.env.NODE_ENV === "production") {
  const frontendPath = path.join(__dirname, "..", "frontend", "dist");
  app.use(express.static(frontendPath));

  // SPA fallback using regex to avoid Express 5 crash
  app.get(/.*/, (req, res) => {
    if (req.path.startsWith("/diary/migranes")) {
      return res.status(404).json({ error: "API route not found" });
    }
    res.sendFile(path.join(frontendPath, "index.html"));
  });
}

const port = process.env.PORT || 5050;

connectDB().then(() => {
  app.listen(port, () => {
    console.log(`server started at port ${port}`);
  });
});
