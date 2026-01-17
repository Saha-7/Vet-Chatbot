import express from 'express';
import { handleChat } from '../controllers/chat.controller.js';
import { bookAppointment } from '../controllers/appointment.controller.js';

const router = express.Router();

// Chat endpoint
router.post('/chat', handleChat);

// Appointment endpoint
router.post('/appointments', bookAppointment);

export default router;