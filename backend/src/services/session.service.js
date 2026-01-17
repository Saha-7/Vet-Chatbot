import Appointment from '../models/Appointment.js';

/**
 * Create a new veterinary appointment
 */
export const createAppointment = async (appointmentData) => {
  const { sessionId, ownerName, petName, phone, dateTime } = appointmentData;

  // Basic required field validation
  if (!ownerName || !petName || !phone || !dateTime) {
    throw new Error('Missing required appointment fields');
  }

  // Validate phone number
  if (!isValidPhone(phone)) {
    throw new Error('Invalid phone number');
  }

  // Validate appointment date
  if (!isValidDate(dateTime)) {
    throw new Error('Invalid appointment date');
  }

  const appointment = await Appointment.create({
    sessionId,
    ownerName,
    petName,
    phone: phone.replace(/\s+/g, ''), // normalize phone
    dateTime: new Date(dateTime),
  });

  return appointment;
};

/**
 * Fetch appointments linked to a chat session
 */
export const getAppointmentsBySession = async (sessionId) => {
  const appointments = await Appointment.find({ sessionId })
    .sort({ createdAt: -1 })
    .lean();

  return appointments;
};

/**
 * Validate phone number (basic, country-agnostic)
 */
export const isValidPhone = (phone) => {
  const phoneRegex = /^[\d\s\-\+\(\)]{10,}$/;
  return phoneRegex.test(phone);
};

/**
 * Validate appointment date (must be a valid future date)
 */
export const isValidDate = (dateString) => {
  const date = new Date(dateString);
  return !isNaN(date) && date > new Date();
};
