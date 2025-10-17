// src/components/DoctorDashboard.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";

const API_URL = "https://meditrack-backend-3uhu.onrender.com/api";

export default function DoctorDashboard() {
  const [patients, setPatients] = useState([]);
  const [doctor, setDoctor] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user && user.role === "doctor") {
      setDoctor(user);
      fetchPatients(user.id);
    } else {
      setLoading(false);
    }
  }, []);

  const fetchPatients = async (doctorId) => {
    try {
      const res = await axios.get(`${API_URL}/patients?doctorId=${doctorId}`);
      setPatients(res.data || []);
    } catch (err) {
      console.error("Failed to fetch patients:", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <p>Loading...</p>;
  if (!doctor) return <p>No doctor data found.</p>;

  return (
    <div className="dashboard-container">
      <h2>Doctor Dashboard</h2>
      <h3>Welcome, Dr. {doctor.username}</h3>

      <div className="stats">
        <p>Total Patients Assigned: {patients.length}</p>
      </div>

      <div className="patients-table">
        <h4>Assigned Patients</h4>
        {patients.length === 0 ? (
          <p>No patients assigned yet.</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Age</th>
                <th>Gender</th>
                <th>Room</th>
                <th>Sickness</th>
              </tr>
            </thead>
            <tbody>
              {patients.map((p) => (
                <tr key={p.id}>
                  <td>{p.id}</td>
                  <td>{p.name}</td>
                  <td>{p.age}</td>
                  <td>{p.gender}</td>
                  <td>{p.room}</td>
                  <td>{p.sickness}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
