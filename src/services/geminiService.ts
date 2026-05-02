import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || '' });

export interface WritingFeedback {
  band: number;
  overallComments: string;
  taskResponse: { score: number; feedback: string };
  coherenceAndCohesion: { score: number; feedback: string };
  lexicalResource: { score: number; feedback: string };
  grammaticalRange: { score: number; feedback: string };
  suggestions: string[];
}

export const getWritingFeedback = async (question: string, essay: string): Promise<WritingFeedback> => {
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `As an IELTS expert, evaluate the following writing task.
    Question: ${question}
    Essay: ${essay}`,
    config: {
      systemInstruction: "You are an official IELTS examiner. Provide strict, realistic scoring and constructive feedback.",
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          band: { type: Type.NUMBER },
          overallComments: { type: Type.STRING },
          taskResponse: {
            type: Type.OBJECT,
            properties: {
              score: { type: Type.NUMBER },
              feedback: { type: Type.STRING }
            },
            required: ["score", "feedback"]
          },
          coherenceAndCohesion: {
            type: Type.OBJECT,
            properties: {
              score: { type: Type.NUMBER },
              feedback: { type: Type.STRING }
            },
            required: ["score", "feedback"]
          },
          lexicalResource: {
            type: Type.OBJECT,
            properties: {
              score: { type: Type.NUMBER },
              feedback: { type: Type.STRING }
            },
            required: ["score", "feedback"]
          },
          grammaticalRange: {
            type: Type.OBJECT,
            properties: {
              score: { type: Type.NUMBER },
              feedback: { type: Type.STRING }
            },
            required: ["score", "feedback"]
          },
          suggestions: {
            type: Type.ARRAY,
            items: { type: Type.STRING }
          }
        },
        required: ["band", "overallComments", "taskResponse", "coherenceAndCohesion", "lexicalResource", "grammaticalRange", "suggestions"]
      }
    }
  });

  return JSON.parse(response.text || '{}');
};

export interface SpeakingFeedback {
  band: number;
  fluency: string;
  lexical: string;
  grammar: string;
  pronunciation: string;
  tips: string[];
}

export const getSpeakingFeedback = async (transcript: string): Promise<SpeakingFeedback> => {
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `Evaluate this IELTS Speaking transcript: ${transcript}`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          band: { type: Type.NUMBER },
          fluency: { type: Type.STRING },
          lexical: { type: Type.STRING },
          grammar: { type: Type.STRING },
          pronunciation: { type: Type.STRING },
          tips: { type: Type.ARRAY, items: { type: Type.STRING } }
        },
        required: ["band", "fluency", "lexical", "grammar", "pronunciation", "tips"]
      }
    }
  });

  return JSON.parse(response.text || '{}');
};
