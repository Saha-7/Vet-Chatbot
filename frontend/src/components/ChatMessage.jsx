const ChatMessage = ({ sender, text, timestamp }) => {
  const isBot = sender === 'bot';

  return (
    <div className={`message ${isBot ? 'bot' : 'user'}`}>
      <div className="message-content">
        <p>{text}</p>
        <span className="timestamp">
          {new Date(timestamp).toLocaleTimeString([], { 
            hour: '2-digit', 
            minute: '2-digit' 
          })}
        </span>
      </div>
    </div>
  );
};

export default ChatMessage;