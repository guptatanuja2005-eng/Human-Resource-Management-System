import { Routes, Route } from "react-router-dom";

import Login from "./pages/Login";
import Signup from "./pages/Signup";
import AdminDashboard from "./pages/AdminDashboard";
import EmployeeDashboard from "./pages/EmployeeDashboard";

import Employees from "./pages/Employees";
import Attendance from "./pages/Attendance";
import Leave from "./pages/Leave";
import Payroll from "./pages/Payroll";
import Profile from "./pages/Profile";

function App() {
  return (
    <Routes>

      {/* AUTH */}
      <Route path="/" element={<Login />} />
      <Route path="/signup" element={<Signup />} />

      {/* ADMIN */}
      <Route path="/admin" element={<AdminDashboard />} />
      <Route path="/employees" element={<Employees />} />
      <Route path="/payroll" element={<Payroll />} />

      {/* EMPLOYEE */}
      <Route path="/employee" element={<EmployeeDashboard />} />
      <Route path="/attendance" element={<Attendance />} />
      <Route path="/leave" element={<Leave />} />
      <Route path="/profile" element={<Profile />} />

    </Routes>
  );
}

export default App;