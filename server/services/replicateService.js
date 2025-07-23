const Replicate = require("replicate");

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN,
});

async function generateImage(prompt) {
  const prediction = await replicate.predictions.create({
    version: "ac732df83cea7fff18b8472768c88ad041fa750ff7682a21affe81863cbe77e4",
    input: { prompt, width: 768, height: 768 },
  });

  let finalPrediction = prediction;
  while (
    finalPrediction.status !== "succeeded" &&
    finalPrediction.status !== "failed"
  ) {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    finalPrediction = await replicate.predictions.get(finalPrediction.id);
  }

  if (
    finalPrediction.status === "succeeded" &&
    Array.isArray(finalPrediction.output)
  ) {
    return finalPrediction.output[0]; // ✅ return single image URL
  } else {
    throw new Error("Image generation failed or no output.");
  }
}

module.exports = { generateImage };
