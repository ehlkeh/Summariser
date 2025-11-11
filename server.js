const express = require("express");
const axios = require("axios");
const app = express();

app.use(express.json());

// TODO: Move API key to environment variable later
const OPENAI_API_KEY = "UCSI25{sk-live-4xBq29JVh1mR7sA8LcdY92fTn8TmgA1Xp3Q2}";

app.post("/summarise", async (req, res) => {
  const { text } = req.body;

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
