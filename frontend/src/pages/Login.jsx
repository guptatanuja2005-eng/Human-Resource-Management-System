import { useState } from "react";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [form, setForm] = useState({
    email: "",
    password: "",
    role: "employee",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleLogin = () => {
    console.log("Login Data:", form);
    alert(`Logged in as ${form.role}`);
  };

  return (
    <div className="h-screen flex items-center justify-center bg-gradient-to-r from-indigo-600 to-purple-600">

      <div className="bg-white w-full max-w-md p-8 rounded-2xl shadow-2xl">

        <h2 className="text-2xl font-bold text-center mb-6">
          HRMS Login
        </h2>

        {/* Email */}
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          className="w-full border p-3 rounded-lg mb-4 outline-none focus:ring-2 focus:ring-indigo-500"
        />

        {/* Password */}
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={form.password}
          onChange={handleChange}
          className="w-full border p-3 rounded-lg mb-4 outline-none focus:ring-2 focus:ring-indigo-500"
        />

        {/* Role Select */}
        <select
          name="role"
          value={form.role}
          onChange={handleChange}
          className="w-full border p-3 rounded-lg mb-6"
        >
          <option value="admin">Admin</option>
          <option value="employee">Employee</option>
        </select>

        {/* Button */}
        <button
          onClick={handleLogin}
          className="w-full bg-indigo-600 text-white py-3 rounded-lg hover:bg-indigo-700 transition"
        >
          Login
        </button>

        <p className="text-sm text-center mt-4 text-gray-500">
          Don’t have an account? Signup
        </p>

      </div>

    </div>
  );
};

export default Login;