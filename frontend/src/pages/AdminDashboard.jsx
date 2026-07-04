
import Layout from "../components/Layout";

const AdminDashboard = () => {
  return (
    <Layout role="admin">

      <h1 className="text-2xl font-bold mb-6">
        Admin Dashboard
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">

        <div className="bg-white p-5 rounded-xl shadow">
          <p>Total Employees</p>
          <h2 className="text-2xl font-bold text-indigo-600">120</h2>
        </div>

        <div className="bg-white p-5 rounded-xl shadow">
          <p>Present Today</p>
          <h2 className="text-2xl font-bold text-green-600">98</h2>
        </div>

        <div className="bg-white p-5 rounded-xl shadow">
          <p>On Leave</p>
          <h2 className="text-2xl font-bold text-yellow-500">12</h2>
        </div>

        <div className="bg-white p-5 rounded-xl shadow">
          <p>Pending Requests</p>
          <h2 className="text-2xl font-bold text-red-500">8</h2>
        </div>

      </div>

    </Layout>
  );
};

export default AdminDashboard;