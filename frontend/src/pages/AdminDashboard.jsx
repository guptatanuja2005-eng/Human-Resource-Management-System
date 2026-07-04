import React, { useEffect, useState } from 'react';
import apiService from '../services/api';
import Card, { StatsCard } from '../components/Card';
import Button from '../components/Button';
import { Users, Clock, Calendar, DollarSign, Check, X, ShieldAlert } from 'lucide-react';
const AdminDashboard = () => {
  const [employees, setEmployees] = useState([]);
  const [attendance, setAttendance] = useState([]);
  const [leaves, setLeaves] = useState([]);
  const [payroll, setPayroll] = useState([]);
  const [loading, setLoading] = useState(true);
  const fetchData = async () => {
    try {
      const [empData, attData, leaveData, payData] = await Promise.all([
        apiService.getEmployees(),
        apiService.getAttendance(),
        apiService.getLeaves(),
        apiService.getPayroll()
      ]);
      setEmployees(empData);
      setAttendance(attData);
      setLeaves(leaveData);
      setPayroll(payData);
    } catch (err) {
      console.error("Failed to load admin stats:", err);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchData();
  }, []);
  const handleApproveLeave = async (id) => {
    try {
      await apiService.updateLeaveStatus(id, 'Approved');
      fetchData();
    } catch (err) {
      alert('Failed to approve leave request');
    }
  };
  const handleRejectLeave = async (id) => {
    try {
      await apiService.updateLeaveStatus(id, 'Rejected');
      fetchData();
    } catch (err) {
      alert('Failed to reject leave request');
    }
  };
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-primary-500"></div>
      </div>
    );
  }
  // Calculate statistics
  const totalEmployeesCount = employees.length;
  const todayStr = new Date().toISOString().split('T')[0];
  const todayPresentsCount = attendance.filter(a => a.date === todayStr).length;
  const pendingLeaves = leaves.filter(l => l.status === 'Pending');
  const totalPayrollValue = payroll.reduce((sum, item) => sum + item.netSalary, 0);
  return (
    <div className="space-y-6">
      {/* Greetings */}
      <div>
        <h2 className="text-xl font-extrabold text-slate-100 tracking-wide flex items-center gap-2">
          Admin Control Center <ShieldAlert className="text-primary-400 animate-pulse" size={20} />
        </h2>
        <p className="text-slate-400 text-xs font-semibold uppercase tracking-wider mt-1">
          System Overview and Activity Diagnostics
        </p>
      </div>
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title="Total Personnel"
          value={totalEmployeesCount}
          icon={<Users size={18} />}
          description="Registered employees"
          trend="+1 this week"
          trendType="up"
        />
        <StatsCard
          title="Presents Today"
          value={todayPresentsCount}
          icon={<Clock size={18} />}
          description="Checked in today"
          trend={totalEmployeesCount > 0 ? `${Math.round((todayPresentsCount / totalEmployeesCount) * 100)}% attendance` : '0%'}
          trendType={todayPresentsCount > 0 ? 'up' : 'neutral'}
        />
        <StatsCard
          title="Pending Leaves"
          value={pendingLeaves.length}
          icon={<Calendar size={18} />}
          description="Awaiting HR action"
          trend={pendingLeaves.length > 0 ? 'Requires attention' : 'All cleared'}
          trendType={pendingLeaves.length > 0 ? 'down' : 'up'}
        />
        <StatsCard
          title="Total Payroll Month"
          value={totalPayrollValue.toLocaleString('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 })}
          icon={<DollarSign size={18} />}
          description="Monthly payroll value"
          trend="June 2026 slipcycle"
          trendType="neutral"
        />
      </div>
      {/* Grid: Pending Leaves & Recent Punch logs */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Pending Leaves Request Queue */}
        <Card className="border border-slate-800/80">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">
            Pending Leave Requests Queue
          </h3>
          <div className="space-y-4">
            {pendingLeaves.map((lv) => (
              <div
                key={lv.id}
                className="p-4 bg-slate-900/40 border border-slate-800 rounded-xl flex items-center justify-between gap-4"
              >
                <div>
                  <h4 className="text-xs font-bold text-slate-200">{lv.employeeName}</h4>
                  <p className="text-[10px] text-slate-400 mt-0.5">
                    {lv.type} • {lv.startDate} to {lv.endDate} ({lv.days} days)
                  </p>
                  <p className="text-[10px] text-slate-400 italic mt-1 font-medium">"{lv.reason}"</p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleApproveLeave(lv.id)}
                    className="p-1.5 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-lg hover:bg-emerald-500 hover:text-white transition-all"
                    title="Approve"
                  >
                    <Check size={14} />
                  </button>
                  <button
                    onClick={() => handleRejectLeave(lv.id)}
                    className="p-1.5 bg-rose-500/10 border border-rose-500/20 text-rose-400 rounded-lg hover:bg-rose-500 hover:text-white transition-all"
                    title="Reject"
                  >
                    <X size={14} />
                  </button>
                </div>
              </div>
            ))}
            {pendingLeaves.length === 0 && (
              <p className="text-xs text-slate-500 py-6 text-center">No pending leave requests found.</p>
            )}
          </div>
        </Card>
        {/* Checked-In Personnel Log */}
        <Card className="border border-slate-800/80">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">
            Today's Check-In Log
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-semibold border-collapse">
              <thead>
                <tr className="border-b border-slate-800 text-slate-500 uppercase tracking-wider">
                  <th className="py-2.5">Employee</th>
                  <th className="py-2.5">In Time</th>
                  <th className="py-2.5">Out Time</th>
                  <th className="py-2.5">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/50 text-slate-300">
                {attendance.filter(a => a.date === todayStr).map((att) => (
                  <tr key={att.id}>
                    <td className="py-3 font-bold">{att.employeeName}</td>
                    <td className="py-3">{att.checkIn}</td>
                    <td className="py-3">{att.checkOut || 'Active'}</td>
                    <td className="py-3">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                        att.status === 'On Time' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                      }`}>
                        {att.status}
                      </span>
                    </td>
                  </tr>
                ))}
                {attendance.filter(a => a.date === todayStr).length === 0 && (
                  <tr>
                    <td colSpan={4} className="py-8 text-center text-slate-500 font-medium">
                      No check-ins completed today yet.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </div>
  );
};
export default AdminDashboard;
