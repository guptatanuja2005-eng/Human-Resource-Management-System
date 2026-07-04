const express = require("express");

const router = express.Router();

const auth = require("../middleware/auth");
const admin = require("../middleware/admin");

const {
    getMyPayroll,
    getAllPayroll,
    updatePayroll
} = require("../controllers/payrollController");

router.get("/me", auth, getMyPayroll);

router.get("/", auth, admin, getAllPayroll);

router.put("/:id", auth, admin, updatePayroll);

module.exports = router;