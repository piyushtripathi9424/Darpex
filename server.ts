import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Health check
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", app: "Premium Car Studio API" });
  });

  // AI Detailer & Vehicle Assessment Endpoint
  app.post("/api/ai-detailer", async (req, res) => {
    try {
      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey) {
        return res.status(500).json({
          error: "GEMINI_API_KEY is not configured.",
          fallback: true
        });
      }

      const { vehicleInfo, surfaceCondition, primaryGoal, selectedService } = req.body;

      const ai = new GoogleGenAI({ apiKey });

      const prompt = `You are the Master Detailer and Technical Consultant for "Premium Car", an ultra-luxury automotive detailing and modification studio.
Analyze this client vehicle request and provide a professional, luxury assessment in JSON format.

Vehicle Details:
- Make & Model: ${vehicleInfo?.make || "Luxury Vehicle"} ${vehicleInfo?.model || ""}
- Year: ${vehicleInfo?.year || "2024"}
- Color & Paint Type: ${vehicleInfo?.color || "Black Metallic"}
- Body Style: ${vehicleInfo?.bodyType || "Coupe"}
- Current Surface Condition: ${surfaceCondition || "Minor swirl marks, light water spots"}
- Primary Client Goal: ${primaryGoal || "Maximum gloss and long-term paint protection"}
- Interested Service: ${selectedService || "Ceramic Coating 9H"}

Respond ONLY with a valid JSON object matching this structure:
{
  "assessmentSummary": "Concise 2-sentence technical evaluation of the vehicle's paint and surface requirements.",
  "recommendedPackages": [
    {
      "title": "Package Name",
      "description": "Short explanation why this fits the vehicle.",
      "estimatedHours": "4-6 hours",
      "suggestedAddOns": ["Wheel Ceramic Coating", "Glass Hydrophobic Armor"]
    }
  ],
  "paintConditionGrade": "9.2/10",
  "recommendedCuringTime": "24 hours climate-controlled bay",
  "expectedLongevityYears": 5,
  "masterDetailerTip": "An exclusive pro tip for maintaining this specific car's paint type."
}`;

      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          temperature: 0.4
        }
      });

      const text = response.text || "{}";
      const json = JSON.parse(text);
      res.json(json);
    } catch (err: any) {
      console.error("AI Detailer API Error:", err);
      res.status(500).json({
        error: "Failed to generate AI detailing recommendation",
        details: err.message
      });
    }
  });

  // Vite middleware in dev mode
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(__dirname, "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Premium Car Dev Server listening at http://localhost:${PORT}`);
  });
}

startServer();
