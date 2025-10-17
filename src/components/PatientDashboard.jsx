import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const API_URL = "https://meditrack-backend-3uhu.onrender.com/api";

export default function PatientDashboard() {
  const navigate = useNavigate();
  const [patient, setPatient] = useState({});
  const [appointments, setAppointments] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user) return navigate("/login");

    const fetchData = async () => {
      try {
        const patientRes = await axios.get(`${API_URL}/patients?patientId=${user.id}`);
        setPatient(patientRes.data[0] || {});

        const appointmentRes = await axios.get(`${API_URL}/appointments?patientId=${user.id}`);
        setAppointments(appointmentRes.data || []);
      } catch (err) {
        setError("Failed to fetch patient data");
      }
    };

    fetchData();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Patient Dashboard</h2>
      <button onClick={handleLogout}>Logout</button>
      {error && <p style={{ color: "red" }}>{error}</p>}

      <h3>My Info</h3>
      <table border="1" cellPadding="5">
        <tbody>
          <tr><td>ID</td><td>{patient.id}</td></tr>
          <tr><td>Name</td><td>{patient.name}</td></tr>
          <tr><td>Age</td><td>{patient.age}</td></tr>
          <tr><td>Gender</td><td>{patient.gender}</td></tr>
          <tr><td>Room</td><td>{patient.room}</td></tr>
          <tr><td>Sickness</td><td>{patient.sickness}</td></tr>
        </tbody>
      </table>

      <h3>Appointments</h3>
      <table border="1" cellPadding="5">
        <thead>
          <tr>
            <th>ID</th><th>Doctor ID</th><th>Start Time</th><th>Status</th>
          </tr>
        </thead>
        <tbody>
          {appointments.map(a => (
            <tr key={a.id}>
              <td>{a.id}</td><td>{a.doctor_id}</td><td>{a.start_time}</td><td>{a.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
