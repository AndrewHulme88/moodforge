import { useState } from "react";
import MoodForm from "../components/MoodForm";
import DescriptionBox from "../components/DescriptionBox";
import ImageDisplay from "../components/ImageDisplay";
import ColorPalette from "../components/ColorPalette";

function HomePage() {
  const [formData, setFormData] = useState({
    theme: "",
    genre: "Fantasy",
    tone: "Cinematic",
  });

  const [loading, setLoading] = useState(false);
  const [description, setDescription] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [palette, setPalette] = useState([]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setDescription("");
    setImageUrl("");
    setPalette([]);

    try {
      const textRes = await fetch("http://localhost:3001/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const textData = await textRes.json();
      const scene = textData.description || "No description returned.";
      setDescription(scene);

      const colorRes = await fetch("http://localhost:3001/api/generate-colors", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ description: scene }),
      });
      const colorData = await colorRes.json();
      setPalette(Array.isArray(colorData.colors) ? colorData.colors : []);

      const imageRes = await fetch("http://localhost:3001/api/generate-image", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: scene }),
      });
      const imageData = await imageRes.json();
      console.log("✅ Final image URL:", imageData.image);
      setImageUrl(imageData.image || "");
    } catch (err) {
      console.error("Error generating moodboard:", err);
      setDescription("Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4 sm:p-6">
      <div className="max-w-3xl mx-auto bg-white p-6 rounded-xl shadow-md mb-6">
        <h1 className="text-3xl font-bold mb-4">MoodForge</h1>
        <MoodForm
          formData={formData}
          setFormData={setFormData}
          handleSubmit={handleSubmit}
          loading={loading}
        />
      </div>

      {description && (
        <div className="max-w-7xl mx-auto bg-white rounded-xl shadow-md p-4 sm:p-6 h-[80vh] overflow-hidden flex flex-col sm:flex-row gap-4">
          {/* Left output: text + colors */}
          <div className="w-full sm:w-1/2 flex flex-col gap-4 overflow-auto pr-2">
            <DescriptionBox description={description} />
            <ColorPalette palette={palette} />
          </div>

          {/* Right output: images */}
          <div className="w-full sm:w-1/2 overflow-auto pl-2">
            <ImageDisplay imageUrl={imageUrl} />
          </div>
        </div>
      )}
    </div>
  );
}

export default HomePage;
