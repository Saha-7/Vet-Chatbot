import { createAppointment } from '../services/appointment.service.js';

export const bookAppointment = async (req, res) => {
  try {
    const { sessionId, ownerName, petName, phone, dateTime } = req.body;

    // Basic presence check only
    if (!sessionId || !ownerName || !petName || !phone || !dateTime) {
      return res.status(400).json({
        success: false,
        message: 'All fields are required',
      });
    }

    const appointment = await createAppointment({
      sessionId,
      ownerName,
      petName,
      phone,
      dateTime,
    });

    res.status(201).json({
      success: true,
      message: 'Appointment booked successfully',
      appointment: {
        id: appointment._id,
        ownerName: appointment.ownerName,
        petName: appointment.petName,
        phone: appointment.phone,
        dateTime: appointment.dateTime,
      },
    });
  } catch (error) {
    console.error('Appointment Error:', error);

    // Handle validation errors gracefully
    if (error.message.includes('Invalid') || error.message.includes('Missing')) {
      return res.status(400).json({
        success: false,
        message: error.message,
      });
    }

    res.status(500).json({
      success: false,
      message: 'Failed to book appointment',
    });
  }
};
