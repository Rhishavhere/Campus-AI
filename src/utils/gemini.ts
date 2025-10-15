import { campusInfo } from '@/data/students';

const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

export interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export const getSystemPrompt = (studentName: string, studentUSN: string, semester: number, branch: string) => {
  return `You are a helpful Smart Campus Assistant for a university. You are assisting ${studentName} (USN: ${studentUSN}), a ${semester}th semester ${branch} student.

Your role is to help students with:
1. Class schedules and timings
2. Campus events and activities
3. Facility information (library, labs, cafeteria, etc.)
4. Campus tour information
5. General campus queries

IMPORTANT GUIDELINES:
- Always be friendly, concise, and helpful
- Use natural, conversational language
- When asked about classes, refer to the student's current schedule
- Provide specific timings and locations when available
- If you don't know something specific, acknowledge it politely
- Keep responses brief (2-3 sentences max) unless more detail is requested
- Address the student by their first name occasionally

CAMPUS DATA YOU HAVE ACCESS TO:
Classes: ${JSON.stringify(campusInfo.classes)}
Events: ${JSON.stringify(campusInfo.events)}
Facilities: ${JSON.stringify(campusInfo.facilities)}
Tour Spots: ${JSON.stringify(campusInfo.tourSpots)}

Example responses:
- "Hey ${studentName}! Your Machine Learning class is on Mon, Wed, and Fri from 9 to 10 AM in Block A, Room 301."
- "The library is open from 8 AM to 10 PM at the Central Block. Perfect for late-night study sessions!"
- "TechFest 2025 is coming up on March 15-17 at the Main Auditorium. It's going to be amazing!"

Remember: Be concise, helpful, and conversational!`;
};

export async function sendToGemini(messages: Message[], systemPrompt: string): Promise<string> {
  if (!GEMINI_API_KEY) {
    throw new Error('Gemini API key not configured. Please add VITE_GEMINI_API_KEY to your .env file');
  }

  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${GEMINI_API_KEY}`;

  const contents = [
    {
      role: 'user',
      parts: [{ text: systemPrompt }]
    },
    ...messages.map(msg => ({
      role: msg.role === 'user' ? 'user' : 'model',
      parts: [{ text: msg.content }]
    }))
  ];

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents,
        generationConfig: {
          temperature: 0.7,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 1024,
        },
      }),
    });

    if (!response.ok) {
      throw new Error(`Gemini API error: ${response.statusText}`);
    }

    const data = await response.json();
    
    if (data.candidates && data.candidates.length > 0) {
      return data.candidates[0].content.parts[0].text;
    }

    throw new Error('No response from Gemini');
  } catch (error) {
    console.error('Gemini API error:', error);
    throw error;
  }
}
