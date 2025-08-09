import express from "express";
import dotenv from "dotenv";
import cors from "cors";

import router from "./src/routes/appRoutes.js";
import {connectDB} from "./src/config/db.js";
import rateLimiter from "./src/middleware/rateLimiter.js";


const app = express();
dotenv.config();
app.use(cors({
    origin: "http://localhost:5173"
}));
app.use(express.json());
app.use(rateLimiter);


app.use("/diary/migranes", router);

const port = process.env.PORT || 5050;
connectDB().then(() => {
    app.listen(port, () => {
        console.log("server started at port 5050");
    });
});
