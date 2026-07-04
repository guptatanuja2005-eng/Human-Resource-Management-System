const express = require("express");
const router = express.Router();

const auth = require("../middleware/auth");
const {
    checkIn,
    checkOut,
    getAttendance
} = require("../controllers/attendanceController");

router.post("/checkin", auth, checkIn);
router.post("/checkout", auth, checkOut);
router.get("/", auth, getAttendance);

module.exports = router;