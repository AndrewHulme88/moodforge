import { useState } from "react";
import MoodForm from "./components/MoodForm";
import DescriptionBox from "./components/DescriptionBox";
import ImageDisplay from "./components/ImageDisplay";
import ColorPalette from "./components/ColorPalette";

function App() {
  const [formData, setFormData] = useState({
    theme: "",
    genre: "Fantasy",
    tone: "Cinematic",
  });

  const [loading, setLoading] = useState(false);
  const [description, setDescription] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [palette, setPalette] = useState([]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setDescription("");
    setImageUrl("");
    setPalette([]);

    try {
      // 1. Get AI-generated text
      const textRes = await fetch("http://localhost:3001/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const textData = await textRes.json();
      const description = textData.description || "No description returned.";
      setDescription(description);

      // 2. Generate color palette
      const colorRes = await fetch("http://localhost:3001/api/generate-colors", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ description }),
      });

      const colorData = await colorRes.json();
      setPalette(Array.isArray(colorData.colors) ? colorData.colors : []);

      // 3. Generate image
      const imageRes = await fetch("http://localhost:3001/api/generate-image", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: description }),
      });

      const imageData = await imageRes.json();
      const maybeUrl =
        typeof imageData.image === "string"
          ? imageData.image
          : Array.isArray(imageData.image)
          ? imageData.image[0]
          : imageData.image?.output?.[0] || imageData.image?.url || null;

      if (maybeUrl) {
        setImageUrl(maybeUrl);
      } else {
        console.warn("No image URL found in response.");
      }
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

        <MoodForm
          formData={formData}
          handleSubmit={handleSubmit}
          loading={loading}
          setFormData={setFormData}
        />

        <DescriptionBox description={description} />
        <ImageDisplay imageUrl={imageUrl} />
        <ColorPalette palette={palette} />
      </div>
    </div>
  );
}

export default App;
