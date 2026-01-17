import mongoose from 'mongoose';

const sessionSchema = new mongoose.Schema({
  sessionId: {
    type: String,
    required: true,
    unique: true,
    index: true,
  },
  context: {
    userId: String,
    userName: String,
    petName: String,
    source: String,
  },
  createdAt: {
    type: Date,
    default: Date.now,
    index: true,
  },
});

// Auto-delete sessions older than 30 days (optional cleanup)
sessionSchema.index({ createdAt: 1 }, { expireAfterSeconds: 30 * 24 * 60 * 60 });

const Session = mongoose.model('Session', sessionSchema);

export default Session;