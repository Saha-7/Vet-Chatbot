import { useState, useRef, useEffect } from 'react';
import ChatMessage from './ChatMessage';
import { sendMessage } from '../services/api';

const ChatWindow = ({ onClose, config }) => {
  const [messages, setMessages] = useState([
    {
      sender: 'bot',
      text: 'Hello! I\'m Elfy, your veterinary assistant. I can help answer pet care questions or book appointments. How can I help you today?',
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [sessionId, setSessionId] = useState(null);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage = {
      sender: 'user',
      text: input,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await sendMessage(input, sessionId, config);
      
      if (!sessionId) {
        setSessionId(response.sessionId);
      }

      const botMessage = {
        sender: 'bot',
        text: response.response,
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      const errorMessage = {
        sender: 'bot',
        text: 'Sorry, something went wrong. Please try again.',
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="chat-window">
      <div className="chat-header">
        <h3>Veterinary Assistant</h3>
        <button onClick={onClose} className="close-btn">✕</button>
      </div>

      <div className="chat-messages">
        {messages.map((msg, idx) => (
          <ChatMessage key={idx} {...msg} />
        ))}
        {isLoading && (
          <div className="message bot">
            <div className="message-content">
              <div className="typing-indicator">
                <span></span>
                <span></span>
                <span></span>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="chat-input">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Type your message..."
          disabled={isLoading}
        />
        <button onClick={handleSend} disabled={isLoading || !input.trim()}>
          Send
        </button>
      </div>
    </div>
  );
};

export default ChatWindow;