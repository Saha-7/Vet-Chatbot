import { randomUUID } from 'crypto';
import Session from '../models/Session.js';
import Message from '../models/Message.js';

export const createSession = async (context = {}) => {
  const sessionId = randomUUID();
  return await Session.create({ sessionId, context });
};

export const getSession = async (sessionId) => {
  return await Session.findOne({ sessionId });
};

export const saveMessage = async (sessionId, sender, text) => {
  return await Message.create({ sessionId, sender, text });
};

export const getConversationHistory = async (sessionId, limit = 10) => {
  const messages = await Message.find({ sessionId })
    .sort({ timestamp: -1 })
    .limit(limit)
    .lean();

  return messages.reverse().map(msg => ({
    role: msg.sender === 'user' ? 'user' : 'model',
    parts: [{ text: msg.text }],
  }));
};
