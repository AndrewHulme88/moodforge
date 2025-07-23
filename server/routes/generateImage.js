// routes/generate-image.js
const express = require("express");
const router = express.Router();
const Replicate = require("replicate");

// Initialize Replicate
const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN,
});

router.post("/", async (req, res) => {
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

    // Poll for the final result
    let finalPrediction = prediction;
    while (
      finalPrediction.status !== "succeeded" &&
      finalPrediction.status !== "failed"
    ) {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      finalPrediction = await replicate.predictions.get(finalPrediction.id);
    }

    if (finalPrediction.status === "succeeded") {
      const image = Array.isArray(finalPrediction.output)
        ? finalPrediction.output[0]
        : finalPrediction.output;

      console.log("✅ Final image URL:", image);
      res.json({ image });
    } else {
      console.warn("⚠️ Image generation failed or no output.");
      res.status(500).json({ error: "Image generation failed." });
    }

  } catch (err) {
    console.error("❌ Image Gen Error:", err.message);
    res.status(500).json({ error: "Image generation failed." });
  }
});

module.exports = router;
