import { useState } from "react";
import Layout from "../components/Layout";

const Leave = () => {
  const [leaves, setLeaves] = useState([
    {
      id: 1,
      name: "Rahul Sharma",
      reason: "Fever",
      days: 2,
      status: "Pending",
    },
    {
      id: 2,
      name: "Priya Singh",
      reason: "Family function",
      days: 1,
      status: "Approved",
    },
  ]);

  const [form, setForm] = useState({
    reason: "",
    days: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Apply Leave (Employee)
  const applyLeave = () => {
    if (!form.reason || !form.days) return;

    const newLeave = {
      id: Date.now(),
      name: "You",
      reason: form.reason,
      days: form.days,
      status: "Pending",
    };

    setLeaves([newLeave, ...leaves]);
    setForm({ reason: "", days: "" });
  };

  // Update status (Admin action)
  const updateStatus = (id, newStatus) => {
    setLeaves(
      leaves.map((leave) =>
        leave.id === id ? { ...leave, status: newStatus } : leave
      )
    );
  };

  return (
    <Layout role="employee">

      <h1 className="text-2xl font-bold mb-6">
        Leave Management
      </h1>

      {/* APPLY LEAVE FORM (Employee) */}
      <div className="bg-white p-5 rounded-xl shadow mb-6 grid grid-cols-1 md:grid-cols-3 gap-4">

        <input
          type="text"
          name="reason"
          value={form.reason}
          onChange={handleChange}
          placeholder="Reason for leave"
          className="border p-2 rounded-lg"
        />

        <input
          type="number"
          name="days"
          value={form.days}
          onChange={handleChange}
          placeholder="No. of days"
          className="border p-2 rounded-lg"
        />

        <button
          onClick={applyLeave}
          className="bg-indigo-600 text-white rounded-lg"
        >
          Apply Leave
        </button>

      </div>

      {/* LEAVE TABLE */}
      <div className="bg-white rounded-xl shadow overflow-x-auto">

        <table className="w-full text-left">

          <thead className="bg-gray-100">
            <tr>
              <th className="p-3">Employee</th>
              <th className="p-3">Reason</th>
              <th className="p-3">Days</th>
              <th className="p-3">Status</th>
              <th className="p-3">Action</th>
            </tr>
          </thead>

          <tbody>
            {leaves.map((leave) => (
              <tr key={leave.id} className="border-b">

                <td className="p-3">{leave.name}</td>
                <td className="p-3">{leave.reason}</td>
                <td className="p-3">{leave.days}</td>

                <td className="p-3">
                  <span
                    className={`px-3 py-1 rounded-full text-white text-sm ${
                      leave.status === "Approved"
                        ? "bg-green-500"
                        : leave.status === "Rejected"
                        ? "bg-red-500"
                        : "bg-yellow-500"
                    }`}
                  >
                    {leave.status}
                  </span>
                </td>

                <td className="p-3 flex gap-2">

                  <button
                    onClick={() => updateStatus(leave.id, "Approved")}
                    className="bg-green-500 text-white px-3 py-1 rounded text-sm"
                  >
                    Approve
                  </button>

                  <button
                    onClick={() => updateStatus(leave.id, "Rejected")}
                    className="bg-red-500 text-white px-3 py-1 rounded text-sm"
                  >
                    Reject
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

export default Leave;