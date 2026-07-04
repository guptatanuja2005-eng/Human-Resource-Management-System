const pool = require("../config/db");
const bcrypt = require("bcrypt");
const validator = require("validator");
const jwt = require("jsonwebtoken");

// SIGNUP
const signup = async (req, res) => {
    const {
        name,
        email,
        password,
        role,
        phone,
        address,
        department,
        designation
    } = req.body;

    if (!name || !email || !password || !role) {
        return res.status(400).json({ message: "Required fields missing" });
    }

    if (!validator.isEmail(email)) {
        return res.status(400).json({ message: "Invalid email" });
    }

    if (password.length < 8) {
        return res.status(400).json({ message: "Password too short" });
    }

    if (!["admin", "employee"].includes(role)) {
        return res.status(400).json({ message: "Invalid role" });
    }

    try {
        const existing = await pool.query(
            "SELECT id FROM users WHERE email = $1",
            [email]
        );

        if (existing.rows.length > 0) {
            return res.status(409).json({ message: "Email already exists" });
        }

        const last = await pool.query(
            "SELECT employee_id FROM users ORDER BY id DESC LIMIT 1"
        );

        let employeeId = "EMP001";

        if (last.rows.length > 0) {
            const num = parseInt(last.rows[0].employee_id.replace("EMP", "")) + 1;
            employeeId = `EMP${String(num).padStart(3, "0")}`;
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const result = await pool.query(
            `INSERT INTO users 
            (employee_id, name, email, password, role, phone, address, department, designation)
            VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)
            RETURNING id, employee_id, name, email, role`,
            [
                employeeId,
                name,
                email,
                hashedPassword,
                role,
                phone || null,
                address || null,
                department || null,
                designation || null
            ]
        );

        return res.status(201).json({
            message: "User registered successfully",
            user: result.rows[0]
        });

    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Server error" });
    }
};


// LOGIN
const login = async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: "Email & password required" });
    }

    try {
        const result = await pool.query(
            "SELECT * FROM users WHERE email = $1",
            [email]
        );

        if (result.rows.length === 0) {
            return res.status(401).json({ message: "Invalid credentials" });
        }

        const user = result.rows[0];

        const match = await bcrypt.compare(password, user.password);

        if (!match) {
            return res.status(401).json({ message: "Invalid credentials" });
        }

        const token = jwt.sign(
            {
                id: user.id,
                role: user.role,
                employeeId: user.employee_id
            },
            process.env.JWT_SECRET,
            { expiresIn: "1d" }
        );

        return res.json({
            message: "Login successful",
            token,
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role,
                employeeId: user.employee_id
            }
        });

    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Server error" });
    }
};


// PROFILE (PROTECTED)
const getProfile = async (req, res) => {
    try {
        const userId = req.user.id;

        const result = await pool.query(
            `SELECT id, employee_id, name, email, role, phone, address, department, designation, created_at
             FROM users WHERE id = $1`,
            [userId]
        );

        return res.json({
            message: "Profile fetched",
            user: result.rows[0]
        });

    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Server error" });
    }
};

module.exports = { signup, login, getProfile };