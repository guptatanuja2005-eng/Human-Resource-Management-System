const pool = require("../config/db");

// CHECK-IN
const checkIn = async (req, res) => {
    const userId = req.user.id;
    const today = new Date().toISOString().split("T")[0];

    try {
        // prevent double check-in
        const existing = await pool.query(
            "SELECT * FROM attendance WHERE user_id=$1 AND attendance_date=$2",
            [userId, today]
        );

        if (existing.rows.length > 0) {
            return res.status(400).json({
                message: "Already checked in today"
            });
        }

        const result = await pool.query(
            `INSERT INTO attendance (user_id, attendance_date, check_in, status)
             VALUES ($1, $2, NOW(), 'Present')
             RETURNING *`,
            [userId, today]
        );

        return res.json({
            message: "Check-in successful",
            attendance: result.rows[0]
        });

    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Server error" });
    }
};

// CHECK-OUT
const checkOut = async (req, res) => {
    const userId = req.user.id;
    const today = new Date().toISOString().split("T")[0];

    try {
        const existing = await pool.query(
            "SELECT * FROM attendance WHERE user_id=$1 AND attendance_date=$2",
            [userId, today]
        );

        if (existing.rows.length === 0) {
            return res.status(400).json({
                message: "You must check in first"
            });
        }

        const result = await pool.query(
            `UPDATE attendance
             SET check_out = NOW()
             WHERE user_id=$1 AND attendance_date=$2
             RETURNING *`,
            [userId, today]
        );

        return res.json({
            message: "Check-out successful",
            attendance: result.rows[0]
        });

    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Server error" });
    }
};

// GET ATTENDANCE
const getAttendance = async (req, res) => {
    const userId = req.user.id;

    try {
        const result = await pool.query(
            `SELECT * FROM attendance
             WHERE user_id=$1
             ORDER BY attendance_date DESC`,
            [userId]
        );

        return res.json({
            message: "Attendance fetched",
            attendance: result.rows
        });

    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Server error" });
    }
};

module.exports = {
    checkIn,
    checkOut,
    getAttendance
};