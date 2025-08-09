import MigraineEntry from "../models/Entries.js";
import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";
import ratelimit from "../config/upstash.js";

dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

let cachedInsights = null;
let cacheExpiration = null;
const CACHE_EXPIRY_MS = 60 * 60 * 1000; // 1 hour

async function formatEntriesForAI(entries) {
  return entries.map((e) => ({
    date: e.date ? e.date.toISOString().split("T")[0] : "N/A",
    time: e.time || "N/A",
    severity: e.severity,
    symptoms:
      Array.isArray(e.symptoms) && e.symptoms.length > 0
        ? e.symptoms.join(", ")
        : "none",
    potentialTriggers:
      Array.isArray(e.potentialTriggers) && e.potentialTriggers.length > 0
        ? e.potentialTriggers.join(", ")
        : "none",
    medicationsTaken:
      Array.isArray(e.medicationsTaken) && e.medicationsTaken.length > 0
        ? e.medicationsTaken.join(", ")
        : "none",
    reliefMethods:
      Array.isArray(e.reliefMethods) && e.reliefMethods.length > 0
        ? e.reliefMethods.join(", ")
        : "none",
    sleepDisturbances: e.sleepDisturbances || "none",
    hydrationLevel: e.hydrationLevel || "none",
    mealsSkipped: e.mealsSkipped ? "yes" : "no",
    additionalNotes: e.additionalNotes || "none",
  }));
}

async function getAiInsights(formattedEntries) {
  const prompt = `
You are a highly analytical and empathetic migraine analysis assistant. Your goal is to provide a concise summary, identify common patterns/triggers, and offer actionable advice based on the provided migraine diary entries.

Here are the user's migraine diary entries in chronological order:
${JSON.stringify(formattedEntries, null, 2)}

Please provide your analysis in a structured JSON format with the following keys:
1.  \`summary\`: A concise, overall summary of the user's migraine history and general observations.
2.  \`topTriggers\`: An array of strings listing the 3-5 most likely or frequently associated triggers based on the data. Be specific (e.g., "Stress (especially on high-severity days)", "Lack of consistent sleep", "Caffeine withdrawal").
3.  \`recommendations\`: An array of strings with 3-5 actionable and personalized pieces of advice to help prevent future migraines or manage symptoms, derived directly from the data patterns.

If the data is insufficient to draw strong conclusions, mention that in the summary and provide general advice.
`;

  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
  const result = await model.generateContent({
    contents: [{ role: "user", parts: [{ text: prompt }] }],
    generationConfig: {
      responseMimeType: "application/json",
      responseSchema: {
        type: "OBJECT",
        properties: {
          summary: { type: "STRING" },
          topTriggers: {
            type: "ARRAY",
            items: { type: "STRING" },
          },
          recommendations: {
            type: "ARRAY",
            items: { type: "STRING" },
          },
        },
        required: ["summary", "topTriggers", "recommendations"],
      },
    },
  });
  const responseText = result.response.text();
  return JSON.parse(responseText);
}

export async function getAiOverview(req, res) {
  if (cachedInsights && cacheExpiration > Date.now()) {
    console.log("Serving AI overview from cache");
    return res.status(200).json(cachedInsights);
  }

  try {
    const { success } = await ratelimit.limit("ai-overview-rate-limit");
    if (!success) {
      return res.status(429).json({
        message: "Too many requests, try again later.",
      });
    }

    const entries = await MigraineEntry.find().sort({ date: 1, time: 1 });

    if (!entries || entries.length < 5) {
      return res.status(200).json({
        message:
          "Not enough data for insights. Please log at least 5 migraine entries.",
        summary:
          "Please log more migraine entries to enable personalized AI insights.",
        topTriggers: [],
        recommendations: [],
      });
    }

    const formattedEntries = await formatEntriesForAI(entries);
    const insights = await getAiInsights(formattedEntries);

    cachedInsights = insights;
    cacheExpiration = Date.now() + CACHE_EXPIRY_MS;

    res.status(200).json(insights);
  } catch (error) {
    console.error("Error in getAiOverview controller:", error);
    if (error.response && error.response.data) {
      console.error("Gemini API Error Details:", error.response.data);
      return res.status(500).json({
        message:
          "Failed to generate AI overview: " +
          (error.response.data.error?.message || "API error."),
      });
    }
        res.status(500).json({ message: "Failed to generate AI overview. Please try again." });
      }
    }