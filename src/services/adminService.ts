import { GoogleGenAI, Type } from "@google/genai";
import { ExamData } from "../types/exam";

const genAI = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

export async function parseExamFromImage(base64Image: string, skill: string): Promise<ExamData> {
  const prompt = `Analyze this ${skill} practice material image/PDF and extract the content into a valid JSON format.
  If it's an IELTS test (Reading, Listening, Writing, Speaking), use the ExamData structure.
  If it's Shadowing or Typing, extract the article/text content.
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
        "title": "Module Title",
        "content": "Full text content for Reading/Shadowing/Typing",
        "audioUrl": "Empty or identified audio link",
        "questions": [
          {
            "id": "q1",
            "type": "multiple-choice | fill-blank | matching | dropdown | writing",
            "question": "Question text (optional for Shadowing/Typing)",
            "options": ["Option A", "Option B"],
            "correctAnswer": "Answer string"
          }
        ]
      }
    ]
  }
  
  For Shadowing/Typing: Put the full text in the first section's "content" field. Leave questions empty if not applicable.`;

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
