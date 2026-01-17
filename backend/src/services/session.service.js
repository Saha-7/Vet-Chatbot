import { randomUUID } from 'crypto';
import Session from '../models/Session.js';
import Message from '../models/Message.js';

export const createSession = async (context = {}) => {
  const sessionId = randomUUID();
  
  const session = await Session.create({
    sessionId,
    context,
  });

  return session;
};

export const getSession = async (sessionId) => {
  const session = await Session.findOne({ sessionId });
  return session;
};

export const saveMessage = async (sessionId, sender, text) => {
  const message = await Message.create({
    sessionId,
    sender,
    text,
  });

  return message;
};

export const getConversationHistory = async (sessionId, limit = 10) => {
  const messages = await Message.find({ sessionId })
    .sort({ timestamp: 1 })
    .limit(limit);

  // Format for Gemini API
  return messages.map(msg => ({
    role: msg.sender === 'user' ? 'user' : 'model',
    parts: [{ text: msg.text }],
  }));
};