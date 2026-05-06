import express from "express";
import dotenv from "dotenv";
import cors from "cors";

import router from "./src/routes/appRoutes.js";
import {connectDB} from "./src/config/db.js";
import rateLimiter from "./src/middleware/rateLimiter.js";


const app = express();
dotenv.config();

// Allow configuring the frontend origin at runtime (useful for production).
const clientOrigin = process.env.CLIENT_ORIGIN;
const corsOrigin =
  clientOrigin && clientOrigin.includes(",")
    ? clientOrigin.split(",").map((s) => s.trim())
    : (clientOrigin || "http://localhost:5173");

app.use(cors({
    origin: corsOrigin,
    credentials: true,
}));
app.use(express.json());
app.use(rateLimiter);


app.use("/diary/migranes", router);

const port = process.env.PORT || 5050;
connectDB()
    .then(() => {
        app.listen(port, () => {
            console.log(`server started at port ${port}`);
        });
    })
    .catch((err) => {
        console.error("Failed to start server due to DB connection error:", err);
        process.exit(1);
    });
