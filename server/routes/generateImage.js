const express = require("express");
const router = express.Router();
const axios = require("axios");
const { v4: uuidv4 } = require("uuid");
const streamifier = require("streamifier");

const requireAuth = require("../middleware/authMiddleware");
const cloudinary = require("../config/cloudinary");

const { OpenAI } = require("openai");

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

router.post("/", requireAuth, async (req, res) => {
  const { prompt } = req.body;

  try {
    // Generate image using OpenAI
    const response = await openai.images.generate({
      model: "dall-e-3",
      prompt,
      n: 1,
      size: "1024x1024",
    });

    const openaiUrl = response.data[0].url;

    // Download the image from OpenAI's URL
    const imageRes = await axios.get(openaiUrl, { responseType: "arraybuffer" });

    // Upload image buffer to Cloudinary
    const result = await new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        {
          public_id: `moodforge/${uuidv4()}`,
          resource_type: "image",
        },
        (err, result) => {
          if (err) reject(err);
          else resolve(result);
        }
      );
      streamifier.createReadStream(imageRes.data).pipe(stream);
    });

    // Return the Cloudinary-hosted image URL
    res.json({ image: result.secure_url });

  } catch (err) {
    console.error("❌ Image Gen Error:", err.message);

    // If OpenAI returned an error with a response body, pass that through
    const errorMessage =
      err?.response?.data?.error?.message || err.message || "Image generation failed.";

    res.status(400).json({ error: errorMessage });
  }
});

module.exports = router;
