import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

/**
 * System-level rules for the chatbot.
 * This is NOT a user message.
 */
const SYSTEM_PROMPT = `
You are a helpful veterinary assistant chatbot.

Rules:
1. Answer ONLY veterinary-related questions such as:
   - Pet care and health
   - Vaccinations
   - Diet and nutrition
   - Common illnesses
   - Preventive care
   - General pet wellness

2. Help users book veterinary appointments when they request it.

3. If the user asks a NON-veterinary question, respond with:
   "I can only help with veterinary-related questions and appointment booking."

4. Be concise, friendly, and professional.

5. When booking an appointment, collect:
   - Pet owner name
   - Pet name
   - Phone number
   - Preferred date and time
`;

/**
 * Generate AI response using Gemini
 * @param {string} userMessage - latest user message
 * @param {Array} conversationHistory - previous messages in Gemini format
 */
export const getAIResponse = async (userMessage, conversationHistory = []) => {
  try {
    const model = genAI.getGenerativeModel({
      model: 'gemini-1.5-flash',
      systemInstruction: SYSTEM_PROMPT,
    });

    const chat = model.startChat({
      history: conversationHistory, // only real past messages
      generationConfig: {
        maxOutputTokens: 500,
        temperature: 0.7,
      },
    });

    const result = await chat.sendMessage(userMessage);
    return result.response.text();
  } catch (error) {
    console.error('Gemini API Error:', error);
    throw new Error('Failed to get AI response');
  }
};

/**
 * Simple keyword-based appointment intent detection
 * @param {string} message
 */
export const detectAppointmentIntent = (message) => {
  const appointmentKeywords = [
    'book',
    'appointment',
    'schedule',
    'visit',
    'consultation',
    'checkup',
    'check-up',
    'see vet',
    'vet visit',
  ];

  const lowerMessage = message.toLowerCase();
  return appointmentKeywords.some(keyword =>
    lowerMessage.includes(keyword)
  );
};
