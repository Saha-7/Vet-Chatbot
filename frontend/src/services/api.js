import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export const sendMessage = async (message, sessionId = null, context = null) => {
  try {
    const response = await axios.post(`${API_URL}/chat`, {
      message,
      sessionId,
      context,
    });
    return response.data;
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
};

export const bookAppointment = async (appointmentData) => {
  try {
    const response = await axios.post(`${API_URL}/appointments`, appointmentData);
    return response.data;
  } catch (error) {
    console.error('Appointment Error:', error);
    throw error;
  }
};