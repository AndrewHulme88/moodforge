const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { Configuration, OpenAIApi } = require('openai');

const app = express();
app.use(cors());
app.use(express.json());

const openai = new OpenAIApi(new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
}));

app.post('/api/generate', async (req, res) => {
  const { theme, genre, tone } = req.body;

  try {
    const prompt = `Write a short, atmospheric scene description based on the following inputs:
Theme: ${theme}
Genre: ${genre}
Tone: ${tone}
Limit it to 3–4 sentences.`;

    const response = await openai.createChatCompletion({
      model: "gpt-4",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.8,
    });

    const text = response.data.choices[0].message.content.trim();
    res.json({ description: text });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: "Failed to generate mood text." });
  }
});

app.listen(3001, () => console.log('MoodForge backend running on http://localhost:3001'));
