import express from "express";
import { getEntries,
         getEntryById,
         addEntry,
         updateEntry,
         deleteEntry,
        } from "../controllers/appControllers.js";
//import { getAiOverview } from "../controllers/aiController.js"; 
import { getAiOverview } from "../controllers/aiController-improved.js"; // Use the improved AI controller

const router = express.Router();

router.get("/", getEntries);
//ai overview
router.get("/ai-overview", getAiOverview);
router.get("/:id", getEntryById);
router.post("/new", addEntry);
router.put("/update/:id", updateEntry);
router.delete("/delete/:id", deleteEntry);


export default router;
