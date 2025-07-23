const OpenAI = require('openai');
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

async function generateSceneDescription(theme, genre, tone) {
  const prompt = `Write a short, atmospheric scene description based on the following:
Theme: ${theme}
Genre: ${genre}
Tone: ${tone}
Limit it to 3–4 sentences.`;

  const response = await openai.chat.completions.create({
    model: "gpt-4",
    messages: [{ role: "user", content: prompt }],
    temperature: 0.8,
  });

  return response.choices?.[0]?.message?.content?.trim();
}

async function generateColorPalette(description) {
  const prompt = `Based on this scene description, return a list of 5 aesthetically cohesive hex color codes (like ["#112233", "#aabbcc", ...]) that match the mood:\n\n${description}`;

  const response = await openai.chat.completions.create({
    model: "gpt-4",
    messages: [{ role: "user", content: prompt }],
    temperature: 0.7,
  });

  const match = response.choices?.[0]?.message?.content.match(/\[.*?\]/s);
  return match ? JSON.parse(match[0]) : [];
}

module.exports = { generateSceneDescription, generateColorPalette };
