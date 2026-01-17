import Appointment from '../models/Appointment.js';

export const createAppointment = async (appointmentData) => {
  const { sessionId, ownerName, petName, phone, dateTime } = appointmentData;

  // Basic validation
  if (!ownerName || !petName || !phone || !dateTime) {
    throw new Error('Missing required appointment fields');
  }

  const appointment = await Appointment.create({
    sessionId,
    ownerName,
    petName,
    phone,
    dateTime: new Date(dateTime),
  });

  return appointment;
};

export const getAppointmentsBySession = async (sessionId) => {
  const appointments = await Appointment.find({ sessionId })
    .sort({ createdAt: -1 });
  
  return appointments;
};

// Validate phone number (basic)
export const isValidPhone = (phone) => {
  const phoneRegex = /^[\d\s\-\+\(\)]{10,}$/;
  return phoneRegex.test(phone);
};

// Validate date (must be in future)
export const isValidDate = (dateString) => {
  const date = new Date(dateString);
  return date > new Date() && !isNaN(date);
};