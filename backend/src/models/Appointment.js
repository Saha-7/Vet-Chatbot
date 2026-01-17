import mongoose from 'mongoose';

const appointmentSchema = new mongoose.Schema({
  sessionId: {
    type: String,
    required: true,
    index: true,
  },
  ownerName: {
    type: String,
    required: true,
    trim: true,
  },
  petName: {
    type: String,
    required: true,
    trim: true,
  },
  phone: {
    type: String,
    required: true,
    trim: true,
  },
  dateTime: {
    type: Date,
    required: true,
    index: true,
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'cancelled', 'completed'],
    default: 'pending',
  },
  createdAt: {
    type: Date,
    default: Date.now,
    index: true,
  },
});

// Compound index for querying appointments by date
appointmentSchema.index({ dateTime: 1, status: 1 });

const Appointment = mongoose.model('Appointment', appointmentSchema);

export default Appointment;