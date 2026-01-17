import {
  createSession,
  getSession,
  saveMessage,
  getConversationHistory,
} from '../services/session.service.js';

import { getAIResponse } from '../services/gemini.service.js';

export const handleChat = async (req, res) => {
  try {
    const { sessionId, message, context } = req.body;

    // Validate input
    if (!message || !message.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Message is required',
      });
    }

    let currentSessionId = sessionId;

    // Create new session if none exists
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

    // Get conversation history BEFORE saving current message
    const history = await getConversationHistory(currentSessionId);

    // Save user message
    await saveMessage(currentSessionId, 'user', message);

    // Get AI response
    const aiResponse = await getAIResponse(message, history);

    // Save bot response
    await saveMessage(currentSessionId, 'bot', aiResponse);

    res.json({
      success: true,
      sessionId: currentSessionId,
      response: aiResponse,
    });
  } catch (error) {
    console.error('Chat Error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to process message',
    });
  }
};
