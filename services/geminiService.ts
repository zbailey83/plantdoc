import { GoogleGenAI, Type } from "@google/genai";
import { DiagnosisResult, HealthStatus } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const MODEL_NAME = 'gemini-2.5-flash';

// Helper to convert file to base64
export const fileToGenerativePart = async (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result as string;
      // Remove the data URL prefix (e.g., "data:image/jpeg;base64,")
      const base64Data = base64String.split(',')[1];
      resolve(base64Data);
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};

export const diagnosePlantImage = async (base64Image: string): Promise<DiagnosisResult> => {
  if (!process.env.API_KEY) {
    throw new Error("API Key is missing. Please configure process.env.API_KEY.");
  }

  const schema = {
    type: Type.OBJECT,
    properties: {
      plantName: { type: Type.STRING, description: "Common name of the plant" },
      scientificName: { type: Type.STRING, description: "Scientific name of the plant" },
      confidence: { type: Type.NUMBER, description: "Confidence score between 0 and 100" },
      healthStatus: { 
        type: Type.STRING, 
        enum: ["Thriving", "Recovering", "Critical"],
        description: "Overall health assessment"
      },
      diagnosis: { type: Type.STRING, description: "Short title of the issue (e.g. Root Rot, Healthy)" },
      reasoning: { type: Type.STRING, description: "Detailed explanation of visual symptoms observed" },
      carePlan: { 
        type: Type.ARRAY, 
        items: { type: Type.STRING },
        description: "Step-by-step recovery or maintenance instructions" 
      },
      suggestedWaterFrequency: { type: Type.NUMBER, description: "Recommended watering frequency in days" },
      suggestedMistFrequency: { type: Type.NUMBER, description: "Recommended misting frequency in days (0 if not needed)" },
      suggestedFertilizeFrequency: { type: Type.NUMBER, description: "Recommended fertilizing frequency in days (0 if not needed)" }
    },
    required: [
      "plantName", 
      "scientificName", 
      "confidence", 
      "healthStatus", 
      "diagnosis", 
      "reasoning", 
      "carePlan", 
      "suggestedWaterFrequency",
      "suggestedMistFrequency",
      "suggestedFertilizeFrequency"
    ]
  };

  const prompt = `
    You are an expert botanist and plant pathologist. 
    Analyze the provided image of a plant. 
    Identify the species and diagnose any health issues. 
    If the plant is healthy, provide maintenance tips.
    Be encouraging but realistic.
    Provide specific schedules for watering, misting, and fertilizing. If misting or fertilizing is not required for this species, set frequency to 0.
  `;

  try {
    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: {
        parts: [
          { inlineData: { mimeType: "image/jpeg", data: base64Image } },
          { text: prompt }
        ]
      },
      config: {
        responseMimeType: "application/json",
        responseSchema: schema,
        temperature: 0.4, // Lower temperature for more analytical results
      }
    });

    const text = response.text;
    if (!text) throw new Error("No response from AI");

    const result = JSON.parse(text);
    
    // Map string enum to strong type if needed, though Schema ensures it matches
    return result as DiagnosisResult;

  } catch (error) {
    console.error("Error diagnosing plant:", error);
    throw error;
  }
};