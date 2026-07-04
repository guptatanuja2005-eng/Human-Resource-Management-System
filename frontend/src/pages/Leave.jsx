import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import apiService from '../services/api';
import Card from '../components/Card';
import Button from '../components/Button';
import Modal from '../components/Modal';
import Table from '../components/Table';
import { FormGroup, Input, Select, TextArea } from '../components/Form';
import { CalendarPlus, Check, X, FileSpreadsheet } from 'lucide-react';

const Leave = () => {
  const { user } = useAuth();
  const isAdmin = user?.role === 'admin';
  const [leaves, setLeaves] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [formLoading, setFormLoading] = useState(false);
  const [formData, setFormData] = useState({
    type: 'Casual Leave',
    startDate: '',
    endDate: '',
    reason: ''
  });
  const fetchData = async () => {
    try {
      const data = await apiService.getLeaves();
      setLeaves(data);
    } catch (err) {
      console.error("Failed to fetch leaves list:", err);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchData();
  }, []);
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  const handleApplyLeave = async (e) => {
    e.preventDefault();
    if (!formData.startDate || !formData.endDate || !formData.reason) {
      alert('Please fill out all fields');
      return;
    }
    setFormLoading(true);
    try {
      await apiService.applyLeave(formData);
      setModalOpen(false);
      setFormData({ type: 'Casual Leave', startDate: '', endDate: '', reason: '' });
      fetchData();
    } catch (err) {
      alert('Failed to apply for leave');
    } finally {
      setFormLoading(false);
    }
  };
  const handleStatusUpdate = async (id, status) => {
    try {
      await apiService.updateLeaveStatus(id, status);
      fetchData();
    } catch (err) {
      alert(`Failed to set leave status to ${status}`);
    }
  };
  // Setup table headers
  const tableHeaders = [
    ...(isAdmin ? [{ key: 'employeeName', label: 'Employee' }] : []),
    { key: 'type', label: 'Type' },
    { key: 'startDate', label: 'Start Date' },
    { key: 'endDate', label: 'End Date' },
    { key: 'days', label: 'Duration', render: (val) => `${val} days` },
    { key: 'reason', label: 'Reason', render: (val) => <span className="italic text-slate-400">"{val}"</span> },
    {
      key: 'status',
      label: 'Status',
      render: (status) => {
        const colors = {
          Approved: 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20',
          Rejected: 'bg-rose-500/10 text-rose-400 border border-rose-500/20',
          Pending: 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
        };
        return (
          <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${colors[status]}`}>
            {status}
          </span>
        );
      }
    },
    ...(isAdmin
      ? [
          {
            key: 'actions',
            label: 'Review Decision',
            render: (_, row) =>
              row.status === 'Pending' ? (
                <div className="flex gap-2">
                  <button
                    onClick={() => handleStatusUpdate(row.id, 'Approved')}
                    className="p-1 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded hover:bg-emerald-500 hover:text-white transition-all cursor-pointer"
                    title="Approve"
                  >
                    <Check size={12} />
                  </button>
                  <button
                    onClick={() => handleStatusUpdate(row.id, 'Rejected')}
                    className="p-1 bg-rose-500/10 border border-rose-500/20 text-rose-400 rounded hover:bg-rose-500 hover:text-white transition-all cursor-pointer"
                    title="Reject"
                  >
                    <X size={12} />
                  </button>
                </div>
              ) : (
                <span className="text-[10px] text-slate-500 font-extrabold uppercase tracking-wide">Processed</span>
              )
          }
        ]
      : [])
  ];
  const leaveTypes = [
    { value: 'Casual Leave', label: 'Casual Leave' },
    { value: 'Sick Leave', label: 'Sick Leave' },
    { value: 'Annual Leave', label: 'Annual Leave' },
    { value: 'Maternity/Paternity Leave', label: 'Maternity/Paternity Leave' }
  ];
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-xl font-extrabold text-slate-100 tracking-wide">
            {isAdmin ? 'System Leave Administration' : 'My Leave Dashboard'}
          </h2>
          <p className="text-slate-400 text-xs font-semibold uppercase tracking-wider mt-1">
            {isAdmin ? 'Audit and approve pending employee paid time off applications' : 'Apply for paid time off and review request histories'}
          </p>
        </div>
        {!isAdmin && (
          <Button onClick={() => setModalOpen(true)} className="font-bold text-xs" size="sm" icon={<CalendarPlus size={16} />}>
            Request Time Off
          </Button>
        )}
      </div>
      {/* Leave Logs Card */}
      <Card className="border border-slate-800/80">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
            <FileSpreadsheet size={16} /> Paid Time Off Applications
          </h3>
        </div>
        <Table
          headers={tableHeaders}
          data={leaves}
          loading={loading}
          searchKey={isAdmin ? 'employeeName' : 'type'}
          searchPlaceholder={isAdmin ? 'Search employee name...' : 'Search leave type...'}
          emptyMessage="No leave records found in database."
        />
      </Card>
      {/* Modal Dialog: Apply Leave */}
      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title="Apply for Paid Time Off">
        <form onSubmit={handleApplyLeave} className="space-y-4">
          <FormGroup label="Leave Type">
            <Select
              name="type"
              value={formData.type}
              onChange={handleChange}
              options={leaveTypes}
            />
          </FormGroup>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormGroup label="Start Date">
              <Input
                name="startDate"
                type="date"
                value={formData.startDate}
                onChange={handleChange}
                required
              />
            </FormGroup>
            <FormGroup label="End Date">
              <Input
                name="endDate"
                type="date"
                value={formData.endDate}
                onChange={handleChange}
                required
              />
            </FormGroup>
          </div>
          <FormGroup label="Reason / Notes">
            <TextArea
              name="reason"
              placeholder="Provide a reason for leave request"
              value={formData.reason}
              onChange={handleChange}
              rows={4}
              required
            />
          </FormGroup>
          <div className="flex justify-end gap-2 pt-2 border-t border-slate-800/60">
            <Button onClick={() => setModalOpen(false)} variant="outline" className="font-semibold text-xs py-1.5" size="sm">
              Cancel
            </Button>
            <Button type="submit" variant="primary" className="font-semibold text-xs py-1.5" size="sm" isLoading={formLoading}>
              Submit Application
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
export default Leave;
