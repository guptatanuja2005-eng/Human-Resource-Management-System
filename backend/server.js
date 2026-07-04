const express = require("express");
const cors = require("cors");
require("dotenv").config();

const pool = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const attendanceRoutes = require("./routes/attendanceRoutes");
const leaveRoutes = require("./routes/leaveRoutes");
const payrollRoutes = require("./routes/payrollRoutes");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/attendance", attendanceRoutes);
app.use("/api/leave", leaveRoutes);
app.use("/api/payroll", payrollRoutes);

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