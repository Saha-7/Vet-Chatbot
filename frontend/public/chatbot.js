// frontend/public/chatbot.js
(function() {
  'use strict';

  console.log('🚀 Vet Chatbot SDK Loading...');

  // Prevent multiple initializations
  if (window.VetChatbotSDK) {
    console.warn('Vet Chatbot SDK already loaded');
    return;
  }

  const API_URL = 'https://vet-chatbot-38qx.onrender.com/api'; // UPDATE THIS with your backend URL
  
  // Get configuration from window object
  const config = window.VetChatbotConfig || {};

  // Inject CSS styles immediately
  function injectStyles() {
    if (document.getElementById('vet-chatbot-styles')) {
      return;
    }

    const style = document.createElement('style');
    style.id = 'vet-chatbot-styles';
    style.textContent = `
      #vet-chatbot-root {
        margin: 0;
        padding: 0;
      }

      #vet-chatbot-root * {
        box-sizing: border-box;
      }

      .vet-chatbot-widget {
        position: fixed;
        bottom: 20px;
        right: 20px;
        z-index: 999999;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
      }

      .chat-toggle-btn {
        width: 60px;
        height: 60px;
        border-radius: 50%;
        background: #4f46e5;
        color: white;
        border: none;
        font-size: 28px;
        cursor: pointer;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        transition: transform 0.2s;
        display: flex;
        align-items: center;
        justify-content: center;
      }

      .chat-toggle-btn:hover {
        transform: scale(1.05);
        background: #4338ca;
      }

      .chat-window {
        width: 380px;
        height: 600px;
        background: white;
        border-radius: 12px;
        box-shadow: 0 8px 24px rgba(0, 0, 0, 0.2);
        display: flex;
        flex-direction: column;
        overflow: hidden;
        margin-bottom: 10px;
      }

      .chat-header {
        background: #4f46e5;
        color: white;
        padding: 16px 20px;
        display: flex;
        justify-content: space-between;
        align-items: center;
      }

      .chat-header h3 {
        font-size: 18px;
        font-weight: 600;
        margin: 0;
      }

      .close-btn {
        background: transparent;
        border: none;
        color: white;
        font-size: 24px;
        cursor: pointer;
        padding: 0;
        width: 30px;
        height: 30px;
        line-height: 1;
      }

      .close-btn:hover {
        opacity: 0.8;
      }

      .chat-messages {
        flex: 1;
        overflow-y: auto;
        padding: 16px;
        background: #f9fafb;
      }

      .message {
        margin-bottom: 16px;
        display: flex;
      }

      .message.user {
        justify-content: flex-end;
      }

      .message.bot {
        justify-content: flex-start;
      }

      .message-content {
        max-width: 75%;
        padding: 10px 14px;
        border-radius: 12px;
      }

      .message.user .message-content {
        background: #4f46e5;
        color: white;
        border-bottom-right-radius: 4px;
      }

      .message.bot .message-content {
        background: white;
        color: #1f2937;
        border-bottom-left-radius: 4px;
        box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
      }

      .message-content p {
        margin: 0;
        font-size: 14px;
        line-height: 1.5;
        word-wrap: break-word;
      }

      .timestamp {
        font-size: 11px;
        opacity: 0.6;
        display: block;
        margin-top: 4px;
      }

      .typing-indicator {
        display: flex;
        gap: 4px;
        padding: 8px 0;
      }

      .typing-indicator span {
        width: 8px;
        height: 8px;
        background: #9ca3af;
        border-radius: 50%;
        animation: typing 1.4s infinite;
      }

      .typing-indicator span:nth-child(2) {
        animation-delay: 0.2s;
      }

      .typing-indicator span:nth-child(3) {
        animation-delay: 0.4s;
      }

      @keyframes typing {
        0%, 60%, 100% { transform: translateY(0); }
        30% { transform: translateY(-10px); }
      }

      .chat-input {
        padding: 16px;
        background: white;
        border-top: 1px solid #e5e7eb;
        display: flex;
        gap: 8px;
      }

      .chat-input input {
        flex: 1;
        padding: 10px 14px;
        border: 1px solid #d1d5db;
        border-radius: 8px;
        font-size: 14px;
        outline: none;
        font-family: inherit;
      }

      .chat-input input:focus {
        border-color: #4f46e5;
      }

      .chat-input button {
        padding: 10px 20px;
        background: #4f46e5;
        color: white;
        border: none;
        border-radius: 8px;
        font-size: 14px;
        font-weight: 500;
        cursor: pointer;
      }

      .chat-input button:hover:not(:disabled) {
        background: #4338ca;
      }

      .chat-input button:disabled {
        background: #9ca3af;
        cursor: not-allowed;
        opacity: 0.6;
      }

      @media (max-width: 480px) {
        .chat-window {
          width: calc(100vw - 32px);
          height: calc(100vh - 100px);
        }
      }
    `;
    document.head.appendChild(style);
    console.log('✅ Styles injected');
  }

  // Create chatbot
  function initChatbot() {
    console.log('🔧 Initializing chatbot...');

    // Check if already initialized
    if (document.getElementById('vet-chatbot-root')) {
      console.log('⚠️ Chatbot already initialized');
      return;
    }

    // Inject styles first
    injectStyles();

    // Create root container
    const container = document.createElement('div');
    container.id = 'vet-chatbot-root';
    document.body.appendChild(container);
    console.log('✅ Container created');

    // State
    let isOpen = false;
    let messages = [{
      sender: 'bot',
      text: "Hello! I'm Elfy, your veterinary assistant. I can help answer pet care questions or book appointments. How can I help you today?",
      timestamp: new Date()
    }];
    let sessionId = null;
    let isLoading = false;

    // Render functions
    function render() {
      container.innerHTML = `
        <div class="vet-chatbot-widget">
          ${isOpen ? renderChatWindow() : renderToggleButton()}
        </div>
      `;
      attachEventListeners();
      if (isOpen) {
        setTimeout(scrollToBottom, 100);
      }
    }

    function renderToggleButton() {
      return `
        <button class="chat-toggle-btn" id="chat-toggle" aria-label="Open chat">
          💬
        </button>
      `;
    }

    function renderChatWindow() {
      return `
        <div class="chat-window">
          <div class="chat-header">
            <h3>Veterinary Assistant</h3>
            <button class="close-btn" id="chat-close" aria-label="Close chat">✕</button>
          </div>
          <div class="chat-messages" id="chat-messages">
            ${messages.map(msg => renderMessage(msg)).join('')}
            ${isLoading ? renderTypingIndicator() : ''}
          </div>
          <div class="chat-input">
            <input 
              type="text" 
              id="chat-input" 
              placeholder="Type your message..."
              ${isLoading ? 'disabled' : ''}
            />
            <button id="chat-send" ${isLoading ? 'disabled' : ''}>Send</button>
          </div>
        </div>
      `;
    }

    function renderMessage(msg) {
      const time = new Date(msg.timestamp).toLocaleTimeString([], { 
        hour: '2-digit', 
        minute: '2-digit' 
      });
      return `
        <div class="message ${msg.sender}">
          <div class="message-content">
            <p>${escapeHtml(msg.text)}</p>
            <span class="timestamp">${time}</span>
          </div>
        </div>
      `;
    }

    function renderTypingIndicator() {
      return `
        <div class="message bot">
          <div class="message-content">
            <div class="typing-indicator">
              <span></span>
              <span></span>
              <span></span>
            </div>
          </div>
        </div>
      `;
    }

    function attachEventListeners() {
      const toggleBtn = document.getElementById('chat-toggle');
      const closeBtn = document.getElementById('chat-close');
      const sendBtn = document.getElementById('chat-send');
      const input = document.getElementById('chat-input');

      if (toggleBtn) {
        toggleBtn.onclick = () => {
          console.log('💬 Opening chat');
          isOpen = true;
          render();
        };
      }

      if (closeBtn) {
        closeBtn.onclick = () => {
          console.log('✕ Closing chat');
          isOpen = false;
          render();
        };
      }

      if (sendBtn && input) {
        sendBtn.onclick = () => {
          const text = input.value;
          if (text.trim() && !isLoading) {
            sendMessage(text);
          }
        };
        
        input.onkeypress = (e) => {
          if (e.key === 'Enter' && !isLoading) {
            const text = input.value;
            if (text.trim()) {
              sendMessage(text);
            }
          }
        };

        // Auto-focus input
        setTimeout(() => input.focus(), 100);
      }
    }

    async function sendMessage(text) {
      console.log('📤 Sending:', text);

      // Add user message
      messages.push({
        sender: 'user',
        text: text,
        timestamp: new Date()
      });

      isLoading = true;
      render();

      try {
        console.log('🌐 API call to:', API_URL + '/chat');
        
        const response = await fetch(`${API_URL}/chat`, {
          method: 'POST',
          headers: { 
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            message: text,
            sessionId: sessionId,
            context: config
          })
        });

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}`);
        }

        const data = await response.json();
        console.log('📥 Response:', data);
        
        if (!sessionId && data.sessionId) {
          sessionId = data.sessionId;
          console.log('🆔 Session ID:', sessionId);
        }

        messages.push({
          sender: 'bot',
          text: data.response || 'Sorry, I could not process that.',
          timestamp: new Date()
        });

      } catch (error) {
        console.error('❌ Chat error:', error);
        messages.push({
          sender: 'bot',
          text: 'Sorry, something went wrong. Please try again.',
          timestamp: new Date()
        });
      }

      isLoading = false;
      render();
    }

    function scrollToBottom() {
      const messagesDiv = document.getElementById('chat-messages');
      if (messagesDiv) {
        messagesDiv.scrollTop = messagesDiv.scrollHeight;
      }
    }

    function escapeHtml(text) {
      const div = document.createElement('div');
      div.textContent = text;
      return div.innerHTML;
    }

    // Initial render
    render();
    console.log('✅ Chatbot initialized!');
  }

  // Initialize on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initChatbot);
  } else {
    initChatbot();
  }

  // Expose SDK API
  window.VetChatbotSDK = {
    version: '1.0.0',
    init: initChatbot
  };

  console.log('✅ Vet Chatbot SDK Loaded');
})();