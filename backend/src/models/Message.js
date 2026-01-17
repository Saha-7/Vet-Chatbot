import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema({
  sessionId: {
    type: String,
    required: true,
    index: true,
  },
  sender: {
    type: String,
    enum: ['user', 'bot'],
    required: true,
  },
  text: {
    type: String,
    required: true,
  },
  timestamp: {
    type: Date,
    default: Date.now,
    index: true,
  },
  // Optional: for tracking appointment booking state
  metadata: {
    type: mongoose.Schema.Types.Mixed,
    default: {},
  },
});

// Compound index for efficient querying
messageSchema.index({ sessionId: 1, timestamp: 1 });

const Message = mongoose.model('Message', messageSchema);

export default Message;