import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Home } from "lucide-react";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // OPTIONAL backend call
      const response = await fetch("http://localhost:5000/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (response.ok) {
        const data = await response.json();
        
        // ✅ Store authentication token in localStorage
        // If your backend returns a token, use: localStorage.setItem("authToken", data.token);
        // For now, we'll store a simple flag
        localStorage.setItem("authToken", "logged-in");
        
        // Optional: Store user info
        if (data.user) {
          localStorage.setItem("userEmail", data.user.email);
        }

        alert("Login successful!");
        
        // ✅ Redirect to attendance page after successful login
        navigate("/attendance");
      } else {
        alert("Invalid credentials");
      }
    } catch (error) {
      console.error("Login failed:", error);
      
      // ✅ For testing without backend: Auto-login
      // Remove this in production!
      localStorage.setItem("authToken", "logged-in");
      localStorage.setItem("userEmail", email);
      alert("Login successful! (Demo mode)");
      navigate("/attendance");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-600 to-purple-700 p-4">
      {/* Home Button - Top Right */}
      <button
        onClick={() => navigate("/")}
        className="absolute top-6 right-6 flex items-center gap-2 bg-white/20 backdrop-blur-md text-white px-6 py-3 rounded-full
                   font-semibold transition-all duration-300
                   hover:bg-white hover:text-blue-600
                   hover:scale-105 hover:shadow-xl hover:shadow-white/30
                   border-2 border-white/30 hover:border-white
                   group z-10"
      >
        <Home className="w-5 h-5 transform group-hover:-translate-x-1 transition-transform duration-300" />
        <span>Home</span>
      </button>

      <div className="bg-white/20 backdrop-blur-xl p-10 rounded-3xl shadow-2xl w-full max-w-md border border-white/30">
        <h1 className="text-4xl font-extrabold text-white text-center mb-2">
          Attendance Logger
        </h1>
        <p className="text-center text-blue-100 mb-8">
          Team 12 – Login to continue
        </p>

        <form onSubmit={handleLogin} className="space-y-6">
          <input
            type="email"
            placeholder="Email"
            className="w-full p-3 rounded-xl outline-none focus:ring-2 focus:ring-blue-300"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <input
            type="password"
            placeholder="Password"
            className="w-full p-3 rounded-xl outline-none focus:ring-2 focus:ring-blue-300"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-white text-blue-700 py-3 rounded-xl font-bold text-lg hover:scale-105 transition-all disabled:opacity-60"
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>

        {/* Alternative: Home Link at Bottom */}
        <div className="mt-6 text-center">
          <button
            onClick={() => navigate("/")}
            className="text-white/80 hover:text-white font-medium transition-colors duration-300 flex items-center justify-center gap-2 mx-auto group"
          >
            <Home className="w-4 h-4 transform group-hover:-translate-x-1 transition-transform duration-300" />
            Back to Home
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;