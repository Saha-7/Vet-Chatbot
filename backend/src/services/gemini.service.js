const SYSTEM_PROMPT = `You are a helpful veterinary assistant chatbot. Your role is to:

1. Answer ONLY veterinary-related questions about:
   - Pet care and health
   - Vaccinations
   - Diet and nutrition
   - Common illnesses
   - Preventive care
   - General pet wellness

2. Help users book veterinary appointments when they ask.

3. For NON-veterinary questions, politely say: "I can only help with veterinary-related questions and appointment booking."

4. Keep responses concise, friendly, and professional.

5. When users want to book an appointment, ask for:
   - Pet owner name
   - Pet name
   - Phone number
   - Preferred date and time

Always be helpful and caring about pet wellness.`;

export const getAIResponse = async (userMessage, conversationHistory = []) => {
  try {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error('GEMINI_API_KEY is not configured');
    }

    const modelToUse = 'gemini-2.5-flash';

    let prompt = SYSTEM_PROMPT + '\n\n';

    if (conversationHistory.length > 0) {
      conversationHistory.forEach(msg => {
        const role = msg.role === 'user' ? 'User' : 'Assistant';
        prompt += `${role}: ${msg.parts[0].text}\n`;
      });
      prompt += '\n';
    }

    prompt += `User: ${userMessage}\nAssistant:`;

    const url = `https://generativelanguage.googleapis.com/v1/models/${modelToUse}:generateContent?key=${apiKey}`;

    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: {
          maxOutputTokens: 300,
          temperature: 0.7,
        },
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('API Error:', errorData);
      throw new Error('Gemini API request failed');
    }

    const data = await response.json();
    const rawText = data.candidates[0].content.parts[0].text;

    // ✅ CLEAN NEWLINES HERE
    const cleanedText = rawText
      .replace(/\n+/g, ' ')   // replace newlines with space
      .replace(/\s+/g, ' ')   // normalize spaces
      .trim();

    return cleanedText;
  } catch (error) {
    console.error('Gemini API Error:', error.message);
    throw new Error('Failed to get AI response');
  }
};


export const detectAppointmentIntent = (message) => {
  const appointmentKeywords = [
    'book', 'appointment', 'schedule', 'visit', 'consultation',
    'checkup', 'check-up', 'see vet', 'vet visit'
  ];
  
  const lowerMessage = message.toLowerCase();
  return appointmentKeywords.some(keyword => lowerMessage.includes(keyword));
};