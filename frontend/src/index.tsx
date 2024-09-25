import React, { useState } from 'react';
import ReactDOM from 'react-dom';

type Message = {
  text: string;
  from: 'user' | 'server';
};

const ChatApp: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState<string>('');

  const sendMessage = async () => {
    if (inputText.trim() === '') return;

    const userMessage: Message = { text: inputText, from: 'user' };
    setMessages((prevMessages) => [...prevMessages, userMessage]);

    try {
      // Ensure the correct API URL is used here
      const response = await fetch('http://localhost:8000/api', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: inputText }),
      });

      const data = await response.json();

      // Check if there is a response from the server
      if (data.response) {
        const serverMessage: Message = { text: data.response, from: 'server' };
        setMessages((prevMessages) => [...prevMessages, serverMessage]);
      } else if (data.error) {
        const errorMessage: Message = {
          text: `Error: ${data.error}`,
          from: 'server',
        };
        setMessages((prevMessages) => [...prevMessages, errorMessage]);
      }
    } catch (error) {
      const errorMessage: Message = {
        text: 'Error: Could not reach server.',
        from: 'server',
      };
      setMessages((prevMessages) => [...prevMessages, errorMessage]);
    } finally {
      setInputText('');  // Clear input field after sending message
    }
  };

  return (
    <div className="chat-container">
      <div className="messages">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`message ${
              message.from === 'user' ? 'user-message' : 'response-message'
            }`}
          >
            {message.text}
          </div>
        ))}
      </div>
      <div className="send-container">
        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="Type your message..."
        />
        <button onClick={sendMessage}>Send</button>
      </div>
    </div>
  );
};

ReactDOM.render(<ChatApp />, document.getElementById('root'));
