import { GoogleGenAI, Type } from "@google/genai";
import { ExamData } from "../types/exam";

const genAI = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

export async function parseExamFromImage(base64Image: string, skill: string): Promise<ExamData> {
  const prompt = `Analyze this IELTS ${skill} practice test image/PDF and extract all questions into a valid JSON format.
  The output MUST strictly follow the ExamData interface:
  {
    "id": "generated_id",
    "type": "IELTS",
    "skill": "${skill}",
    "title": "Extracted Title",
    "duration": 1200,
    "sections": [
      {
        "id": "s1",
        "title": "Section Title",
        "content": "Reading text content if applicable",
        "audioUrl": "Leave empty",
        "questions": [
          {
            "id": "q1",
            "type": "multiple-choice | fill-blank | matching | dropdown",
            "question": "The question text",
            "options": ["Option A", "Option B"],
            "correctAnswer": "Answer string"
          }
        ]
      }
    ]
  }
  
  Be extremely careful with question sequences and correct answers. If the image has 40 questions, extract all of them.`;

  const response = await genAI.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: {
      parts: [
        { text: prompt },
        {
          inlineData: {
            data: base64Image.split(',')[1],
            mimeType: "image/png"
          }
        }
      ]
    }
  });

  const text = response.text;
  if (!text) throw new Error("AI returned empty response");
  // Clean up JSON if there are markdown blocks
  const cleanJson = text.replace(/```json|```/g, "").trim();
  
  try {
    return JSON.parse(cleanJson);
  } catch (e) {
    console.error("AI returned invalid JSON:", text);
    throw new Error("Failed to parse AI response into valid exam data.");
  }
}
