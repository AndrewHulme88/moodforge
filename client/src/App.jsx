import { useState } from "react";

function App() {
  const [formData, setFormData] = useState({
    theme: "",
    genre: "Fantasy",
    tone: "Cinematic"
  });

  const [loading, setLoading] = useState(false);
  const [description, setDescription] = useState("");
  const [imageUrl, setImageUrl] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setDescription("");
    setImageUrl("");

    try {
      // Step 1: Get AI-generated text
      const textRes = await fetch("http://localhost:3001/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const textData = await textRes.json();
      setDescription(textData.description || "No description returned.");

      // Step 2: Send description as image prompt
      const imageRes = await fetch("http://localhost:3001/api/generate-image", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: textData.description }),
      });

      const imageData = await imageRes.json();
      setImageUrl(imageData.image);
      console.log("🎨 Image URL:", imageData.image);
    } catch (err) {
      console.error("Error generating moodboard:", err);
      setDescription("Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-xl mx-auto bg-white p-6 rounded-xl shadow-md">
        <h1 className="text-3xl font-bold mb-4">MoodForge</h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            name="theme"
            type="text"
            placeholder="e.g. abandoned underwater lab"
            value={formData.theme}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
          />
          <select
            name="genre"
            value={formData.genre}
            onChange={handleChange}
            className="w-full p-2 border rounded"
          >
            <option>Fantasy</option>
            <option>Sci-fi</option>
            <option>Horror</option>
            <option>Drama</option>
            <option>Cyberpunk</option>
          </select>
          <select
            name="tone"
            value={formData.tone}
            onChange={handleChange}
            className="w-full p-2 border rounded"
          >
            <option>Cinematic</option>
            <option>Dark</option>
            <option>Whimsical</option>
            <option>Gritty</option>
            <option>Dreamlike</option>
          </select>
          <button
            type="submit"
            className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
          >
            {loading ? "Generating..." : "Generate Moodboard"}
          </button>
        </form>

        {description && (
          <div className="mt-6 p-4 bg-gray-50 border-l-4 border-indigo-400 rounded">
            <h2 className="text-xl font-semibold mb-2">Generated Description</h2>
            <p className="text-gray-700 whitespace-pre-line">{description}</p>
          </div>
        )}

        {imageUrl && (
          <div className="mt-6">
            <h2 className="text-xl font-semibold mb-2">Generated Image</h2>
            <img
              src={imageUrl}
              alt="AI Moodboard"
              className="w-full rounded shadow-md border"
            />
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
