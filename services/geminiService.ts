import { GoogleGenAI, Type } from "@google/genai";
import { DiagnosisResult } from "../types";

// Using the recommended gemini-3-flash-preview for stable multimodal performance
const MODEL_NAME = 'gemini-3-flash-preview';

export const fileToGenerativePart = async (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result as string;
      const base64Data = base64String.split(',')[1];
      resolve(base64Data);
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};

export const diagnosePlantImage = async (base64Image: string): Promise<DiagnosisResult> => {
  // 1. Basic network sanity check
  if (!navigator.onLine) {
    throw new Error("You are currently offline. Please reconnect to use AI diagnostics.");
  }

  // 2. API Key verification
  if (!process.env.API_KEY) {
    throw new Error("API Key is missing. Please ensure your environment is configured correctly.");
  }

  // 3. Late-initialization of the SDK to ensure process.env.API_KEY is available
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

  const schema = {
    type: Type.OBJECT,
    properties: {
      plantName: { type: Type.STRING, description: "Common name of the plant" },
      scientificName: { type: Type.STRING, description: "Scientific name of the plant" },
      confidence: { type: Type.NUMBER, description: "Confidence score 0-100" },
      healthStatus: { 
        type: Type.STRING, 
        enum: ["Thriving", "Recovering", "Critical"],
        description: "Overall health status"
      },
      diagnosis: { type: Type.STRING, description: "Summary of the findings" },
      reasoning: { type: Type.STRING, description: "Explanation of visual symptoms" },
      carePlan: { 
        type: Type.ARRAY, 
        items: { type: Type.STRING },
        description: "Actionable care steps" 
      },
      suggestedWaterFrequency: { type: Type.NUMBER, description: "Watering interval in days" },
      suggestedMistFrequency: { type: Type.NUMBER, description: "Misting interval in days (0 if not needed)" },
      suggestedFertilizeFrequency: { type: Type.NUMBER, description: "Fertilizing interval in days (0 if not needed)" }
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
    Act as a senior botanist and plant pathologist. 
    Analyze the image to:
    1. Identify the species accurately.
    2. Determine if it is Thriving, Recovering, or in a Critical state.
    3. Provide a clear diagnosis and a step-by-step care plan for recovery or maintenance.
    4. Provide specific numeric frequencies for watering, misting, and fertilizing.
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
        temperature: 0.1, // Low temperature for deterministic diagnostic results
      }
    });

    const resultText = response.text;
    if (!resultText) {
      throw new Error("The AI provided an empty response. Please try with a clearer photo.");
    }

    return JSON.parse(resultText) as DiagnosisResult;

  } catch (error: any) {
    console.error("Diagnostic Fetch Error:", error);
    
    // Convert common fetch/network errors to user-friendly messages
    if (error.message?.includes('fetch') || error.name === 'TypeError') {
      throw new Error("Unable to connect to the diagnostic server. Please check your internet connection.");
    }
    
    throw error;
  }
};