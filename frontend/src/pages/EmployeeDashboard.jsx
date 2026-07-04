import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import apiService from '../services/api';
import Card, { StatsCard } from '../components/Card';
import Button from '../components/Button';
import { Clock, Calendar, CheckCircle2, AlertCircle, FileText, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const EmployeeDashboard = () => {
  const { user } = useAuth();
  const [attendance, setAttendance] = useState([]);
  const [leaves, setLeaves] = useState([]);
  const [payroll, setPayroll] = useState([]);
  const [loading, setLoading] = useState(true);
  const [checkedInToday, setCheckedInToday] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [attData, leaveData, payData] = await Promise.all([
          apiService.getAttendance(),
          apiService.getLeaves(),
          apiService.getPayroll()
        ]);
        setAttendance(attData);
        setLeaves(leaveData);
        setPayroll(payData);
        const todayStr = new Date().toISOString().split('T')[0];
        const todayLog = attData.find(a => a.date === todayStr);
        setCheckedInToday(todayLog || null);
      } catch (err) {
        console.error("Failed to load dashboard data:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);
  const handleCheckIn = async () => {
    setActionLoading(true);
    try {
      const now = new Date();
      let hours = now.getHours();
      const minutes = String(now.getMinutes()).padStart(2, '0');
      const modifier = hours >= 12 ? 'PM' : 'AM';
      hours = hours % 12;
      hours = hours ? hours : 12; // 0 should be 12
      const timeStr = `${String(hours).padStart(2, '0')}:${minutes} ${modifier}`;
      
      const newLog = await apiService.checkIn(timeStr, 'Office');
      setCheckedInToday(newLog);
      // Refresh attendance logs
      const updatedAtt = await apiService.getAttendance();
      setAttendance(updatedAtt);
    } catch (err) {
      alert(err.response?.data?.message || 'Check-in failed');
    } finally {
      setActionLoading(false);
    }
  };
  const handleCheckOut = async () => {
    setActionLoading(true);
    try {
      const now = new Date();
      let hours = now.getHours();
      const minutes = String(now.getMinutes()).padStart(2, '0');
      const modifier = hours >= 12 ? 'PM' : 'AM';
      hours = hours % 12;
      hours = hours ? hours : 12;
      const timeStr = `${String(hours).padStart(2, '0')}:${minutes} ${modifier}`;
      const updatedLog = await apiService.checkOut(timeStr);
      setCheckedInToday(updatedLog);
      const updatedAtt = await apiService.getAttendance();
      setAttendance(updatedAtt);
    } catch (err) {
      alert(err.response?.data?.message || 'Check-out failed');
    } finally {
      setActionLoading(false);
    }
  };
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-primary-500"></div>
      </div>
    );
  }
  // Calculate stats
  const pendingLeavesCount = leaves.filter(l => l.status === 'Pending').length;
  const recentPayroll = payroll.length > 0 ? payroll[0] : null;
  return (
    <div className="space-y-6">
      {/* Greetings */}
      <div>
        <h2 className="text-xl font-extrabold text-slate-100 tracking-wide">Hello, {user?.name}!</h2>
        <p className="text-slate-400 text-xs font-semibold uppercase tracking-wider mt-1">{user?.designation} • {user?.department}</p>
      </div>
      {/* Widgets Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Attendance Action Widget */}
        <Card className="flex flex-col justify-between h-48 border border-slate-800/80">
          <div>
            <div className="flex justify-between items-start">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Attendance Status</span>
              <Clock size={18} className="text-primary-400" />
            </div>
            <h3 className="text-xl font-bold mt-2 text-slate-200">
              {checkedInToday ? (
                checkedInToday.checkOut ? 'Workday Completed' : 'Checked In'
              ) : (
                'Not Checked In Yet'
              )}
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              {checkedInToday ? (
                checkedInToday.checkOut ? `Out: ${checkedInToday.checkOut}` : `Checked in at ${checkedInToday.checkIn}`
              ) : (
                'Time limit for On-Time is 09:15 AM'
              )}
            </p>
          </div>
          <div>
            {!checkedInToday ? (
              <Button onClick={handleCheckIn} className="w-full font-bold" isLoading={actionLoading}>
                Check In Now
              </Button>
            ) : !checkedInToday.checkOut ? (
              <Button onClick={handleCheckOut} variant="danger" className="w-full font-bold" isLoading={actionLoading}>
                Check Out Now
              </Button>
            ) : (
              <div className="flex items-center gap-1.5 justify-center py-2 px-4 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs font-bold uppercase tracking-wider">
                <CheckCircle2 size={14} />
                Checked Out
              </div>
            )}
          </div>
        </Card>
        {/* Leaves Widget */}
        <StatsCard
          title="Leaves Status"
          value={pendingLeavesCount > 0 ? `${pendingLeavesCount} Pending` : 'No Pending'}
          icon={<Calendar size={18} />}
          description="Click to request time off"
          trend={`${leaves.length} Total Applied`}
          trendType="neutral"
          className="h-48 cursor-pointer"
        />
        {/* Payroll Widget */}
        <StatsCard
          title="Latest Pay Month"
          value={recentPayroll ? recentPayroll.netSalary.toLocaleString('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }) : '$0'}
          icon={<FileText size={18} />}
          description={recentPayroll ? `${recentPayroll.month} Slips Paid` : 'No slips created'}
          trend={recentPayroll ? 'Paid' : 'Pending'}
          trendType={recentPayroll?.status === 'Paid' ? 'up' : 'neutral'}
          className="h-48"
        />
      </div>
      {/* Grid: Calendar Quick View & Recent Attendance Logs */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Attendance Summary */}
        <Card className="lg:col-span-2 border border-slate-800/80">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-sm font-bold text-slate-300 uppercase tracking-wider">Recent Attendance Logs</h3>
            <Link to="/attendance" className="text-xs text-primary-400 hover:text-primary-300 font-bold flex items-center gap-0.5 transition-colors">
              View All Logs <ChevronRight size={14} />
            </Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-semibold border-collapse">
              <thead>
                <tr className="border-b border-slate-800 text-slate-500 uppercase tracking-wider">
                  <th className="py-2.5">Date</th>
                  <th className="py-2.5">In Time</th>
                  <th className="py-2.5">Out Time</th>
                  <th className="py-2.5">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/50 text-slate-300">
                {attendance.slice(0, 3).map((att) => (
                  <tr key={att.id}>
                    <td className="py-3 font-bold">{att.date}</td>
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
                {attendance.length === 0 && (
                  <tr>
                    <td colSpan={4} className="py-6 text-center text-slate-500">No attendance logs logged yet.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </Card>
        {/* Quick Action Info */}
        <Card className="border border-slate-800/80 flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-300 uppercase tracking-wider mb-4">Quick Help Card</h3>
            <div className="space-y-3.5">
              <div className="flex gap-3 items-start">
                <div className="p-1.5 rounded bg-primary-500/10 text-primary-400 mt-0.5">
                  <CheckCircle2 size={14} />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-200">Daily Attendance Policy</h4>
                  <p className="text-[10px] text-slate-400 mt-0.5">Check-in before 09:15 AM is On-Time. Checkout after 8 hours of work.</p>
                </div>
              </div>
              <div className="flex gap-3 items-start">
                <div className="p-1.5 rounded bg-amber-500/10 text-amber-400 mt-0.5">
                  <AlertCircle size={14} />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-200">Leave Requests</h4>
                  <p className="text-[10px] text-slate-400 mt-0.5">Apply 48 hours in advance. HR requires supporting reasons.</p>
                </div>
              </div>
            </div>
          </div>
          <div className="pt-4 border-t border-slate-800/40">
            <Link to="/leave">
              <Button variant="outline" className="w-full font-bold">Apply For Time Off</Button>
            </Link>
          </div>
        </Card>
      </div>
    </div>
  );
};
export default EmployeeDashboard;
