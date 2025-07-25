import { useEffect, useState } from "react";

const Dashboard = () => {
  const [moodboards, setMoodboards] = useState([]);
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchMoodboards = async () => {
      try {
        const res = await fetch("http://localhost:3001/api/moodboards", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await res.json();
        setMoodboards(data);
      } catch (err) {
        console.error("Failed to load moodboards:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchMoodboards();
  }, [token]);

  if (loading) return <p className="p-4">Loading your moodboards...</p>;

  const handleDelete = async (id) => {
    const confirmed = window.confirm("Are you sure you want to delete this moodboard?");
    if (!confirmed) return;

    try {
      const res = await fetch(`http://localhost:3001/api/moodboards/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) throw new Error("Failed to delete");

      setMoodboards(moodboards.filter((m) => m._id !== id));
    } catch (err) {
      console.error("Delete error:", err.message);
      alert("Failed to delete moodboard.");
    }
  };

  return (
    <div className="p-4 max-w-6xl mx-auto">
      <h2 className="text-3xl font-bold mb-6">Your Moodboards</h2>
      {moodboards.length === 0 ? (
        <p className="text-gray-600">No moodboards saved yet.</p>
      ) : (
        <div className="grid gap-6 md:grid-cols-2">
          {moodboards.map((board) => (
            <div
              key={board._id}
              className="bg-white rounded-xl shadow p-4 border border-gray-200"
            >
              <h3 className="text-xl font-semibold mb-2">{board.theme}</h3>
              <p className="text-sm text-gray-500 mb-2">
                {board.genre} | {board.tone}
              </p>
              <p className="text-gray-700 mb-4">{board.description}</p>
              <img
                src={board.imageUrl}
                alt="Moodboard visual"
                className="w-full h-48 object-cover rounded mb-4"
              />
              <div className="flex gap-2 items-center mt-4">
                {board.colors.map((color, i) => (
                  <div
                    key={i}
                    className="w-6 h-6 rounded"
                    style={{ backgroundColor: color }}
                    title={color}
                  />
                ))}
                <button
                  onClick={() => handleDelete(board._id)}
                  className="ml-auto bg-red-600 text-white text-sm px-3 py-1 rounded hover:bg-red-700 transition"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Dashboard;
