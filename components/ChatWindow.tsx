// components/ChatWindow.tsx
import { useState, useEffect } from 'react';
import { Button } from './ui/button';

interface ChatWindowProps {
  code: string;
  problem: any;
  fetchAIHint: () => void;
  hints: string | null;
}

const ChatWindow = ({ fetchAIHint, hints }: ChatWindowProps) => {
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (hints) {
      setMessage(hints);
    }
  }, [hints]);

  const handleFetchHint = () => {
    fetchAIHint();
  };

  return (
    <div className=' mr-14' style={{ marginTop: '20px', padding: '10px', border: '1px solid #ddd', borderRadius: '4px'  }}>
      <h3>Chat Window</h3>
      <p>Ask the AI for hints or suggestions!</p>

      {/* Show hint */}
      {message && (
        <div style={{ marginBottom: '10px', backgroundColor: '#f0f0f0', padding: '10px', borderRadius: '4px' }}>
          <strong>AI Hint:</strong> {message}
        </div>
      )}

      {/* Button to fetch AI hints */}
      <Button onClick={handleFetchHint} style={{ marginTop: '10px' }}>
        Get Hint from AI
      </Button>
    </div>
  );
};

export default ChatWindow;
