const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");
const bodyParser = require("body-parser");

const app = express();
app.use(cors());
app.use(bodyParser.json({ limit: "50mb" })); // Increased size limit for images

// 1. DATABASE CONNECTION
const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "Mohit@1234", // <--- REPLACE WITH YOUR REAL PASSWORD
  database: "movie_review_system",
});

db.connect((err) => {
  if (err) console.error("❌ DB Error:", err);
  else console.log("✅ MySQL Connected");
});

// --- ADMIN SYSTEM ---
const ADMIN_PASSWORD = "Admin@1234";

app.post("/api/admin/login", (req, res) => {
  if (req.body.password === ADMIN_PASSWORD) {
    res.json({ success: true, token: "admin-token-secret" });
  } else {
    res.status(401).json({ success: false, message: "Invalid Password" });
  }
});

// Advanced Stats with Date Filtering
app.get("/api/admin/stats", (req, res) => {
  const { filter, date } = req.query;
  let timeCondition = "";

  // MySQL Date Logic
  if (filter === "today") timeCondition = "WHERE DATE(created_at) = CURDATE()";
  else if (filter === "weekly")
    timeCondition = "WHERE created_at >= DATE_SUB(NOW(), INTERVAL 1 WEEK)";
  else if (filter === "monthly")
    timeCondition = "WHERE created_at >= DATE_SUB(NOW(), INTERVAL 1 MONTH)";
  else if (filter === "yearly")
    timeCondition = "WHERE created_at >= DATE_SUB(NOW(), INTERVAL 1 YEAR)";
  else if (filter === "date" && date)
    timeCondition = `WHERE DATE(created_at) = '${date}'`;

  const sqlReviews = `SELECT COUNT(*) as count FROM reviews ${timeCondition}`;
  const sqlBlogs = `SELECT COUNT(*) as count FROM blogs ${timeCondition}`;

  db.query(sqlReviews, (err, rRes) => {
    if (err) return res.status(500).json(err);
    db.query(sqlBlogs, (err, bRes) => {
      if (err) return res.status(500).json(err);
      res.json({ reviews: rRes[0].count, blogs: bRes[0].count });
    });
  });
});

// Fetch Content (Reviews + Blogs)
app.get("/api/admin/content", (req, res) => {
  const q1 =
    "SELECT id, user_name, 'Review' as type, comment as content, created_at FROM reviews ORDER BY created_at DESC";
  const q2 =
    "SELECT id, user_name, 'Blog' as type, title as content, created_at FROM blogs ORDER BY created_at DESC";

  db.query(q1, (err, reviews) => {
    if (err) return res.status(500).json(err);
    db.query(q2, (err, blogs) => {
      if (err) return res.status(500).json(err);
      res.json([...reviews, ...blogs]); // Combine arrays
    });
  });
});

// Delete Content
app.delete("/api/admin/delete/:type/:id", (req, res) => {
  const { type, id } = req.params;
  const table = type === "Review" ? "reviews" : "blogs";
  db.query(`DELETE FROM ${table} WHERE id = ?`, [id], (err, result) => {
    if (err) return res.status(500).json(err);
    res.json({ success: true });
  });
});

// --- PUBLIC API ---

// Reviews
app.get("/reviews/:imdbId", (req, res) => {
  db.query(
    "SELECT * FROM reviews WHERE movie_imdb_id = ? ORDER BY created_at DESC",
    [req.params.imdbId],
    (err, results) => res.json(results),
  );
});

app.post("/add-review", (req, res) => {
  const { movie_imdb_id, user_name, rating, comment } = req.body;
  db.query(
    "INSERT INTO reviews (movie_imdb_id, user_name, rating, comment) VALUES (?, ?, ?, ?)",
    [movie_imdb_id, user_name, rating, comment],
    (err) => {
      if (err) return res.status(500).json(err);
      res.json({ success: true });
    },
  );
});

// Blogs
app.get("/api/blogs", (req, res) => {
  db.query("SELECT * FROM blogs ORDER BY created_at DESC", (err, results) =>
    res.json(results),
  );
});

app.post("/api/blogs", (req, res) => {
  const { user_name, title, content, media } = req.body;
  db.query(
    "INSERT INTO blogs (user_name, title, content, media_url) VALUES (?, ?, ?, ?)",
    [user_name, title, content, media],
    (err) => {
      if (err) return res.status(500).json(err);
      res.json({ success: true });
    },
  );
});

// OTP Simulation
const otpStore = {};
app.post("/api/send-otp", (req, res) => {
  const otp = Math.floor(1000 + Math.random() * 9000);
  otpStore[req.body.phone] = otp;
  console.log(`\n📲 OTP for ${req.body.phone}: ${otp}\n`);
  res.json({ success: true });
});

app.post("/api/verify-otp", (req, res) => {
  if (otpStore[req.body.phone] == req.body.code) {
    delete otpStore[req.body.phone];
    res.json({ success: true });
  } else res.status(400).json({ success: false });
});

app.listen(3000, () => console.log("🚀 Server running on port 3000"));
