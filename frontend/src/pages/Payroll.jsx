import { useState } from "react";
import Layout from "../components/Layout";

const Payroll = () => {
  const [payroll] = useState([
    {
      id: 1,
      name: "Rahul Sharma",
      role: "Developer",
      salary: 50000,
      status: "Paid",
    },
    {
      id: 2,
      name: "Priya Singh",
      role: "HR Manager",
      salary: 60000,
      status: "Pending",
    },
    {
      id: 3,
      name: "Aman Gupta",
      role: "Designer",
      salary: 45000,
      status: "Paid",
    },
  ]);

  return (
    <Layout role="admin">

      <h1 className="text-2xl font-bold mb-6">
        Payroll Management
      </h1>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">

        <div className="bg-white p-5 rounded-xl shadow">
          <p className="text-gray-500 text-sm">Total Payroll</p>
          <h2 className="text-2xl font-bold text-indigo-600">₹1,55,000</h2>
        </div>

        <div className="bg-white p-5 rounded-xl shadow">
          <p className="text-gray-500 text-sm">Paid Employees</p>
          <h2 className="text-2xl font-bold text-green-600">2</h2>
        </div>

        <div className="bg-white p-5 rounded-xl shadow">
          <p className="text-gray-500 text-sm">Pending Payments</p>
          <h2 className="text-2xl font-bold text-red-500">1</h2>
        </div>

      </div>

      {/* Payroll Table */}
      <div className="bg-white rounded-xl shadow overflow-x-auto">

        <table className="w-full text-left">

          <thead className="bg-gray-100">
            <tr>
              <th className="p-3">Employee</th>
              <th className="p-3">Role</th>
              <th className="p-3">Salary</th>
              <th className="p-3">Status</th>
              <th className="p-3">Action</th>
            </tr>
          </thead>

          <tbody>
            {payroll.map((emp) => (
              <tr key={emp.id} className="border-b">

                <td className="p-3 font-medium">{emp.name}</td>
                <td className="p-3">{emp.role}</td>
                <td className="p-3">₹{emp.salary}</td>

                <td className="p-3">
                  <span
                    className={`px-3 py-1 rounded-full text-white text-sm ${
                      emp.status === "Paid"
                        ? "bg-green-500"
                        : "bg-yellow-500"
                    }`}
                  >
                    {emp.status}
                  </span>
                </td>

                <td className="p-3">
                  <button className="bg-indigo-600 text-white px-3 py-1 rounded-lg text-sm">
                    View Payslip
                  </button>
                </td>

              </tr>
            ))}
          </tbody>

        </table>

      </div>

    </Layout>
  );
};

export default Payroll;