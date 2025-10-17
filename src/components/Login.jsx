// src/components/Login.jsx
import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

// Use environment variable for backend URL
const API_URL =
  process.env.REACT_APP_API_URL || "http://localhost:5000/api";

export default function Login() {
  const [form, setForm] = useState({ username: "", password: "" });
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    if (!form.username || !form.password) {
      setMessage("Username and password are required.");
      return;
    }

    try {
      const response = await axios.post(`${API_URL}/login`, form);
      const resData = response.data;

      if (resData?.id) {
        const role = resData.role?.toLowerCase();
        localStorage.setItem("user", JSON.stringify(resData));
        setMessage("Login successful!");

        if (role === "doctor") navigate("/DoctorDashboard");
        else if (role === "admin") navigate("/AdminDashboard");
        else if (role === "patient") navigate(`/PatientDashboard/${resData.id}`);
        else navigate("/");
      } else {
        setMessage(resData?.message || "Login failed. Try again.");
      }
    } catch (err) {
      const msg =
        err.response?.data?.message ||
        "Login failed. Try again. Check your backend URL.";
      setMessage(msg);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2 className="auth-title">Login</h2>
        <form className="auth-form" onSubmit={handleSubmit}>
          <label className="auth-label">Username</label>
          <input
            className="auth-input"
            type="text"
            name="username"
            value={form.username}
            onChange={handleChange}
            required
          />
          <label className="auth-label">Password</label>
          <input
            className="auth-input"
            type="password"
            name="password"
            value={form.password}
            onChange={handleChange}
            required
          />
          <button type="submit" className="auth-btn login-btn">
            Login
          </button>
        </form>

        <button
          style={{ marginTop: "15px" }}
          className="auth-btn signup-btn"
          onClick={() => navigate("/signup")}
        >
          Register
        </button>

        {message && (
          <p
            style={{
              marginTop: "15px",
              color: message.includes("successful") ? "green" : "red"
            }}
          >
            {message}
          </p>
        )}
      </div>
    </div>
  );
}
