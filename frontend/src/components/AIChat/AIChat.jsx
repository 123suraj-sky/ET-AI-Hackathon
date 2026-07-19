import { useState } from "react";
import "./AIChat.css";

function AIChat() {
  const [question, setQuestion] = useState("");

  const [messages, setMessages] = useState([
    {
      sender: "AI",
      text: "Hello! 👋 I'm AirVision AI. Ask me anything about air quality."
    }
  ]);

  const handleSend = () => {
    if (question.trim() === "") return;

    // Add user message
    setMessages((prev) => [
      ...prev,
      {
        sender: "You",
        text: question
      }
    ]);

    // Dummy AI response (for now)
    setMessages((prev) => [
      ...prev,
      {
        sender: "You",
        text: question
      },
      {
        sender: "AI",
        text: "This is a dummy Gemini response. Later this will come from the backend."
      }
    ]);

    setQuestion("");
  };

  return (
    <div className="chat-container">

      <div className="chat-messages">

        {messages.map((msg, index) => (
          <div
            key={index}
            className={msg.sender === "You" ? "user-message" : "ai-message"}
          >
            <strong>{msg.sender}:</strong> {msg.text}
          </div>
        ))}

      </div>

      <div className="chat-input">

        <input
          type="text"
          placeholder="Ask something..."
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
        />

        <button onClick={handleSend}>
          Send
        </button>

      </div>

    </div>
  );
}

export default AIChat;