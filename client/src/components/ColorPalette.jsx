function ColorPalette({ palette }) {
  if (!palette?.length) return null;

  return (
    <div className="mt-6">
      <h2 className="text-xl font-semibold mb-2">Color Palette</h2>
      <div className="flex gap-2">
        {palette.map((hex, index) => (
          <div
            key={index}
            className="w-12 h-12 rounded shadow border"
            style={{ backgroundColor: hex }}
            title={hex}
          ></div>
        ))}
      </div>
    </div>
  );
}

export default ColorPalette;
