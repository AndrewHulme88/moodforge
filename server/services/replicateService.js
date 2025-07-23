const Replicate = require('replicate');
const replicate = new Replicate({ auth: process.env.REPLICATE_API_TOKEN });

async function generateImages(prompt, count = 3) {
  const prediction = await replicate.predictions.create({
    version: "ac732df83cea7fff18b8472768c88ad041fa750ff7682a21affe81863cbe77e4",
    input: { prompt, width: 768, height: 768, num_outputs: count },
  });

  let finalPrediction = prediction;
  while (
    finalPrediction.status !== "succeeded" &&
    finalPrediction.status !== "failed"
  ) {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    finalPrediction = await replicate.predictions.get(finalPrediction.id);
  }

  return finalPrediction.output || [];
}

module.exports = { generateImages };
