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
      const response = await fetch('/api', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: inputText }),
      });

      const data = await response.json();
      const serverMessage: Message = { text: data.response, from: 'server' };
      setMessages((prevMessages) => [...prevMessages, serverMessage]);
    } catch (error) {
      const errorMessage: Message = {
        text: 'Error: Could not reach server.',
        from: 'server',
      };
      setMessages((prevMessages) => [...prevMessages, errorMessage]);
    } finally {
      setInputText('');
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
  ); // <-- Added semicolon here
};

ReactDOM.render(<ChatApp />, document.getElementById('root')); // Semicolon here is correct
