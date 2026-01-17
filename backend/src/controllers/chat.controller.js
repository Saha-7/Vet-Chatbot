
// import {
//   createSession,
//   getSession,
//   saveMessage,
//   getConversationHistory,
// } from '../services/session.service.js';
// import { getAIResponse } from '../services/gemini.service.js';
// import { createAppointment, isValidPhone, isValidDate } from '../services/appointment.service.js';

// // Simple regex patterns to extract appointment info
// const extractAppointmentData = (message) => {
//   const patterns = {
//     ownerName: /(?:owner\s*name|my\s*name|name):\s*([A-Za-z\s]+?)(?:,|$|\n)/i,
//     petName: /(?:pet\s*name):\s*([A-Za-z\s]+?)(?:,|$|\n)/i,
//     phone: /(?:phone|number|contact):\s*([\d\s\-\+\(\)]{10,}?)(?:,|$|\n)/i,
//     dateTime: /(?:date|time|preferred):\s*([^,\n]+?)(?:,|$|\n)/i,
//   };

//   const data = {};
  
//   for (const [key, pattern] of Object.entries(patterns)) {
//     const match = message.match(pattern);
//     if (match) {
//       data[key] = match[1].trim();
//     }
//   }

//   return data;
// };

// // Check if message contains all appointment details
// const hasAllAppointmentDetails = (data) => {
//   return data.ownerName && data.petName && data.phone && data.dateTime;
// };

// export const handleChat = async (req, res) => {
//   try {
//     const { sessionId, message, context } = req.body;

//     // Validate input
//     if (!message || !message.trim()) {
//       return res.status(400).json({
//         success: false,
//         message: 'Message is required',
//       });
//     }

//     let currentSessionId = sessionId;

//     // Create new session if none exists
//     if (!currentSessionId) {
//       const newSession = await createSession(context || {});
//       currentSessionId = newSession.sessionId;
//     } else {
//       const existingSession = await getSession(currentSessionId);
//       if (!existingSession) {
//         return res.status(404).json({
//           success: false,
//           message: 'Session not found',
//         });
//       }
//     }

//     // Get conversation history BEFORE saving current message
//     const history = await getConversationHistory(currentSessionId);

//     // Save user message
//     await saveMessage(currentSessionId, 'user', message);

//     // Check if user is providing appointment details
//     const appointmentData = extractAppointmentData(message);
    
//     if (hasAllAppointmentDetails(appointmentData)) {
//       try {
//         // Validate and create appointment
//         if (isValidPhone(appointmentData.phone) && isValidDate(appointmentData.dateTime)) {
//           await createAppointment({
//             sessionId: currentSessionId,
//             ownerName: appointmentData.ownerName,
//             petName: appointmentData.petName,
//             phone: appointmentData.phone,
//             dateTime: appointmentData.dateTime,
//           });
//           console.log('✅ Appointment saved to database');
//         }
//       } catch (error) {
//         console.error('Failed to save appointment:', error);
//         // Continue with AI response even if appointment save fails
//       }
//     }

//     // Get AI response
//     const aiResponse = await getAIResponse(message, history);

//     // Save bot response
//     await saveMessage(currentSessionId, 'bot', aiResponse);

//     res.json({
//       success: true,
//       sessionId: currentSessionId,
//       response: aiResponse,
//     });
//   } catch (error) {
//     console.error('Chat Error:', error);
//     console.error('Error details:', error.message);
//     console.error('Stack trace:', error.stack);
//     res.status(500).json({
//       success: false,
//       message: 'Failed to process message',
//       error: process.env.NODE_ENV === 'development' ? error.message : undefined,
//     });
//   }
// };








// import {
//   createSession,
//   getSession,
//   saveMessage,
//   getConversationHistory,
// } from '../services/session.service.js';

// import { getAIResponse } from '../services/gemini.service.js';

// export const handleChat = async (req, res) => {
//   try {
//     const { sessionId, message, context } = req.body;

//     if (!message || !message.trim()) {
//       return res.status(400).json({
//         success: false,
//         message: 'Message is required',
//       });
//     }

//     let currentSessionId = sessionId;

//     // Create or validate session
//     if (!currentSessionId) {
//       const newSession = await createSession(context || {});
//       currentSessionId = newSession.sessionId;
//     } else {
//       const existingSession = await getSession(currentSessionId);
//       if (!existingSession) {
//         return res.status(404).json({
//           success: false,
//           message: 'Session not found',
//         });
//       }
//     }

//     // Fetch history BEFORE saving message
//     const history = await getConversationHistory(currentSessionId);

//     // Save user message
//     await saveMessage(currentSessionId, 'user', message);

//     // Get AI response
//     const aiResponse = await getAIResponse(message, history);

//     // Save bot message
//     await saveMessage(currentSessionId, 'bot', aiResponse);

//     res.json({
//       success: true,
//       sessionId: currentSessionId,
//       response: aiResponse,
//     });
//   } catch (error) {
//     console.error('Chat Error:', error);
//     res.status(500).json({
//       success: false,
//       message: 'Failed to process message',
//     });
//   }
// };
















import {
  createSession,
  getSession,
  saveMessage,
  getConversationHistory,
} from '../services/session.service.js';

import { getAIResponse } from '../services/gemini.service.js';
import {
  createAppointment,
  isValidPhone,
  isValidDate,
} from '../services/appointment.service.js';

/**
 * Very lightweight, best-effort extraction.
 * This is NOT guaranteed NLP — just structured hints.
 */
const extractAppointmentData = (message) => {
  const patterns = {
    ownerName: /owner\s*name\s*:\s*([A-Za-z\s]+)/i,
    petName: /pet\s*name\s*:\s*([A-Za-z\s]+)/i,
    phone: /phone\s*(number)?\s*:\s*([\d\s\-\+\(\)]{10,})/i,
    dateTime: /(date|time|preferred)\s*:\s*([A-Za-z0-9:\s]+)/i,
  };

  const data = {};

  for (const [key, regex] of Object.entries(patterns)) {
    const match = message.match(regex);
    if (match) {
      data[key] = match[match.length - 1].trim();
    }
  }

  return data;
};

const hasAllAppointmentDetails = (data) =>
  data.ownerName && data.petName && data.phone && data.dateTime;

const normalizeDate = (input) => {
  const date = new Date(input);
  return isNaN(date) ? null : date;
};

export const handleChat = async (req, res) => {
  try {
    const { sessionId, message, context } = req.body;

    if (!message || !message.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Message is required',
      });
    }

    let currentSessionId = sessionId;

    // Create or validate session
    if (!currentSessionId) {
      const newSession = await createSession(context || {});
      currentSessionId = newSession.sessionId;
    } else {
      const existingSession = await getSession(currentSessionId);
      if (!existingSession) {
        return res.status(404).json({
          success: false,
          message: 'Session not found',
        });
      }
    }

    // Get history BEFORE saving current message
    const history = await getConversationHistory(currentSessionId);

    // Save user message
    await saveMessage(currentSessionId, 'user', message);

    /**
     * 🔍 BEST-EFFORT appointment detection
     * Never blocks chat, never guarantees success.
     */
    const appointmentData = extractAppointmentData(message);

    if (hasAllAppointmentDetails(appointmentData)) {
      console.log('📋 Parsed appointment data:', appointmentData);

      try {
        const parsedDate = normalizeDate(appointmentData.dateTime);

        if (isValidPhone(appointmentData.phone) && parsedDate) {
          await createAppointment({
            sessionId: currentSessionId,
            ownerName: appointmentData.ownerName,
            petName: appointmentData.petName,
            phone: appointmentData.phone,
            dateTime: parsedDate,
          });

          console.log('✅ Appointment saved from chat');
        } else {
          console.warn('⚠️ Appointment data invalid, skipping save');
        }
      } catch (err) {
        console.error('❌ Appointment save failed:', err.message);
        // Intentionally swallow error to keep chat working
      }
    }

    // AI response
    const aiResponse = await getAIResponse(message, history);

    // Save bot message
    await saveMessage(currentSessionId, 'bot', aiResponse);

    return res.json({
      success: true,
      sessionId: currentSessionId,
      response: aiResponse,
    });
  } catch (error) {
    console.error('Chat Error:', error);

    return res.status(500).json({
      success: false,
      message: 'Failed to process message',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
};
