import { useState, useEffect } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import Navbar from "./components/Navbar";
import LoginForm from "./components/LoginForm";
import RegisterForm from "./components/RegisterForm";
import HomePage from "./pages/HomePage";

function App() {
  const [token, setToken] = useState(localStorage.getItem("token"));
  const isAuthenticated = !!token;
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    setToken(null);
    navigate("/");
  };

  useEffect(() => {
    if (token) {
      localStorage.setItem("token", token);
    }
  }, [token]);

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar isAuthenticated={isAuthenticated} token={token} handleLogout={handleLogout} />

      <Routes>
        <Route path="/" element={<HomePage isAuthenticated={isAuthenticated} />} />
        <Route path="/login" element={<LoginForm setToken={setToken} />} />
        <Route path="/register" element={<RegisterForm setToken={setToken} />} />
      </Routes>
    </div>
  );
}

export default App;
