import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "./Auth.css";

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [isAdminLogin, setIsAdminLogin] = useState(false);

  // Redirect after login
  const from = location.state?.from?.pathname || "/";

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!formData.email || !formData.password) {
      setError("Please enter both email and password.");
      return;
    }

    try {
      setLoading(true);

      // Call login function from AuthContext with admin toggle
      const result = await login(formData.email, formData.password, isAdminLogin);

      if (result.success) {
        // Redirect based on role
        if (result.user.isAdmin) {
          navigate("/admin/dashboard");
        } else {
          navigate(from);
        }
      } else {
        setError(result.message || "Invalid email or password.");
      }
    } catch (err) {
      console.error(err);
      setError("Something went wrong. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>{isAdminLogin ? "Admin Login" : "Login to BookNGo"}</h2>

        {error && <div className="error-message">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              placeholder="your@email.com"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              required
            />
          </div>

          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              placeholder="Enter password"
              value={formData.password}
              onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })
              }
              required
            />
          </div>
          {/* <div className="form-group">
            <label className="checkbox-label">
              <input
                type="checkbox"
                checked={isAdminLogin}
                onChange={() => setIsAdminLogin(!isAdminLogin)}
              />
              Login as Admin
            </label>
          </div> */}


          <button type="submit" className="auth-btn" disabled={loading}>
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        {!isAdminLogin && (
          <p className="auth-link">
            Don’t have an account?{" "}
            <Link to="/register" state={{ from }}>
              Register here
            </Link>
          </p>
        )}
      </div>
    </div>
  );
};

export default Login;
