import { Link, useNavigate } from "react-router-dom";

const Navbar = ({ token, handleLogout }) => {
  const navigate = useNavigate();

  const onLogout = () => {
    handleLogout();
    navigate("/");
  };

  return (
    <nav className="bg-indigo-600 text-white px-4 py-3 flex justify-between items-center">
      <Link to="/" className="text-xl font-semibold">MoodForge</Link>
      <div className="flex gap-4">
        {!token ? (
          <>
            <Link to="/login" className="hover:underline">Login</Link>
            <Link to="/register" className="hover:underline">Register</Link>
          </>
        ) : (
          <button onClick={onLogout} className="hover:underline">Logout</button>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
