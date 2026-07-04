import { useState } from "react";
import Layout from "../components/Layout";

const Employees = () => {
  const [employees, setEmployees] = useState([
    { id: 1, name: "Rahul Sharma", role: "Developer", dept: "IT" },
    { id: 2, name: "Priya Singh", role: "HR Manager", dept: "HR" },
    { id: 3, name: "Aman Gupta", role: "Designer", dept: "Design" },
  ]);

  const [form, setForm] = useState({
    name: "",
    role: "",
    dept: "",
  });

  const [editId, setEditId] = useState(null);

  // Handle input
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Add Employee
  const addEmployee = () => {
    if (!form.name || !form.role || !form.dept) return;

    const newEmployee = {
      id: Date.now(),
      ...form,
    };

    setEmployees([...employees, newEmployee]);

    setForm({ name: "", role: "", dept: "" });
  };

  // Delete Employee
  const deleteEmployee = (id) => {
    setEmployees(employees.filter((emp) => emp.id !== id));
  };

  // Edit Employee (load data into form)
  const startEdit = (emp) => {
    setEditId(emp.id);
    setForm({
      name: emp.name,
      role: emp.role,
      dept: emp.dept,
    });
  };

  // Update Employee
  const updateEmployee = () => {
    setEmployees(
      employees.map((emp) =>
        emp.id === editId ? { ...emp, ...form } : emp
      )
    );

    setEditId(null);
    setForm({ name: "", role: "", dept: "" });
  };

  return (
    <Layout role="admin">

      <h1 className="text-2xl font-bold mb-6">Employee Management</h1>

      {/* FORM */}
      <div className="bg-white p-5 rounded-xl shadow mb-6 grid grid-cols-1 md:grid-cols-4 gap-4">

        <input
          type="text"
          name="name"
          value={form.name}
          onChange={handleChange}
          placeholder="Employee Name"
          className="border p-2 rounded-lg"
        />

        <input
          type="text"
          name="role"
          value={form.role}
          onChange={handleChange}
          placeholder="Role"
          className="border p-2 rounded-lg"
        />

        <input
          type="text"
          name="dept"
          value={form.dept}
          onChange={handleChange}
          placeholder="Department"
          className="border p-2 rounded-lg"
        />

        {editId ? (
          <button
            onClick={updateEmployee}
            className="bg-yellow-500 text-white rounded-lg"
          >
            Update
          </button>
        ) : (
          <button
            onClick={addEmployee}
            className="bg-indigo-600 text-white rounded-lg"
          >
            Add
          </button>
        )}
      </div>

      {/* TABLE */}
      <div className="bg-white rounded-xl shadow overflow-x-auto">

        <table className="w-full text-left">

          <thead className="bg-gray-100">
            <tr>
              <th className="p-3">Name</th>
              <th className="p-3">Role</th>
              <th className="p-3">Department</th>
              <th className="p-3">Actions</th>
            </tr>
          </thead>

          <tbody>
            {employees.map((emp) => (
              <tr key={emp.id} className="border-b">

                <td className="p-3">{emp.name}</td>
                <td className="p-3">{emp.role}</td>
                <td className="p-3">{emp.dept}</td>

                <td className="p-3 flex gap-2">

                  <button
                    onClick={() => startEdit(emp)}
                    className="bg-yellow-400 px-3 py-1 rounded text-white"
                  >
                    Edit
                  </button>

                  <button
                    onClick={() => deleteEmployee(emp.id)}
                    className="bg-red-500 px-3 py-1 rounded text-white"
                  >
                    Delete
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

export default Employees;