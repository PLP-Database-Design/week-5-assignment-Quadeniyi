const express = require("express");
const mysql = require("mysql2");
const dotenv = require("dotenv");
const app = express();

// Load environment variables
dotenv.config();

// Set up EJS as the templating engine
app.set("view engine", "ejs");

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
      return res.status(500).send("Database error");
    }
    // Render the results using an EJS template
    res.render("patients", { patients: results });
  });
});

// 2. Retrieve all providers
app.get("/providers", (req, res) => {
  const query =
    "SELECT first_name, last_name, provider_specialty FROM providers";
  db.query(query, (err, results) => {
    if (err) {
      return res.status(500).send("Database error");
    }
    // Render the results using an EJS template
    res.render("providers", { providers: results });
  });
});

// 3. Filter patients by First Name
app.get("/patients/filter", (req, res) => {
  const { firstName } = req.query;
  const query =
    "SELECT patient_id, first_name, last_name, date_of_birth FROM patients WHERE first_name = ?";

  db.query(query, [firstName], (err, results) => {
    if (err) {
      return res.status(500).send("Database error");
    }
    // Render the results using an EJS template
    res.render("filtered_patients", { patients: results, firstName });
  });
});

// 4. Retrieve all providers by their specialty
app.get("/providers/filter", (req, res) => {
  const { specialty } = req.query;
  const query =
    "SELECT first_name, last_name, provider_specialty FROM providers WHERE provider_specialty = ?";

  db.query(query, [specialty], (err, results) => {
    if (err) {
      return res.status(500).send("Database error");
    }
    // Render the results using an EJS template
    res.render("filtered_providers", { providers: results, specialty });
  });
});

// Start the server
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
