import React, { useState } from "react";

/**
 * AyuBotChat - Smart Remedy Chat page using OpenAI
 * - Prompts user for OpenAI API key (if not set, stores in localStorage)
 * - Allows user to enter symptom/questions
 * - Calls backend relay route (/api/ayubot/ask) which in turn securely calls OpenAI API
 * - Displays remedy suggestion from OpenAI
 *
 * For educational/demonstration only. API key is never sent directly to OpenAI from frontend.
 */
// PUBLIC_INTERFACE
function AyuBotChat() {
  const [apiKey, setApiKey] = useState(() => localStorage.getItem("openai_api_key") || "");
  const [showApiPrompt, setShowApiPrompt] = useState(!apiKey);
  const [input, setInput] = useState("");
  const [answer, setAnswer] = useState("");
  const [loading, setLoading] = useState(false);
  const [customErr, setCustomErr] = useState("");
  const [messages, setMessages] = useState([]);

  // Handle API key prompt/save
  const handleApiKeySubmit = (e) => {
    e.preventDefault();
    if (apiKey && apiKey.length > 20) {
      localStorage.setItem("openai_api_key", apiKey.trim());
      setShowApiPrompt(false);
    }
  };

  // Handle user question submission
  async function handleAskSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setAnswer("");
    setCustomErr("");
    try {
      // Send to relay endpoint
      const fresp = await fetch("/api/ayubot/ask", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          apiKey,
          userPrompt: input
        })
      });
      if (!fresp.ok) {
        const errorMsg = await fresp.text();
        throw new Error(errorMsg || "OpenAI relay failed");
      }
      const result = await fresp.json();
      setAnswer(result.reply || "");
      setMessages([
        ...messages,
        { role: "user", content: input },
        { role: "bot", content: result.reply }
      ]);
    } catch (err) {
      setCustomErr("Sorry— could not get response. Please check your OpenAI key or try again.");
    }
    setLoading(false);
    setInput("");
  }

  // API Key Prompt
  if (showApiPrompt || !apiKey) {
    return (
      <section className="ayu-container" style={{maxWidth:480, margin:"44px auto", background:"#f4fff8",borderRadius:17,padding:24,border:"1.5px solid #bfd8b8"}}>
        <h2 style={{marginTop:6,marginBottom:10}}>🔑 Enter OpenAI API Key</h2>
        <p>
          To use AyuBot for smart Ayurveda suggestions, enter your <a href="https://platform.openai.com/api-keys" target="_blank" rel="noopener noreferrer">OpenAI API key</a> below.<br/>
          (Your key is safely stored only in your browser and never leaves this device, except for secure API calls.)
        </p>
        <form onSubmit={handleApiKeySubmit} style={{ display: "flex", gap: 9 }}>
          <input
            type="password"
            placeholder="Paste your OpenAI key here"
            value={apiKey}
            onChange={e => setApiKey(e.target.value)}
            required
            style={{flex:1, borderRadius:8, padding:8, border:"1.3px solid #bdd", fontSize:"1em"}}
            autoFocus
            autoComplete="off"
          />
          <button type="submit" className="ayu-btn ayu-btn-primary">Save</button>
        </form>
        <div style={{fontSize:"0.96em", color:"#6d9365",marginTop:10}}>
          Don’t have a key? Get one <a href="https://platform.openai.com/api-keys" target="_blank" rel="noopener noreferrer">here</a>.
        </div>
      </section>
    );
  }

  return (
    <section className="ayu-container" style={{maxWidth:540}}>
      <h2>🤖 Ask AyuBot – Smart Ayurveda Chat</h2>
      <p>Describe your symptom or question (e.g. <span style={{fontStyle:"italic"}}>"I have acne and a cold"</span>) and get personalized holistic suggestions powered by OpenAI.</p>
      <form onSubmit={handleAskSubmit} className="ayu-form" style={{marginTop:18}}>
        <label>
          Symptom or question
          <textarea
            rows={3}
            value={input}
            onChange={e => setInput(e.target.value)}
            required
            placeholder="Enter your health concern, e.g. skin rash and cough"
            disabled={loading}
            style={{marginTop:2}}
          />
        </label>
        <button className="ayu-btn ayu-btn-primary" type="submit" disabled={loading || !input.trim()}>
          {loading ? "Thinking..." : "Ask AyuBot"}
        </button>
      </form>
      <button
        className="ayu-btn ayu-btn-chip"
        style={{marginTop:6,fontSize:"0.91em"}}
        onClick={() => setShowApiPrompt(true)}
        aria-label="Change OpenAI API key"
      >
        Change OpenAI API key
      </button>

      {customErr && <div style={{
        color: "#ba1e37", background: "#ffefef", borderRadius: 8, padding: "7px 10px", marginTop: 16
      }}>{customErr}</div>}

      {/* Chat history */}
      {messages.length > 0 && (
        <div style={{marginTop: 32}}>
          <h3 style={{fontWeight:500, color:"#689f38"}}>AyuBot Conversation</h3>
          <div style={{background:"#f7fff7",borderRadius:14,marginTop:6,padding:"12px 11px 8px 11px",boxShadow:"0 1.5px 9px -4px #b2ddbe"}}>
            {messages.map((m, idx) => (
              <div key={idx} style={{margin:"14px 0", paddingLeft: m.role === "bot" ? 20 : 0}}>
                <span style={{
                  color: m.role === "user" ? "#18664a" : "#386a3f",
                  fontWeight: 600,
                  marginRight: 5
                }}>
                  {m.role === "user" ? "You:" : "AyuBot:"}
                </span>
                <span style={{
                  background: m.role === "user" ? "#E8F6FF" : "#edfbdc",
                  borderRadius: 7,
                  padding: "5px 10px"
                }}>{m.content}</span>
              </div>
            ))}
          </div>
        </div>
      )}
      {/* Latest bot response separate */}
      {answer && (
        <div style={{
          marginTop: 34, background: "#f0fbea", borderRadius: 12, padding: "18px 14px",
          fontSize: "1.16em", boxShadow: "0 2.5px 11px -8px #c1e1b7", border: "1.3px solid #bfd8b8"
        }}>
          <b>🌿 AyuBot Suggestion:</b>
          <div style={{marginTop:8, color: "#2b6332"}}>{answer}</div>
        </div>
      )}
      <div style={{
        fontSize: "0.88em",
        color: "#7a7c6c",
        background: "#f4fff8",
        borderRadius: 10,
        padding: "10px 15px",
        marginTop: 34,
        maxWidth: 420
      }}>
        <b>Note:</b> AI suggestions are for general wellness inspiration only. Not medical advice.
      </div>
    </section>
  );
}

export default AyuBotChat;
