const ImageDisplay = ({ imageUrl }) => {
  if (!imageUrl) return null;

  return (
    <div className="mt-4">
      <h2 className="text-xl font-semibold mb-2">Generated Image</h2>
      <img
        src={imageUrl}
        alt="AI Moodboard"
        className="w-full rounded shadow-md border"
        onError={() => console.error("❌ Failed to load image:", imageUrl)}
      />
    </div>
  );
};

export default ImageDisplay;
