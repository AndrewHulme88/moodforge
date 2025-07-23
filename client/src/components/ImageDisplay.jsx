import React from "react";

const ImageDisplay = ({ imageUrls }) => {
  if (!imageUrls || imageUrls.length === 0) return null;

  return (
    <div className="mt-6">
      <h2 className="text-xl font-semibold mb-2">Generated Images</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {imageUrls.map((url, index) => (
          <img
            key={index}
            src={url}
            alt={`Moodboard Image ${index + 1}`}
            className="w-full rounded shadow-md border"
          />
        ))}
      </div>
    </div>
  );
};

export default ImageDisplay;
