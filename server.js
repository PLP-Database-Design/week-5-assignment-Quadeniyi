const express = require("express");
const mysql = require("mysql2");
const dotenv = require("dotenv");
const app = express();

// Load environment variables from .env file
dotenv.config();

// Middleware for parsing JSON
app.use(express.json());

// Database connection
const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

// Test database connection
db.connect((err) => {
  if (err) {
    console.error("Database connection failed:", err.stack);
    return;
  }
  console.log("Connected to MySQL database");
});

// 1. Retrieve all patients
app.get("/patients", (req, res) => {
  const query =
    "SELECT patient_id, first_name, last_name, date_of_birth FROM patients";
  db.query(query, (err, results) => {
    if (err) {
      res.status(500).json({ error: "Error retrieving patients" });
      return;
    }
    res.status(200).json(results);
  });
});

// 2. Retrieve all providers
app.get("/providers", (req, res) => {
  const query =
    "SELECT first_name, last_name, provider_specialty FROM providers";
  db.query(query, (err, results) => {
    if (err) {
      res.status(500).json({ error: "Error retrieving providers" });
      return;
    }
    res.status(200).json(results);
  });
});

// 3. Filter patients by First Name
app.get("/patients/:first_name", (req, res) => {
  const { first_name } = req.params;
  const query =
    "SELECT patient_id, first_name, last_name, date_of_birth FROM patients WHERE first_name = ?";
  db.query(query, [first_name], (err, results) => {
    if (err) {
      res
        .status(500)
        .json({ error: "Error retrieving patients by first name" });
      return;
    }
    res.status(200).json(results);
  });
});

// 4. Retrieve all providers by their specialty
app.get("/providers/specialty/:specialty", (req, res) => {
  const { specialty } = req.params;
  const query =
    "SELECT first_name, last_name, provider_specialty FROM providers WHERE provider_specialty = ?";
  db.query(query, [specialty], (err, results) => {
    if (err) {
      res
        .status(500)
        .json({ error: "Error retrieving providers by specialty" });
      return;
    }
    res.status(200).json(results);
  });
});

// Start the server
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
