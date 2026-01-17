
# Veterinary Chatbot SDK

A website-integrable chatbot SDK built with the MERN stack that provides AI-powered veterinary assistance and appointment booking capabilities.

## Overview

This chatbot can be embedded into any website using a simple script tag. It uses Google Gemini API for intelligent responses, answers veterinary-related questions, and facilitates appointment booking through a conversational interface.

## Tech Stack

- **Frontend**: React + Vite
- **Backend**: Node.js + Express
- **Database**: MongoDB
- **AI**: Google Gemini API
- **HTTP Client**: Axios

## Features

- Embeddable chatbot widget for any website
- AI-powered responses for veterinary questions (pet care, vaccinations, diet, illnesses, preventive care)
- Conversational appointment booking flow
- Session-based conversation storage
- Optional context configuration for personalized experience
- Responsive design with mobile support

## Prerequisites

- Node.js (v16 or higher)
- MongoDB (local or MongoDB Atlas)
- Google Gemini API key

## Project Structure

```
vet-chatbot/
├── backend/
│   ├── src/
│   │   ├── config/        # Database configuration
│   │   ├── models/        # MongoDB schemas
│   │   ├── services/      # Business logic
│   │   ├── controllers/   # Route handlers
│   │   ├── routes/        # API routes
│   │   └── server.js      # Entry point
│   ├── .env.example
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/    # React components
│   │   ├── services/      # API client
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── .env.example
│   └── package.json
└── README.md
```

## Installation

### 1. Clone the Repository

```bash
git clone https://github.com/Saha-7/Vet-Chatbot
cd vet-chatbot
```

### 2. Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file in the `backend` directory:

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/vet-chatbot
GEMINI_API_KEY=your_gemini_api_key_here
NODE_ENV=development
FRONTEND_URL=http://localhost:5173
```

**Environment Variables:**
- `PORT`: Server port (default: 5000)
- `MONGODB_URI`: MongoDB connection string
- `GEMINI_API_KEY`: Your Google Gemini API key ([Get it here](https://ai.google.dev/))
- `NODE_ENV`: Environment mode (development/production)
- `FRONTEND_URL`: Frontend URL for CORS

### 3. Frontend Setup

```bash
cd frontend
npm install
```

Create a `.env` file in the `frontend` directory:

```env
VITE_API_URL=http://localhost:5000/api
```

**Environment Variables:**
- `VITE_API_URL`: Backend API base URL

### 4. Start MongoDB

Ensure MongoDB is running locally or use MongoDB Atlas.

For local MongoDB:
```bash
mongod
```

## Running the Application

### Development Mode

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```

The backend will run on `http://localhost:5000` and the frontend on `http://localhost:5173`.

### Production Build

**Backend:**
```bash
cd backend
npm start
```

**Frontend:**
```bash
cd frontend
npm run build
npm run preview
```

## Usage

### Basic Integration

Add this script tag to any HTML page:

```html
<script src="https://your-domain.com/chatbot.js"></script>
```

### Context-Based Integration

Pass optional contextual information:

```html
<script>
  window.VetChatbotConfig = {
    userId: "user_123",
    userName: "John Doe",
    petName: "Buddy",
    source: "marketing-website"
  };
</script>
<script src="https://your-domain.com/chatbot.js"></script>
```

## API Endpoints

### Chat
- **POST** `/api/chat`
  - Body: `{ message, sessionId?, context? }`
  - Response: `{ success, sessionId, response }`

### Appointments
- **POST** `/api/appointments`
  - Body: `{ sessionId, ownerName, petName, phone, dateTime }`
  - Response: `{ success, message, appointment }`

### Health Check
- **GET** `/health`
  - Response: `{ status, message, timestamp }`

## Architecture Decisions

### Separation of Concerns
- Controllers handle HTTP logic
- Services contain business logic
- Models define data schemas
- Clear separation between frontend and backend

### Session Management
- UUID-based session IDs
- Sessions auto-expire after 30 days
- Context stored with each session

### Conversation Storage
- All messages persisted in MongoDB
- Conversation history maintained per session
- Timestamps for all interactions

### Appointment Booking
- Best-effort extraction from chat messages
- Dedicated API endpoint for direct booking
- Basic validation for phone and date

### Error Handling
- Graceful fallbacks for API failures
- User-friendly error messages
- Detailed logging for debugging

## Assumptions

1. Basic phone validation (10+ digits) is sufficient
2. Date validation ensures future appointments only
3. AI responses limited to veterinary topics via system prompt
4. Sessions expire after 30 days of inactivity
5. No authentication required for MVP
6. Single-user chatbot instance per browser session

## Known Limitations

- No user authentication
- Basic input validation only
- No appointment conflict checking
- Limited to text-based interactions
- Single language support (English)

## Future Improvements

- User authentication and profiles
- Multi-language support
- Voice input/output
- Image upload for pet photos
- Admin dashboard for managing appointments
- Email/SMS notifications
- Calendar integration
- Advanced NLP for better intent detection
- Rate limiting and security hardening
- Comprehensive test coverage
- Docker containerization
- CI/CD pipeline

## Troubleshooting

### MongoDB Connection Failed
- Ensure MongoDB is running
- Check `MONGODB_URI` in `.env`
- Verify network connectivity

### Gemini API Errors
- Verify `GEMINI_API_KEY` is correct
- Check API quota limits
- Ensure internet connectivity

### CORS Errors
- Verify `FRONTEND_URL` matches your frontend URL
- Check backend CORS configuration

### Port Already in Use
- Change `PORT` in backend `.env`
- Kill process using the port: `kill -9 $(lsof -ti:5000)`

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## License

ISC

## Author

Pritam Saha

---

