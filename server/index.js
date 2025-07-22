const express = require('express');
const cors = require('cors');
require('dotenv').config();
const OpenAI = require('openai');

const app = express();
app.use(cors());
app.use(express.json());

// Initialize OpenAI client (v4+)
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// POST /api/generate
app.post('/api/generate', async (req, res) => {
  const { theme, genre, tone } = req.body;

  if (!theme || !genre || !tone) {
    return res.status(400).json({ error: "Missing required fields." });
  }

  const prompt = `Write a short, atmospheric scene description based on the following:
Theme: ${theme}
Genre: ${genre}
Tone: ${tone}
Limit it to 3–4 sentences.`;

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.8,
    });

    const text = response.choices?.[0]?.message?.content?.trim();

    if (!text) {
      console.warn("⚠️ No content in OpenAI response");
      return res.status(500).json({ description: "AI returned no result." });
    }

    console.log("✅ OpenAI description:", text);
    res.json({ description: text });

  } catch (error) {
    console.error("❌ OpenAI Error:", error.message);
    res.status(500).json({ error: "Failed to generate mood text." });
  }
});

app.listen(3001, () => {
  console.log("🌐 MoodForge backend running at http://localhost:3001");
});
