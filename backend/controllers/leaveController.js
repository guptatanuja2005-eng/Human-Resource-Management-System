const pool = require("../config/db");

// APPLY LEAVE
const applyLeave = async (req, res) => {
    const userId = req.user.id;
    const { leaveType, startDate, endDate, reason } = req.body;

    if (!leaveType || !startDate || !endDate) {
        return res.status(400).json({
            message: "Required fields missing"
        });
    }

    try {
        const result = await pool.query(
            `INSERT INTO leave_requests 
            (user_id, leave_type, start_date, end_date, reason)
            VALUES ($1,$2,$3,$4,$5)
            RETURNING *`,
            [userId, leaveType, startDate, endDate, reason || null]
        );

        return res.json({
            message: "Leave applied successfully",
            leave: result.rows[0]
        });

    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Server error" });
    }
};

// GET MY LEAVES
const getMyLeaves = async (req, res) => {
    const userId = req.user.id;

    try {
        const result = await pool.query(
            `SELECT * FROM leave_requests
             WHERE user_id=$1
             ORDER BY created_at DESC`,
            [userId]
        );

        return res.json({
            message: "Leaves fetched",
            leaves: result.rows
        });

    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Server error" });
    }
};

module.exports = {
    applyLeave,
    getMyLeaves
};