const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");
const path = require("path");

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "WJ28@krhps",
  database: "event_registration_db"
});

db.connect((err) => {
  if (err) {
    console.error("MySQL connection failed:", err);
    return;
  }
  console.log("Connected to MySQL database");
});

app.post("/register", (req, res) => {
  const { fullName, eventName, studentId, department, email, year, notes } = req.body;

  const sql = `
    INSERT INTO registrations
    (full_name, event_name, student_id, department, email, year, notes)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `;

  db.query(
    sql,
    [fullName, eventName, studentId, department, email, year, notes],
    (err, result) => {
      if (err) {
        console.error("Insert error:", err);
        return res.status(500).json({ message: "Database error" });
      }

      res.json({ message: "Registration successful" });
    }
  );
});
app.get("/registrations", (req, res) => {
  const sql = "SELECT * FROM registrations ORDER BY id DESC";

  db.query(sql, (err, results) => {
    if (err) {
      console.error("Fetch error:", err);
      return res.status(500).json({ message: "Database error" });
    }

    res.json(results);
  });
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});