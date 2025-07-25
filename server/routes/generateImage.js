const express = require("express");
const router = express.Router();
const requireAuth = require("../middleware/authMiddleware");
const { OpenAI } = require("openai");

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

router.post("/", requireAuth, async (req, res) => {
  const { prompt } = req.body;

  try {
    const response = await openai.images.generate({
      model: "dall-e-3",
      prompt,
      n: 1,
      size: "1024x1024",
    });

    const openaiUrl = response.data[0].url;
    res.json({ image: openaiUrl });
  } catch (err) {
    console.error("❌ Image Gen Error:", err.message);
    const errorMessage =
      err?.response?.data?.error?.message || err.message || "Image generation failed.";
    res.status(400).json({ error: errorMessage });
  }
});

module.exports = router;
