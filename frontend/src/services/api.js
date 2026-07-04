import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:3000/api",
  withCredentials: true,
});

// 🔐 Attach JWT token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);



// ================= AUTH =================

export const signup = (data) => api.post("/auth/signup", data);

export const login = async (data) => {
  const res = await api.post("/auth/login", data);

  // store token
  localStorage.setItem("token", res.data.token);

  return res.data;
};

export const getProfile = () => api.get("/auth/profile");



// ================= EMPLOYEES =================
// (Only if your backend has this route)

export const getEmployees = () => api.get("/employees");



// ================= ATTENDANCE =================

export const checkIn = () => api.post("/attendance/checkin");

export const checkOut = () => api.post("/attendance/checkout");

export const getAttendance = () => api.get("/attendance");



// ================= LEAVE =================

export const applyLeave = (data) => api.post("/leave/apply", data);

export const getLeaves = () => api.get("/leave");

export const updateLeaveStatus = (id, status) =>
  api.put(`/leave/${id}`, { status });



// ================= PAYROLL =================
// (Only if backend exists)

export const getPayroll = () => api.get("/payroll");



// ✅ Export as object (IMPORTANT)
const apiService = {
  signup,
  login,
  getProfile,
  getEmployees,
  getAttendance,
  getLeaves,
  getPayroll,
  updateLeaveStatus,
};

export default apiService;