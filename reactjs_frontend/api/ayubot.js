//
// Node.js backend endpoint stub for OpenAI relay (for Next.js, Express, or as an API route in dev)
// Mounts at /api/ayubot/ask for POST requests.
//
const express = require("express");
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

const router = express.Router();

/**
 * POST /api/ayubot/ask
 * Expects: { apiKey: string, userPrompt: string }
 * Returns: { reply: string }
 */
router.post("/ask", async (req, res) => {
  try {
    const { apiKey, userPrompt } = req.body;
    if (!apiKey || apiKey.length < 20) {
      return res.status(400).json({ error: "Missing or invalid OpenAI API key" });
    }
    if (!userPrompt || userPrompt.length < 2) {
      return res.status(400).json({ error: "Missing or invalid user prompt" });
    }

    // Compose the OpenAI API request safely
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages: [
          {
            "role": "system",
            "content": "You are AyuBot, an expert Ayurveda assistant. Reply in simple easy-to-understand language. Suggest natural or home remedies, herbs, and wellness tips only; avoid pharmaceutical advice and keep language supportive and positive. If question is not health related, politely decline."
          },
          { "role": "user", "content": userPrompt }
        ],
        temperature: 0.6,
        max_tokens: 350,
      })
    });

    if (!response.ok) {
      const errMsg = await response.text();
      return res.status(502).json({ error: errMsg || "OpenAI API error" });
    }

    const data = await response.json();
    if (data && data.choices && data.choices[0] && data.choices[0].message && data.choices[0].message.content) {
      return res.json({ reply: data.choices[0].message.content.trim() });
    }
    return res.status(502).json({ error: "No reply from OpenAI" });
  } catch (err) {
    res.status(500).json({ error: "Internal error: " + (err.message || "Unknown") });
  }
});

module.exports = router;
