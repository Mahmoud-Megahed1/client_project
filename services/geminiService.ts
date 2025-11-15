
import { GoogleGenAI, Type } from "@google/genai";
import { GenerationResult } from '../types';

const fileToGenerativePart = async (file: File) => {
  const base64EncodedDataPromise = new Promise<string>((resolve) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      if (typeof reader.result === 'string') {
        resolve(reader.result.split(',')[1]);
      } else {
        resolve(''); // Should not happen with readAsDataURL
      }
    };
    reader.readAsDataURL(file);
  });
  const base64EncodedData = await base64EncodedDataPromise;
  return {
    inlineData: {
      data: base64EncodedData,
      mimeType: file.type,
    },
  };
};

export const generateSlidesAndSummary = async (file: File): Promise<GenerationResult> => {
  if (!process.env.API_KEY) {
    throw new Error("API_KEY environment variable is not set.");
  }
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

  const imagePart = await fileToGenerativePart(file);

  const prompt = `You are an expert academic assistant named Nodqra. Your task is to analyze the provided document and transform its content into a concise, educational presentation and a detailed summary.

Instructions:
1.  **Analyze the document:** Carefully read and understand the key concepts, arguments, and information presented.
2.  **Generate Slides:** Create a series of 5-7 informative slides. Each slide must have a 'title' that captures the main idea of the slide, and 'content' presented as an array of short, clear bullet points (strings).
3.  **Generate Summary:** Write a comprehensive 'summary' that synthesizes the main points of the entire document.
4.  **Format:** Your entire output must be a single, valid JSON object that conforms to the provided schema. Do not include any text or markdown formatting outside of the JSON structure.`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: {
        parts: [
          imagePart,
          { text: prompt },
        ],
      },
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            slides: {
              type: Type.ARRAY,
              description: "An array of slide objects, each containing a title and content bullet points.",
              items: {
                type: Type.OBJECT,
                properties: {
                  title: {
                    type: Type.STRING,
                    description: "The main title of the slide.",
                  },
                  content: {
                    type: Type.ARRAY,
                    description: "An array of strings, where each string is a bullet point for the slide.",
                    items: {
                      type: Type.STRING,
                    },
                  },
                },
                required: ["title", "content"],
              },
            },
            summary: {
              type: Type.STRING,
              description: "A detailed summary of the entire document's content.",
            },
          },
          required: ["slides", "summary"],
        },
      },
    });

    const jsonString = response.text.trim();
    const result = JSON.parse(jsonString);
    
    // Basic validation to ensure the structure matches our type
    if (result && Array.isArray(result.slides) && typeof result.summary === 'string') {
        return result as GenerationResult;
    } else {
        throw new Error("Invalid JSON structure received from API.");
    }

  } catch (error) {
    console.error("Error generating content from Gemini:", error);
    throw new Error("Failed to generate presentation. Please check the console for details.");
  }
};
