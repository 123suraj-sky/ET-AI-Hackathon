import { useState } from "react";
import "./AIChat.css";
import { askCopilot } from "../../services/llmApi";
import { FaPaperPlane, FaRobot, FaUser } from "react-icons/fa";

function AIChat() {
  const [question, setQuestion] = useState("");
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState([
    {
      sender: "AI",
      text: "Hello! 👋 I'm AirVision AI Copilot. Ask me anything about Delhi's air quality, pollution mitigation strategies, ARIMA forecasting, or citizen health advisories."
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
      <div className="chat-messages">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={msg.sender === "You" ? "user-message" : "ai-message"}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "4px", fontSize: "0.8rem", opacity: 0.8 }}>
              {msg.sender === "You" ? <FaUser /> : <FaRobot style={{ color: "#a855f7" }} />}
              <strong>{msg.sender}</strong>
            </div>
            <div>{msg.text}</div>
          </div>
        ))}
        {loading && (
          <div className="ai-message">
            <div style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "4px", fontSize: "0.8rem", opacity: 0.8 }}>
              <FaRobot style={{ color: "#a855f7" }} />
              <strong>AirVision AI</strong>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "8px", color: "var(--text-muted)" }}>
              <span className="spinner" style={{ width: "16px", height: "16px", borderWidth: "2px" }} />
              Typing response...
            </div>
          </div>
        )}
      </div>

      <div className="chat-input">
        <input
          type="text"
          placeholder="Ask something about AQI, forecasts, or interventions..."
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
          disabled={loading}
        />
        <button onClick={handleSend} disabled={loading}>
          <FaPaperPlane />
          {loading ? "Sending" : "Send"}
        </button>
      </div>
    </div>
  );
}

export default AIChat;