import React from "react";

const ImageDisplay = ({ imageUrl }) => {
  if (!imageUrl) return null;

  return (
    <div className="mt-6">
      <h2 className="text-xl font-semibold mb-2">Generated Image</h2>
      <img
        src={imageUrl}
        alt="AI Moodboard"
        className="w-full rounded shadow-md border"
      />
    </div>
  );
};

export default ImageDisplay;
