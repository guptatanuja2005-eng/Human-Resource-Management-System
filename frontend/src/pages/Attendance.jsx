import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import apiService from '../services/api';
import Card from '../components/Card';
import Button from '../components/Button';
import Calendar from '../components/Calender';
import Table from '../components/Table';
import { Clock, CheckCircle, Navigation } from 'lucide-react';

const Attendance = () => {
  const { user } = useAuth();
  const isAdmin = user?.role === 'admin';
  
  const [attendance, setAttendance] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [checkedInToday, setCheckedInToday] = useState(null);
  const [location, setLocation] = useState('Remote');
  const fetchData = async () => {
    try {
      const data = await apiService.getAttendance();
      setAttendance(data);
      const todayStr = new Date().toISOString().split('T')[0];
      const todayLog = data.find(a => a.employeeId === user.id && a.date === todayStr);
      setCheckedInToday(todayLog || null);
    } catch (err) {
      console.error("Failed to load attendance logs:", err);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
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
      hours = hours ? hours : 12;
      const timeStr = `${String(hours).padStart(2, '0')}:${minutes} ${modifier}`;
      const newLog = await apiService.checkIn(timeStr, location);
      setCheckedInToday(newLog);
      fetchData();
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
      await apiService.checkOut(timeStr);
      fetchData();
    } catch (err) {
      alert(err.response?.data?.message || 'Check-out failed');
    } finally {
      setActionLoading(false);
    }
  };
  const tableHeaders = [
    ...(isAdmin ? [{ key: 'employeeName', label: 'Employee' }] : []),
    { key: 'date', label: 'Date' },
    { key: 'checkIn', label: 'Check In' },
    { key: 'checkOut', label: 'Check Out' },
    { key: 'hoursWorked', label: 'Hours', render: (val) => val ? `${val} hrs` : '-' },
    {
      key: 'status',
      label: 'Status',
      render: (status) => (
        <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
          status === 'On Time'
            ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
            : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
        }`}>
          {status}
        </span>
      )
    }
  ];
  return (
    <div className="space-y-6">
      {/* Intro */}
      <div>
        <h2 className="text-xl font-extrabold text-slate-100 tracking-wide">
          {isAdmin ? 'Corporate Attendance Directory' : 'My Attendance Portal'}
        </h2>
        <p className="text-slate-400 text-xs font-semibold uppercase tracking-wider mt-1">
          {isAdmin ? 'Audit and track daily punch timelines across all offices' : 'Clock in, check out, and review monthly work logs'}
        </p>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Side: Check-in Actions & Calendar */}
        <div className="space-y-6 lg:col-span-1">
          {/* Employee Punch Card */}
          {!isAdmin && (
            <Card className="border border-slate-800/80">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4 flex items-center gap-1.5">
                <Clock size={16} /> Daily Punch Portal
              </h3>
              
              <div className="space-y-4">
                {checkedInToday ? (
                  <div className="p-4 bg-slate-900/40 border border-slate-800/60 rounded-xl space-y-2">
                    <div className="flex items-center gap-2 text-emerald-400 text-xs font-bold uppercase tracking-wider">
                      <CheckCircle size={16} />
                      <span>Punch-In Logged</span>
                    </div>
                    <p className="text-xs text-slate-300 font-semibold">
                      Started work at <span className="text-slate-100 font-extrabold">{checkedInToday.checkIn}</span>
                    </p>
                    {checkedInToday.checkOut && (
                      <p className="text-xs text-slate-400 font-semibold">
                        Workday closed at <span className="text-slate-200 font-extrabold">{checkedInToday.checkOut}</span>
                      </p>
                    )}
                  </div>
                ) : (
                  <div className="p-4 bg-slate-900/40 border border-slate-800/60 rounded-xl space-y-3">
                    <div className="flex flex-col gap-1">
                      <span className="text-xs font-semibold text-slate-400">Select Punching Location</span>
                      <select
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                        className="bg-slate-950 border border-slate-800 rounded-lg text-xs font-semibold text-slate-300 px-3 py-2 focus:outline-none focus:border-primary-500 cursor-pointer"
                      >
                        <option value="Office">Office HQ</option>
                        <option value="Remote">Remote / WFH</option>
                        <option value="Client Site">Client Location</option>
                      </select>
                    </div>
                  </div>
                )}
                <div className="flex gap-2">
                  {!checkedInToday ? (
                    <Button onClick={handleCheckIn} className="w-full font-bold" isLoading={actionLoading} icon={<Navigation size={14} />}>
                      Punch In
                    </Button>
                  ) : !checkedInToday.checkOut ? (
                    <Button onClick={handleCheckOut} variant="danger" className="w-full font-bold" isLoading={actionLoading} icon={<Clock size={14} />}>
                      Punch Out
                    </Button>
                  ) : (
                    <div className="w-full flex items-center justify-center gap-1.5 py-2.5 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs font-bold uppercase tracking-wider">
                      <CheckCircle size={14} />
                      Shift Log Completed
                    </div>
                  )}
                </div>
              </div>
            </Card>
          )}
          {/* Calendar visualizer */}
          <Calendar attendance={attendance} />
        </div>
        {/* Right Side: Log History Table */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="border border-slate-800/80">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">
              {isAdmin ? 'System Attendance Logs Directory' : 'Personal Attendance History Logs'}
            </h3>
            
            <Table
              headers={tableHeaders}
              data={attendance}
              loading={loading}
              searchKey={isAdmin ? 'employeeName' : 'date'}
              searchPlaceholder={isAdmin ? 'Search employee name...' : 'Search dates (YYYY-MM-DD)...'}
              emptyMessage="No attendance logs found in database."
            />
          </Card>
        </div>
      </div>
    </div>
  );
};
export default Attendance;
