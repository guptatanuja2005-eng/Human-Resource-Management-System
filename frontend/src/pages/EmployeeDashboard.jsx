import Layout from "../components/Layout";

const EmployeeDashboard = () => {
  return (
    <Layout role="employee">

      <h1 className="text-2xl font-bold mb-6">
        My Dashboard
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

        <div className="bg-white p-5 rounded-xl shadow">
          <p>Attendance</p>
          <h2 className="text-2xl font-bold text-green-600">22 / 26</h2>
        </div>

        <div className="bg-white p-5 rounded-xl shadow">
          <p>Leaves Taken</p>
          <h2 className="text-2xl font-bold text-yellow-500">2</h2>
        </div>

        <div className="bg-white p-5 rounded-xl shadow">
          <p>Salary Status</p>
          <h2 className="text-2xl font-bold text-indigo-600">Paid</h2>
        </div>

      </div>

    </Layout>
  );
};

export default EmployeeDashboard;