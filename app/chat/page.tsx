'use client';

import { useState } from 'react';
import axios from 'axios';

export default function ChatPage() {
  const [message, setMessage] = useState('');
  const [response, setResponse] = useState('');
  const [showHint, setShowHint] = useState(false);

  const handleToggleHint = () => setShowHint(!showHint);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const result = await axios.post('/api/gemini', { prompt: message });
      setResponse(result.data.hint);
    } catch (error) {
      console.error('Error fetching hint:', error);
      setResponse('Failed to fetch hint');
    }
  };

  return (
    <div>
      <h2>AI Chat</h2>
      <form onSubmit={handleSubmit}>
        <textarea
          value={message}
          onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setMessage(e.target.value)}
          placeholder="Ask for a hint or help..."
        />
        <button type="submit">Submit</button>
      </form>
      <button onClick={handleToggleHint}>
        {showHint ? 'Hide Hint' : 'Show Hint'}
      </button>
      {showHint && <div>{response}</div>}
    </div>
  );
}
