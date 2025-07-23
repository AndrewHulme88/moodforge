function MoodForm({ formData, setFormData, handleSubmit, loading }) {
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-1" htmlFor="theme">
          Theme
        </label>
        <input
          id="theme"
          name="theme"
          type="text"
          placeholder="e.g. abandoned underwater lab"
          value={formData.theme}
          onChange={handleChange}
          className="w-full p-2 border rounded"
          required
        />
      </div>

      <div className="flex gap-4">
        <div className="w-1/2">
          <label className="block text-sm font-medium mb-1" htmlFor="genre">
            Genre
          </label>
          <select
            id="genre"
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
        </div>

        <div className="w-1/2">
          <label className="block text-sm font-medium mb-1" htmlFor="tone">
            Tone
          </label>
          <select
            id="tone"
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
        </div>
      </div>

      <button
        type="submit"
        className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
      >
        {loading ? "Generating..." : "Generate Moodboard"}
      </button>
    </form>
  );
}

export default MoodForm;
