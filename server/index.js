const express = require('express');
const cors = require('cors');
require('dotenv').config();
const OpenAI = require('openai');
const Replicate = require('replicate');

const app = express();
app.use(cors());
app.use(express.json());

// 🔑 Init OpenAI
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// 🔑 Init Replicate
const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN,
});

// 🧠 AI Text Endpoint
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

// 🎨 Image Generation Endpoint
app.post('/api/generate-image', async (req, res) => {
  const { prompt } = req.body;

  try {
    const prediction = await replicate.predictions.create({
      version: "ac732df83cea7fff18b8472768c88ad041fa750ff7682a21affe81863cbe77e4",
      input: {
        prompt,
        width: 768,
        height: 768,
      },
    });

    // Poll until complete
    let finalPrediction = prediction;
    while (
      finalPrediction.status !== "succeeded" &&
      finalPrediction.status !== "failed"
    ) {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      finalPrediction = await replicate.predictions.get(finalPrediction.id);
    }

    if (finalPrediction.status === "succeeded" && Array.isArray(finalPrediction.output)) {
      const url = finalPrediction.output[0];
      console.log("✅ Final image URL:", url);
      res.json({ image: url });
    } else {
      console.warn("⚠️ Image generation failed or no output.");
      res.status(500).json({ error: "Image generation failed or no output." });
    }

  } catch (err) {
    console.error("❌ Image generation error:", err);
    res.status(500).json({ error: "Image generation failed." });
  }
});


// 🚀 Start server
app.listen(3001, () => {
  console.log("🌐 MoodForge backend running at http://localhost:3001");
});
