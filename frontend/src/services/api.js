import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:3000/api",
});

// Attach JWT token automatically
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

// ================= AUTH =================

export const signup = async (userData) => {
  const res = await api.post("/auth/signup", userData);
  return res.data;
};

export const login = async (email, password) => {
  const res = await api.post("/auth/login", {
    email,
    password,
  });

  return res.data;
};

export const getProfile = async () => {
  const res = await api.get("/auth/profile");
  return res.data;
};

// ================= ATTENDANCE =================

export const getAttendance = async () => {
  const res = await api.get("/attendance");
  return res.data.attendance;
};

export const checkIn = async () => {
  const res = await api.post("/attendance/checkin");
  return res.data;
};

export const checkOut = async () => {
  const res = await api.post("/attendance/checkout");
  return res.data;
};

// ================= LEAVE =================

export const applyLeave = async (data) => {
  const res = await api.post("/leave/apply", data);
  return res.data;
};

export const getLeaves = async () => {
  const res = await api.get("/leave");
  return res.data.leaves;
};

export const updateLeaveStatus = async (id, status) => {
  const res = await api.put(`/leave/${id}`, { status });
  return res.data;
};

// ================= PAYROLL =================

export const getPayroll = async () => {
  const res = await api.get("/payroll/me");
  return res.data;
};

export default {
  signup,
  login,
  getProfile,
  getAttendance,
  checkIn,
  checkOut,
  applyLeave,
  getLeaves,
  updateLeaveStatus,
  getPayroll,
};