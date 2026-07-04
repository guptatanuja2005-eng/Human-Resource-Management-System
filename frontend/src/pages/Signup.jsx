import { useState } from "react";

const Signup = () => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "employee",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSignup = () => {
    console.log("Signup Data:", form);
    alert("Account Created Successfully");
  };

  return (
    <div className="h-screen flex items-center justify-center bg-gradient-to-r from-purple-600 to-pink-500">

      <div className="bg-white w-full max-w-md p-8 rounded-2xl shadow-2xl">

        <h2 className="text-2xl font-bold text-center mb-6">
          Create Account
        </h2>

        {/* Name */}
        <input
          type="text"
          name="name"
          placeholder="Full Name"
          value={form.name}
          onChange={handleChange}
          className="w-full border p-3 rounded-lg mb-4 outline-none focus:ring-2 focus:ring-purple-500"
        />

        {/* Email */}
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          className="w-full border p-3 rounded-lg mb-4 outline-none focus:ring-2 focus:ring-purple-500"
        />

        {/* Password */}
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={form.password}
          onChange={handleChange}
          className="w-full border p-3 rounded-lg mb-4 outline-none focus:ring-2 focus:ring-purple-500"
        />

        {/* Role */}
        <select
          name="role"
          value={form.role}
          onChange={handleChange}
          className="w-full border p-3 rounded-lg mb-6"
        >
          <option value="employee">Employee</option>
          <option value="admin">Admin</option>
        </select>

        {/* Button */}
        <button
          onClick={handleSignup}
          className="w-full bg-purple-600 text-white py-3 rounded-lg hover:bg-purple-700 transition"
        >
          Sign Up
        </button>

        <p className="text-sm text-center mt-4 text-gray-500">
          Already have an account? Login
        </p>

      </div>

    </div>
  );
};

export default Signup;