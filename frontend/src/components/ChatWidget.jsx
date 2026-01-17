import { useState } from 'react';
import ChatWindow from './ChatWindow';

const ChatWidget = ({ config = {} }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="vet-chatbot-widget">
      {isOpen && (
        <ChatWindow 
          onClose={() => setIsOpen(false)} 
          config={config}
        />
      )}
      
      {!isOpen && (
        <button 
          className="chat-toggle-btn"
          onClick={() => setIsOpen(true)}
          aria-label="Open chat"
        >
          💬
        </button>
      )}
    </div>
  );
};

export default ChatWidget;