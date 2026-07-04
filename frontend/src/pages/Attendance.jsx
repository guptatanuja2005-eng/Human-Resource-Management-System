import { useState } from "react";
import Layout from "../components/Layout";

const Attendance = () => {
  const [attendance, setAttendance] = useState([
    { date: "2026-07-01", status: "Present" },
    { date: "2026-07-02", status: "Present" },
    { date: "2026-07-03", status: "Absent" },
    { date: "2026-07-04", status: "Present" },
  ]);

  const [status, setStatus] = useState("Present");

  // Mark attendance (frontend only)
  const markAttendance = () => {
    const today = new Date().toISOString().split("T")[0];

    const exists = attendance.find((a) => a.date === today);
    if (exists) return;

    setAttendance([
      { date: today, status },
      ...attendance,
    ]);
  };

  return (
    <Layout role="employee">

      <h1 className="text-2xl font-bold mb-6">
        Attendance
      </h1>

      {/* Mark Attendance Box */}
      <div className="bg-white p-5 rounded-xl shadow mb-6 flex flex-col md:flex-row gap-4 items-center">

        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="border p-2 rounded-lg"
        >
          <option value="Present">Present</option>
          <option value="Absent">Absent</option>
        </select>

        <button
          onClick={markAttendance}
          className="bg-indigo-600 text-white px-5 py-2 rounded-lg"
        >
          Mark Attendance
        </button>

      </div>

      {/* Attendance Table */}
      <div className="bg-white rounded-xl shadow overflow-hidden">

        <table className="w-full text-left">

          <thead className="bg-gray-100">
            <tr>
              <th className="p-3">Date</th>
              <th className="p-3">Status</th>
            </tr>
          </thead>

          <tbody>
            {attendance.map((item, index) => (
              <tr key={index} className="border-b">

                <td className="p-3">{item.date}</td>

                <td className="p-3">
                  <span
                    className={`px-3 py-1 rounded-full text-sm text-white ${
                      item.status === "Present"
                        ? "bg-green-500"
                        : "bg-red-500"
                    }`}
                  >
                    {item.status}
                  </span>
                </td>

              </tr>
            ))}
          </tbody>

        </table>

      </div>

    </Layout>
  );
};

export default Attendance;