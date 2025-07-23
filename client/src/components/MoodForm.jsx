import React from "react";

function MoodForm({ formData, loading, onChange, onSubmit }) {
  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <input
        name="theme"
        type="text"
        placeholder="e.g. abandoned underwater lab"
        value={formData.theme}
        onChange={onChange}
        className="w-full p-2 border rounded"
        required
      />
      <select
        name="genre"
        value={formData.genre}
        onChange={onChange}
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
        onChange={onChange}
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
  );
}

export default MoodForm;
