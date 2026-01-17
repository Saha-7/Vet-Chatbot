import ChatWidget from './components/ChatWidget';
import './App.css';

function App() {
  // Get config from window object (for SDK mode)
  const config = window.VetChatbotConfig || {};

  return <ChatWidget config={config} />;
}

export default App;