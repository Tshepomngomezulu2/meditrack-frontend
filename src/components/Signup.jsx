import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const API_URL = "https://meditrack-backend-3uhu.onrender.com/api";

const Signup = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    username: "",
    password: "",
    role: "",
    key: ""
  });

  const [message, setMessage] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setIsSuccess(false);

    const { username, password, role, key } = form;

    // Basic validation
    if (!username || !password || !role || !key) {
      setMessage("All fields are required.");
      return;
    }

    // Role-specific key validation
    if (role === "doctor" && key !== "CMPG224") {
      setMessage("Invalid Doctor key. Registration denied.");
      return;
    }

    if (role === "admin" && key !== "ADMIN123") {
      setMessage("Invalid Admin key. Registration denied.");
      return;
    }

    try {
      const res = await axios.post(`${API_URL}/register`, { username, password, role });

      setMessage(res.data.message || "Registration successful!");
      setIsSuccess(true);

      // Clear form
      setForm({ username: "", password: "", role: "", key: "" });

      // Redirect based on role after a short delay
      setTimeout(() => {
        if (role === "doctor") navigate("/DoctorDashboard");
        else if (role === "admin") navigate("/AdminDashboard");
      }, 1000);

    } catch (err) {
      if (err.response?.data?.message) setMessage(err.response.data.message);
      else setMessage("Registration failed. Try again.");
      setIsSuccess(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2 className="auth-title">Register</h2>
        <form onSubmit={handleSubmit} className="auth-form">
          <input
            name="username"
            placeholder="Username"
            value={form.username}
            onChange={handleChange}
            className="auth-input"
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            className="auth-input"
            required
          />
          <select
            name="role"
            value={form.role}
            onChange={handleChange}
            className="auth-input"
            required
          >
            <option value="">Select Role</option>
            <option value="doctor">Doctor</option>
            <option value="admin">Admin</option>
          </select>
          <input
            name="key"
            placeholder="Hospital/Admin Key"
            value={form.key}
            onChange={handleChange}
            className="auth-input"
            required
          />
          <button type="submit" className="auth-btn signup-btn">
            Register
          </button>
        </form>
        {message && (
          <p style={{ marginTop: "12px", color: isSuccess ? "green" : "red" }}>
            {message}
          </p>
        )}
      </div>
    </div>
  );
};

export default Signup;
