import React, { useState } from "react";

// --- Sample mapping of conditions to Ayurvedic remedies ---
const ayurvedicRemedyLookup = {
  "Dehydration": [
    {
      title: "Coconut Water Hydration",
      description: "Drink coconut water with a pinch of rock salt. Helps restore electrolytes and soothes the body.",
      image: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=400&q=80",
      category: "Hydration"
    }
  ],
  "Hypothyroidism": [
    {
      title: "Ashwagandha Herbal Support",
      description: "Ashwagandha is known in Ayurveda for thyroid support. Use as directed by an Ayurvedic practitioner.",
      image: "https://images.unsplash.com/photo-1502741338009-cac2772e18bc?auto=format&fit=crop&w=400&q=80",
      category: "Endocrine"
    }
  ],
  "Fatigue": [
    {
      title: "Chyawanprash Morning Boost",
      description: "Take 1 spoon daily of Chyawanprash (Ayurvedic herbal jam) to boost energy and immunity.",
      image: "https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=400&q=80",
      category: "Fatigue"
    }
  ],
  "Atopic dermatitis": [
    {
      title: "Turmeric & Aloe Skin Soothe",
      description: "Apply a paste of turmeric and aloe to dry, irritated skin; reduces inflammation.",
      image: "https://images.unsplash.com/photo-1464983953574-0892a716854b?auto=format&fit=crop&w=400&q=80",
      category: "Skin"
    }
  ]
};

function infermedicaHeaders() {
  // These headers must be replaced with your own credentials if using RapidAPI (for demo purposes, static values provided).
  // IMPORTANT: In production, DO NOT expose API keys in the frontend, proxy the request via your backend server.
  return {
    "content-type": "application/json",
    "X-RapidAPI-Key": "YOUR_RAPIDAPI_KEY", // <-- Place your API KEY here for demo/testing ONLY
    "X-RapidAPI-Host": "symptom-checker.p.rapidapi.com"
  };
}

// PUBLIC_INTERFACE
function SymptomChecker() {
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [conditions, setConditions] = useState([]);
  const [remedies, setRemedies] = useState({});
  const [error, setError] = useState(null);

  // Handle API call
  async function handleSymptomSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setConditions([]);
    setRemedies({});
    setError(null);

    try {
      // RapidAPI uses POST, documented at https://rapidapi.com/infermedica/api/symptom-checker/
      const apiUrl = "https://symptom-checker.p.rapidapi.com/symptoms-checker";
      const response = await fetch(apiUrl, {
        method: "POST",
        headers: infermedicaHeaders(),
        body: JSON.stringify({ symptoms: input })
      });

      if (!response.ok) {
        throw new Error("API error: " + response.statusText);
      }
      const data = await response.json();

      // Infermedica API returns 'conditions', which is an array of condition objects
      // We will extract their names and map them to sample Ayurveda remedies
      const conditionsFound = (data.conditions || []).map(cond => cond.name);
      setConditions(conditionsFound);

      const remedyResults = {};
      conditionsFound.forEach(c => {
        // lookup is case-insensitive
        const remediesForCond = ayurvedicRemedyLookup[c] ||
          ayurvedicRemedyLookup[
            Object.keys(ayurvedicRemedyLookup).find(
              key => key.toLowerCase() === c.toLowerCase()
            )
          ] ||
          [];
        if (remediesForCond.length) remedyResults[c] = remediesForCond;
      });
      setRemedies(remedyResults);
    } catch (err) {
      setError("Failed to connect to Infermedica API. Please try again later.");
    }
    setLoading(false);
  }

  return (
    <section className="ayu-container" style={{ maxWidth: 600 }}>
      <h2>🩺 Symptom Checker</h2>
      <p>
        Enter your symptoms (e.g., <span style={{fontStyle:"italic"}}>dry skin, tiredness</span>) below to get possible conditions and Ayurvedic remedy suggestions.
      </p>
      <form onSubmit={handleSymptomSubmit} className="ayu-form">
        <label>
          Symptom description
          <input
            type="text"
            name="symptoms"
            placeholder="e.g. dry skin, tiredness"
            value={input}
            onChange={e => setInput(e.target.value)}
            required
            autoFocus
          />
        </label>
        <button type="submit" className="ayu-btn ayu-btn-primary" disabled={loading}>
          {loading ? "Checking..." : "Check Symptoms"}
        </button>
      </form>

      {error && <div style={{color: "#b94a48", marginTop: 18}}>{error}</div>}

      {conditions.length > 0 && (
        <div style={{ marginTop: 32 }}>
          <h3>Possible Conditions</h3>
          <ul>
            {conditions.map(c => (
              <li key={c}>
                <strong>{c}</strong>
                {remedies[c] && remedies[c].length > 0 && (
                  <div style={{marginTop:6,marginBottom:16}}>
                    <span style={{fontWeight:600, color:"#689f38"}}>Ayurvedic Remedies:</span>
                    <div className="remedy-list">
                      {remedies[c].map((r, idx) => (
                        <div className="ayu-remedy-card" style={{maxWidth:260, margin:"10px 0"}} key={idx}>
                          <img src={r.image} alt={r.title} className="remedy-img" />
                          <div className="remedy-info">
                            <h4>{r.title}</h4>
                            <p className="remedy-cat">{r.category}</p>
                            <p className="remedy-desc">{r.description}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}

      {!loading && conditions.length === 0 && !error && (
        <div style={{marginTop:24, color:"#889892",fontSize:"1.09em"}}>Your matched health conditions and holistic suggestions will appear here.</div>
      )}

      <div style={{
        fontSize: "0.89em",
        color: "#6d736d",
        background: "#edfff4",
        borderRadius: 8,
        padding: "10px 16px",
        marginTop: 40,
        maxWidth: 530
      }}>
        <b>Note:</b> This tool is for wellness & educational purposes. It is not a substitute for professional medical advice. API response interpretation and remedy suggestions demo only. No confidential health data is stored.
      </div>
    </section>
  );
}

export default SymptomChecker;
