import { useState } from "react";
import MoodForm from "../components/MoodForm";
import DescriptionBox from "../components/DescriptionBox";
import ImageDisplay from "../components/ImageDisplay";
import ColorPalette from "../components/ColorPalette";

function HomePage({ isAuthenticated }) {
  const [formData, setFormData] = useState({
    theme: "",
    genre: "Fantasy",
    tone: "Cinematic",
  });

  const [loading, setLoading] = useState(false);
  const [description, setDescription] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [palette, setPalette] = useState([]);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const [hasSaved, setHasSaved] = useState(false);



  const token = localStorage.getItem("token");

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-center p-6">
        <h2 className="text-2xl font-semibold">Please log in to use MoodForge</h2>
        <p className="text-gray-600 mt-2">
          You’ll need an account to generate moodboards.
        </p>
      </div>
    );
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setDescription("");
    setImageUrl("");
    setPalette([]);
    setError("");

    try {
      const textRes = await fetch("http://localhost:3001/api/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });
      const textData = await textRes.json();
      const scene = textData.description || "No description returned.";
      setDescription(scene);

      const colorRes = await fetch("http://localhost:3001/api/generate-colors", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ description: scene }),
      });
      const colorData = await colorRes.json();
      setPalette(Array.isArray(colorData.colors) ? colorData.colors : []);

      const imageRes = await fetch("http://localhost:3001/api/generate-image", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ prompt: scene }),
      });

      const imageData = await imageRes.json();
      if (!imageRes.ok) {
        throw new Error(imageData.error || "Image generation failed.");
      }

      setImageUrl(imageData.image || "");
    } catch (err) {
      console.error("Error generating moodboard:", err);
      setError(err.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  const saveMoodboard = async () => {
    setSaving(true);
    try {
      const res = await fetch("http://localhost:3001/api/moodboards", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          ...formData,
          description,
          openaiImageUrl: imageUrl,
          colors: palette,
        }),
      });

      if (!res.ok) throw new Error("Failed to save");
      setHasSaved(true); // prevent future saves
      alert("Moodboard saved!");
    } catch (err) {
      console.error("Save error:", err.message);
      alert("Failed to save moodboard.");
    } finally {
      setSaving(false);
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
        {error && (
          <p className="mt-4 text-red-600 font-medium text-sm">{error}</p>
        )}
      </div>

      {description && (
        <div className="max-w-7xl mx-auto bg-white rounded-xl shadow-md p-4 sm:p-6 h-[80vh] overflow-hidden flex flex-col sm:flex-row gap-4">
          <div className="w-full sm:w-1/2 flex flex-col gap-4 overflow-auto pr-2">
            <DescriptionBox description={description} />
            <ColorPalette palette={palette} />
          </div>
          <div className="w-full sm:w-1/2 overflow-auto pl-2">
            <ImageDisplay imageUrl={imageUrl} />
          </div>
        </div>
      )}

      {description && token && (
        <div className="text-center mt-4">
          <button
            onClick={saveMoodboard}
            disabled={saving || hasSaved}
            className={`px-4 py-2 rounded text-white ${
              saving || hasSaved
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-indigo-600 hover:bg-indigo-700"
            }`}
          >
            {saving
              ? "Saving to dashboard..."
              : hasSaved
              ? "Saved"
              : "Save Moodboard"}
          </button>
        </div>
      )}
    </div>
  );
}

export default HomePage;
