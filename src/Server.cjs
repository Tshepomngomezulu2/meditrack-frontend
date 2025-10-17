const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const bcrypt = require("bcrypt");
const { Pool } = require("pg");

const app = express();
const port = 5000;

app.use(cors());
app.use(bodyParser.json());

// ------------------------
// PostgreSQL connection
// ------------------------
const pool = new Pool({
  user: "postgres",          // your DB user
  host: "localhost",
  database: "meditrack",     // your DB name
  password: "$N0wi3D4ys",    // your DB password
  port: 5432
});

// ------------------------
// USERS (signup/login)
// ------------------------

// Signup / Register
app.post("/api/register", async (req, res) => {
  const { username, password, role, key } = req.body; // frontend sends 'key' too
  if (!username || !password || !role || !key)
    return res.status(400).json({ message: "All fields are required." });

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const result = await pool.query(
      "INSERT INTO users (username, password, role) VALUES ($1,$2,$3) RETURNING id, role",
      [username, hashedPassword, role]
    );

    // ✅ Send clear success message and user info
    res.status(201).json({
      message: "Registration successful!",
      user: result.rows[0],
    });
  } catch (err) {
    console.error("Registration error:", err);
    // PostgreSQL duplicate username error (optional)
    if (err.code === "23505") {
      return res.status(400).json({ message: "Username already exists." });
    }
    res.status(500).json({ message: "Registration failed. Try again." });
  }
});

// Login
app.post("/api/login", async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password)
    return res.status(400).json({ message: "All fields are required." });

  try {
    const result = await pool.query("SELECT * FROM users WHERE username=$1", [username]);
    if (result.rows.length === 0)
      return res.status(400).json({ message: "User not found" });

    const user = result.rows[0];
    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(400).json({ message: "Incorrect password" });

    // ✅ Send clear success message
    res.json({
      message: "Login successful!",
      user: { id: user.id, username: user.username, role: user.role },
    });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ message: "Login failed. Try again." });
  }
});

// ------------------------
// PATIENTS
// ------------------------

// Get all patients (optionally filtered by doctorId or patientId)
app.get("/api/patients", async (req, res) => {
  const { doctorId, patientId } = req.query;
  try {
    let query = "SELECT * FROM patients";
    const values = [];

    if (doctorId) {
      query += " WHERE assigned_doctor_id=$1";
      values.push(doctorId);
    }

    const result = await pool.query(query, values);

    if (patientId) {
      const patient = result.rows.find(p => p.id == patientId);
      return res.json(patient ? [patient] : []);
    }

    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch patients" });
  }
});

// Add a patient
app.post("/api/patients", async (req, res) => {
  const { name, age, gender, room, sickness, assigned_doctor_id } = req.body;
  if (!name || !age || !gender || !room || !sickness || !assigned_doctor_id)
    return res.status(400).json({ message: "All fields required" });

  try {
    const result = await pool.query(
      "INSERT INTO patients (name, age, gender, room, sickness, assigned_doctor_id) VALUES ($1,$2,$3,$4,$5,$6) RETURNING *",
      [name, age, gender, room, sickness, assigned_doctor_id]
    );
    res.status(201).json({ message: "Patient added successfully!", patient: result.rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to add patient" });
  }
});

// ------------------------
// Start server
// ------------------------
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
