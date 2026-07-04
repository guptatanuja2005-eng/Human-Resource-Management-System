import React, { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
const Calendar = ({ attendance = [], leaves = [] }) => {
  const [currentDate, setCurrentDate] = useState(new Date(2026, 6, 4)); // July 2026 (0-indexed month)
  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const prevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };
  const nextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };
  // Get number of days in month and starting day of week
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDayIndex = new Date(year, month, 1).getDay(); // Sunday is 0, Monday is 1, etc.
  // Calendar cells
  const days = [];
  // Padding cells for starting day offset
  for (let i = 0; i < firstDayIndex; i++) {
    days.push({ day: null, dateStr: null });
  }
  // Days of month
  for (let d = 1; d <= daysInMonth; d++) {
    const dayStr = String(d).padStart(2, '0');
    const monthStr = String(month + 1).padStart(2, '0');
    const dateStr = `${year}-${monthStr}-${dayStr}`;
    days.push({ day: d, dateStr });
  }
  // Helper to determine day status
  const getDayStatus = (dateStr) => {
    if (!dateStr) return { color: 'bg-transparent', text: '' };
    
    // Check attendance log
    const attLog = attendance.find(a => a.date === dateStr);
    if (attLog) {
      if (attLog.status === 'On Time') {
        return { color: 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20', label: 'On Time' };
      }
      return { color: 'bg-amber-500/10 text-amber-400 border border-amber-500/20', label: 'Late' };
    }
    // Check leave requests
    const leaveLog = leaves.find(l => {
      if (l.status !== 'Approved') return false;
      const start = new Date(l.startDate);
      const end = new Date(l.endDate);
      const target = new Date(dateStr);
      return target >= start && target <= end;
    });
    if (leaveLog) {
      return { color: 'bg-purple-500/10 text-purple-400 border border-purple-500/20', label: 'Leave' };
    }
    // Check if weekend
    const dateObj = new Date(dateStr);
    const dayOfWeek = dateObj.getDay();
    if (dayOfWeek === 0 || dayOfWeek === 6) {
      return { color: 'bg-slate-900/10 text-slate-500 border border-slate-900/20', label: 'Weekend' };
    }
    // Past weekdays with no logs are Absents
    const today = new Date('2026-07-04'); // Local time date reference
    if (dateObj < today) {
      return { color: 'bg-rose-500/10 text-rose-400 border border-rose-500/20', label: 'Absent' };
    }
    return { color: 'bg-slate-900/30 text-slate-400 border border-slate-800/40', label: '' };
  };
  return (
    <div className="w-full glass-card p-6 rounded-xl border border-slate-800/60">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-md font-bold text-slate-200 tracking-wide">
          {monthNames[month]} {year}
        </h3>
        <div className="flex items-center gap-2">
          <button
            onClick={prevMonth}
            className="p-1.5 bg-slate-900 border border-slate-800 rounded-lg hover:bg-slate-800 text-slate-300 transition-colors"
          >
            <ChevronLeft size={16} />
          </button>
          <button
            onClick={nextMonth}
            className="p-1.5 bg-slate-900 border border-slate-800 rounded-lg hover:bg-slate-800 text-slate-300 transition-colors"
          >
            <ChevronRight size={16} />
          </button>
        </div>
      </div>
      {/* Week Header */}
      <div className="grid grid-cols-7 gap-1.5 text-center text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2">
        <div>Sun</div>
        <div>Mon</div>
        <div>Tue</div>
        <div>Wed</div>
        <div>Thu</div>
        <div>Fri</div>
        <div>Sat</div>
      </div>
      {/* Days Grid */}
      <div className="grid grid-cols-7 gap-1.5">
        {days.map((item, idx) => {
          const { color, label } = getDayStatus(item.dateStr);
          return (
            <div
              key={idx}
              className={`aspect-square flex flex-col justify-between p-1.5 rounded-lg text-xs font-semibold transition-all ${
                item.day ? color : 'bg-transparent border border-transparent'
              }`}
            >
              {item.day ? (
                <>
                  <span className="self-end opacity-80">{item.day}</span>
                  {label && (
                    <span className="text-[7.5px] font-bold uppercase tracking-wider truncate mt-1">
                      {label}
                    </span>
                  )}
                </>
              ) : null}
            </div>
          );
        })}
      </div>
      {/* Summary Badges */}
      <div className="flex flex-wrap gap-x-4 gap-y-2 mt-6 pt-4 border-t border-slate-800/60 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
          <span>On Time</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
          <span>Late</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-purple-500"></span>
          <span>Leave</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-rose-500"></span>
          <span>Absent</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-slate-700"></span>
          <span>Weekend</span>
        </div>
      </div>
    </div>
  );
};
export default Calendar;
