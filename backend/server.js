const express = require("express");
const cors = require("cors");
require("dotenv").config();

const pool = require("./config/db");
const authRoutes = require("./routes/authRoutes");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);

app.get("/", (req, res) => {
    res.send("HRMS Backend Running 🚀");
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, async () => {
    try {
        await pool.query("SELECT NOW()");
        console.log("Connected to PostgreSQL");
        console.log(`Server running on port ${PORT}`);
    } catch (err) {
        console.error("DB connection failed", err);
    }
});