// src/pages/AdminDashboard.jsx
import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../App.css";

const API_URL = "https://meditrack-backend-3uhu.onrender.com/api";

export default function AdminDashboard() {
  const [stats, setStats] = useState({ patients: 0, doctors: 0, appointments: 0, reports: 0 });
  const [showPatientForm, setShowPatientForm] = useState(false);
  const [patientDetails, setPatientDetails] = useState({ name: "", dob: "", diagnosis: "", notes: "" });
  const navigate = useNavigate();

  // Fetch stats
  const fetchStats = async () => {
    try {
      const patientsRes = await axios.get(`${API_URL}/patients`);
      const doctorsRes = await axios.get(`${API_URL}/users?role=doctor`);
      const appointmentsRes = await axios.get(`${API_URL}/appointments`);
      const reportsRes = []; // Reports API not implemented

      setStats({
        patients: patientsRes.data.length,
        doctors: doctorsRes.data.length,
        appointments: appointmentsRes.data.length,
        reports: reportsRes.length
      });
    } catch (err) {
      console.error("Failed to fetch stats", err);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  const handleFormChange = (e) =>
    setPatientDetails({ ...patientDetails, [e.target.name]: e.target.value });

  const handlePatientSubmit = async (e) => {
    e.preventDefault();

    try {
      // Get all doctors & patients
      const doctorsRes = await axios.get(`${API_URL}/users?role=doctor`);
      const patientsRes = await axios.get(`${API_URL}/patients`);
      const doctors = doctorsRes.data;

      // Count patients per doctor
      const doctorCounts = doctors.map((doc) => ({
        id: doc.id,
        count: patientsRes.data.filter((p) => p.assigned_doctor_id === doc.id).length
      }));

      // Assign doctor with least patients
      doctorCounts.sort((a, b) => a.count - b.count);
      const assignedDoctorId = doctorCounts[0]?.id || 1;

      // Assign random room 1-5
      const roomNumber = `Room ${Math.floor(Math.random() * 5) + 1}`;

      await axios.post(`${API_URL}/patients`, {
        name: patientDetails.name,
        age: 30, // Placeholder
        gender: "Male", // Placeholder
        room: roomNumber,
        sickness: patientDetails.diagnosis,
        assigned_doctor_id: assignedDoctorId
      });

      alert("Patient details saved successfully!");
      setPatientDetails({ name: "", dob: "", diagnosis: "", notes: "" });
      setShowPatientForm(false);

      fetchStats(); // Refresh admin stats
    } catch (err) {
      console.error(err);
      alert("Failed to save patient details.");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <div className="app-container">
      <aside className="sidebar">
        <div className="sidebar-title">Admin Panel</div>
        <ul className="sidebar-menu">
          <li>
            <button className="home-btn login-btn" style={{ width: "100%" }} onClick={fetchStats}>
              Refresh Dashboard
            </button>
          </li>
          <li>
            <button className="home-btn signup-btn" style={{ width: "100%" }} onClick={() => setShowPatientForm((v) => !v)}>
              Enter Patient Details
            </button>
          </li>
        </ul>
        <button className="logout-btn" onClick={handleLogout}>Logout</button>
      </aside>

      <main className="main-section">
        <div className="content-area">
          <div className="dashboard-header">
            <h2>Admin Dashboard</h2>
            <p className="dashboard-placeholder">Welcome, Admin! Here are your hospital stats and quick actions.</p>
          </div>

          <div className="dashboard-cards">
            {Object.entries(stats).map(([key, value]) => (
              <div className="stat-card" key={key}>
                <div className="stat-card-info">
                  <h3>{key.charAt(0).toUpperCase() + key.slice(1)}</h3>
                  <p>{value}</p>
                </div>
              </div>
            ))}
          </div>

          {showPatientForm && (
            <form
              className="auth-form"
              style={{ maxWidth: 400, margin: "30px auto", background: "#fff", padding: "24px", borderRadius: "12px", boxShadow: "0 2px 8px rgba(0,0,0,0.07)" }}
              onSubmit={handlePatientSubmit}
            >
              <h3 style={{ color: "var(--primary-color)", marginBottom: 16 }}>Enter Patient Sensitive Details</h3>
              <label className="auth-label">Full Name</label>
              <input className="auth-input" type="text" name="name" value={patientDetails.name} onChange={handleFormChange} required />
              <label className="auth-label">Date of Birth</label>
              <input className="auth-input" type="date" name="dob" value={patientDetails.dob} onChange={handleFormChange} required />
              <label className="auth-label">Diagnosis</label>
              <input className="auth-input" type="text" name="diagnosis" value={patientDetails.diagnosis} onChange={handleFormChange} required />
              <label className="auth-label">Notes</label>
              <textarea className="auth-input" name="notes" value={patientDetails.notes} onChange={handleFormChange} rows={3} />
              <button type="submit" className="auth-btn login-btn" style={{ marginTop: 16 }}>Submit</button>
            </form>
          )}
        </div>
      </main>
    </div>
  );
}
