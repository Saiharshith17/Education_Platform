import React, { useState, useRef, useEffect } from "react";
import "./Chatbot.css";

const Chatbot = () => {
  const [input, setInput] = useState("");
  const [chatHistory, setChatHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const chatEndRef = useRef(null);

  // Scroll to bottom when chat updates
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatHistory, loading]);

  // Parse backend chat_history into [{role, text}]
  const parseHistory = (historyArr) => {
    return historyArr.map((line) => {
      if (line.startsWith("User: ")) return { role: "user", text: line.replace("User: ", "") };
      if (line.startsWith("AI: ")) return { role: "ai", text: line.replace("AI: ", "") };
      return { role: "system", text: line };
    });
  };

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;
    setLoading(true);

    // Add user message to chat
    const newHistory = [...chatHistory, { role: "user", text: input }];
    setChatHistory(newHistory);

    try {
      const res = await fetch("http://127.0.0.1:8000/chatbot", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: input }),
      });
      if (res.ok) {
        const data = await res.json();
        // Parse backend chat_history for display
        const parsed = parseHistory(data.chat_history);
        setChatHistory(parsed);
      } else {
        setChatHistory([
          ...newHistory,
          { role: "ai", text: "Sorry, I couldn't get a response from the server." },
        ]);
      }
    } catch (err) {
      setChatHistory([
        ...newHistory,
        { role: "ai", text: "Network error. Please try again." },
      ]);
    }
    setInput("");
    setLoading(false);
  };

  return (
    <div className="chatbot-container">
      <div className="chatbot-header">EduPlatform AI Chatbot</div>
      <div className="chatbot-history">
        {chatHistory.length === 0 && (
          <div className="chatbot-welcome">
            <span>👋</span> Ask me anything about tech, courses, or concepts!
          </div>
        )}
        {chatHistory.map((msg, idx) => (
          <div
            key={idx}
            className={`chatbot-bubble ${msg.role === "user" ? "user" : "ai"}`}
          >
            {msg.text}
          </div>
        ))}
        {loading && (
          <div className="chatbot-bubble ai">
            <span className="chatbot-typing">
              <span></span><span></span><span></span>
            </span>
          </div>
        )}
        <div ref={chatEndRef} />
      </div>
      <form className="chatbot-input-row" onSubmit={handleSend}>
        <input
          className="chatbot-input"
          type="text"
          placeholder="Type your question..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          disabled={loading}
        />
        <button className="chatbot-send-btn" type="submit" disabled={loading || !input.trim()}>
          Send
        </button>
      </form>
    </div>
  );
};

export default Chatbot;