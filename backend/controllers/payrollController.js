const pool = require("../config/db");

// Employee - View own payroll
const getMyPayroll = async (req, res) => {
    try {
        const userId = req.user.id;

        const result = await pool.query(
            `SELECT *
             FROM payroll
             WHERE user_id = $1
             ORDER BY id DESC`,
            [userId]
        );

        res.status(200).json(result.rows);

    } catch (err) {
        console.error(err);

        res.status(500).json({
            message: "Server Error"
        });
    }
};

// Admin - View all payroll
const getAllPayroll = async (req, res) => {

    try {

        const result = await pool.query(
            `SELECT
                payroll.*,
                users.name,
                users.employee_id
             FROM payroll
             JOIN users
             ON payroll.user_id = users.id
             ORDER BY payroll.id DESC`
        );

        res.status(200).json(result.rows);

    } catch (err) {

        console.error(err);

        res.status(500).json({
            message: "Server Error"
        });

    }

};

// Admin - Update payroll
const updatePayroll = async (req, res) => {

    const payrollId = req.params.id;

    const {
        basic_salary,
        bonus,
        deduction
    } = req.body;

    try {

        const net_salary =
            Number(basic_salary) +
            Number(bonus || 0) -
            Number(deduction || 0);

        const result = await pool.query(
            `UPDATE payroll
             SET
             basic_salary = $1,
             bonus = $2,
             deduction = $3,
             net_salary = $4
             WHERE id = $5
             RETURNING *`,
            [
                basic_salary,
                bonus,
                deduction,
                net_salary,
                payrollId
            ]
        );

        if (result.rows.length === 0) {

            return res.status(404).json({
                message: "Payroll record not found."
            });

        }

        res.status(200).json({
            message: "Payroll updated successfully.",
            payroll: result.rows[0]
        });

    } catch (err) {

        console.error(err);

        res.status(500).json({
            message: "Server Error"
        });

    }

};

module.exports = {
    getMyPayroll,
    getAllPayroll,
    updatePayroll
};