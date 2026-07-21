import { useState } from "react";
import "./AIChat.css";
import { askCopilot } from "../../services/llmApi";

function AIChat() {
  const [question, setQuestion] = useState("");
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState([
    {
      sender: "AI",
      text: "Hello! 👋 I'm AirVision AI. Ask me anything about Delhi's air quality, pollution mitigation strategies, or ARIMA forecasting details."
    }
  ]);

  const handleSend = () => {
    if (question.trim() === "" || loading) return;

    const userMessage = question;
    setQuestion("");

    // Add user message
    setMessages((prev) => [
      ...prev,
      {
        sender: "You",
        text: userMessage
      }
    ]);

    setLoading(true);

    // Call real LLM service copilot endpoint
    askCopilot({ message: userMessage, history: [] })
      .then((res) => {
        setMessages((prev) => [
          ...prev,
          {
            sender: "AI",
            text: res.data.reply
          }
        ]);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setMessages((prev) => [
          ...prev,
          {
            sender: "AI",
            text: "Failed to connect to AI Copilot backend. Ensure the Python AI/ML service and Gemini API key are active."
          }
        ]);
        setLoading(false);
      });
  };

  return (
    <div className="chat-container">
      <div className="chat-messages" style={{ minHeight: "300px", maxHeight: "450px", overflowY: "auto" }}>
        {messages.map((msg, index) => (
          <div
            key={index}
            className={msg.sender === "You" ? "user-message" : "ai-message"}
          >
            <strong>{msg.sender}:</strong> {msg.text}
          </div>
        ))}
        {loading && <div className="ai-message"><strong>AI:</strong> Typing recommendations...</div>}
      </div>

      <div className="chat-input">
        <input
          type="text"
          placeholder="Ask something about AQI or interventions..."
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
          disabled={loading}
        />
        <button onClick={handleSend} disabled={loading}>
          {loading ? "Sending" : "Send"}
        </button>
      </div>
    </div>
  );
}

export default AIChat;