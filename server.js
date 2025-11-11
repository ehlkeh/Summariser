const express = require("express");
const axios = require("axios");
const app = express();

app.use(express.json());

// Read the API key from environment variable
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

if (!OPENAI_API_KEY) {
  console.error("ERROR: OPENAI_API_KEY not set in environment variables.");
  process.exit(1);
}

app.post("/summarise", async (req, res) => {
  const { text } = req.body;

  if (!text) {
    return res.status(400).json({ error: "Missing 'text' in request body" });
  }

  try {
    const response = await axios.post(
      "https://api.openai.com/v1/chat/completions",
      {
        model: "gpt-5-mini",
        messages: [
          { role: "system", content: "Summarise the text concisely." },
          { role: "user", content: text }
        ]
      },
      {
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${OPENAI_API_KEY}`
        }
      }
    );

    res.json({ summary: response.data.choices[0].message.content });
  } catch (err) {
    console.error(err.response?.data || err);
    res.status(500).json({ error: "Failed to summarise" });
  }
});

app.listen(3000, () => console.log("Summariser API running on port 3000"));
