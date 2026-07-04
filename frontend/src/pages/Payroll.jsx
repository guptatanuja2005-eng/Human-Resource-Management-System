import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import apiService from '../services/api';
import Card from '../components/Card';
import Button from '../components/Button';
import Modal from '../components/Modal';
import Table from '../components/Table';
import { FormGroup, Input, Select } from '../components/Form';
import { Wallet, Printer, FileText, PlusCircle } from 'lucide-react';

const Payroll = () => {
  const { user } = useAuth();
  const isAdmin = user?.role === 'admin';
  const [payroll, setPayroll] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Modal states
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [slipModalOpen, setSlipModalOpen] = useState(false);
  const [selectedSlip, setSelectedSlip] = useState(null);
  
  // Form states
  const [formLoading, setFormLoading] = useState(false);
  const [formData, setFormData] = useState({
    employeeId: '',
    month: 'July 2026',
    baseSalary: '',
    allowances: '0',
    deductions: '0',
    status: 'Paid'
  });
  const fetchData = async () => {
    try {
      const payData = await apiService.getPayroll();
      setPayroll(payData);
      if (isAdmin) {
        const empData = await apiService.getEmployees();
        setEmployees(empData);
        if (empData.length > 0) {
          setFormData(prev => ({ ...prev, employeeId: empData[0].id }));
        }
      }
    } catch (err) {
      console.error("Failed to load payroll list:", err);
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
  const handleCreatePayroll = async (e) => {
    e.preventDefault();
    if (!formData.employeeId || !formData.baseSalary) {
      alert('Please fill out employee and basic salary details.');
      return;
    }
    setFormLoading(true);
    try {
      await apiService.createPayroll(formData);
      setCreateModalOpen(false);
      setFormData(prev => ({
        ...prev,
        baseSalary: '',
        allowances: '0',
        deductions: '0'
      }));
      fetchData();
    } catch (err) {
      alert('Failed to generate payroll slip');
    } finally {
      setFormLoading(false);
    }
  };
  const handleViewSlip = (slip) => {
    setSelectedSlip(slip);
    setSlipModalOpen(true);
  };
  const formatCurrency = (val) => {
    return Number(val).toLocaleString('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 });
  };
  // Table headers
  const tableHeaders = [
    ...(isAdmin ? [{ key: 'employeeName', label: 'Employee' }] : []),
    { key: 'month', label: 'Pay Month' },
    { key: 'baseSalary', label: 'Base Salary', render: formatCurrency },
    { key: 'netSalary', label: 'Net Pay', render: (val) => <span className="font-bold text-primary-400">{formatCurrency(val)}</span> },
    {
      key: 'status',
      label: 'Status',
      render: (status) => (
        <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
          status === 'Paid' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
        }`}>
          {status}
        </span>
      )
    },
    {
      key: 'actions',
      label: 'Payslip',
      render: (_, row) => (
        <Button onClick={() => handleViewSlip(row)} variant="outline" className="text-xs font-semibold py-1 gap-1" size="sm" icon={<FileText size={12} />}>
          View Details
        </Button>
      )
    }
  ];
  const employeeOptions = employees.map(e => ({ value: e.id, label: `${e.name} (${e.department})` }));
  
  const statusOptions = [
    { value: 'Paid', label: 'Paid' },
    { value: 'Pending', label: 'Pending' }
  ];
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-xl font-extrabold text-slate-100 tracking-wide">
            {isAdmin ? 'Corporate Payroll Administration' : 'My Payroll & Salary Slips'}
          </h2>
          <p className="text-slate-400 text-xs font-semibold uppercase tracking-wider mt-1">
            {isAdmin ? 'Oversee salary disbursement and generate monthly payroll slips' : 'Verify salary deposits and download individual tax payslips'}
          </p>
        </div>
        {isAdmin && (
          <Button onClick={() => setCreateModalOpen(true)} className="font-bold text-xs" size="sm" icon={<PlusCircle size={16} />}>
            Generate Payslip
          </Button>
        )}
      </div>
      {/* Salary History Card */}
      <Card className="border border-slate-800/80">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
            <Wallet size={16} /> Disbursed Salary Slips History
          </h3>
        </div>
        <Table
          headers={tableHeaders}
          data={payroll}
          loading={loading}
          searchKey={isAdmin ? 'employeeName' : 'month'}
          searchPlaceholder={isAdmin ? 'Search employee name...' : 'Search pay month...'}
          emptyMessage="No payroll slips found in database."
        />
      </Card>
      {/* Modal: View Payslip Details */}
      <Modal isOpen={slipModalOpen} onClose={() => setSlipModalOpen(false)} title="Salary Slip Component Breakdown" size="md">
        {selectedSlip && (
          <div className="space-y-6 font-semibold">
            {/* Header info */}
            <div className="flex justify-between items-start border-b border-slate-800/80 pb-4">
              <div>
                <h4 className="text-sm font-bold text-slate-200">{selectedSlip.employeeName}</h4>
                <p className="text-[9px] text-slate-500 uppercase tracking-wide mt-0.5">ID: {selectedSlip.employeeId}</p>
              </div>
              <div className="text-right">
                <span className="text-xs font-bold text-slate-400">Statement Period</span>
                <p className="text-sm font-extrabold text-slate-200 mt-0.5">{selectedSlip.month}</p>
              </div>
            </div>
            {/* Calculations grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
              {/* Earnings */}
              <div className="space-y-3">
                <h5 className="font-bold text-slate-400 uppercase tracking-widest border-b border-slate-800/50 pb-1">Earnings</h5>
                <div className="flex justify-between">
                  <span className="text-slate-400">Base Salary</span>
                  <span className="text-slate-200">{formatCurrency(selectedSlip.baseSalary)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">HRA / Allowances</span>
                  <span className="text-slate-200">{formatCurrency(selectedSlip.allowances)}</span>
                </div>
              </div>
              {/* Deductions */}
              <div className="space-y-3">
                <h5 className="font-bold text-slate-400 uppercase tracking-widest border-b border-slate-800/50 pb-1">Deductions</h5>
                <div className="flex justify-between">
                  <span className="text-slate-400">Tax Deductions</span>
                  <span className="text-rose-400">({formatCurrency(selectedSlip.deductions)})</span>
                </div>
              </div>
            </div>
            {/* Total */}
            <div className="pt-4 border-t border-slate-800/80 flex justify-between items-center bg-slate-900/30 p-4 rounded-xl border border-slate-800">
              <div>
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Net Salary Payout</span>
                <p className="text-[9px] text-emerald-400 uppercase tracking-widest mt-0.5">Direct Deposit Cleared</p>
              </div>
              <h3 className="text-2xl font-black text-primary-400 glow-text-primary">
                {formatCurrency(selectedSlip.netSalary)}
              </h3>
            </div>
            {/* Print action */}
            <div className="flex justify-end gap-2 pt-2">
              <Button onClick={() => window.print()} variant="secondary" className="font-semibold text-xs py-1.5" size="sm" icon={<Printer size={14} />}>
                Print Statement
              </Button>
              <Button onClick={() => setSlipModalOpen(false)} variant="primary" className="font-semibold text-xs py-1.5" size="sm">
                Close
              </Button>
            </div>
          </div>
        )}
      </Modal>
      {/* Modal: Generate Payroll Slip (Admin Only) */}
      <Modal isOpen={createModalOpen} onClose={() => setCreateModalOpen(false)} title="Generate New Payroll Statement">
        <form onSubmit={handleCreatePayroll} className="space-y-4">
          <FormGroup label="Select Employee">
            {employeeOptions.length > 0 ? (
              <Select
                name="employeeId"
                value={formData.employeeId}
                onChange={handleChange}
                options={employeeOptions}
              />
            ) : (
              <p className="text-xs text-rose-400">No employees registered yet.</p>
            )}
          </FormGroup>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormGroup label="Statement Month">
              <Input
                name="month"
                placeholder="e.g. July 2026"
                value={formData.month}
                onChange={handleChange}
                required
              />
            </FormGroup>
            <FormGroup label="Disbursement Status">
              <Select
                name="status"
                value={formData.status}
                onChange={handleChange}
                options={statusOptions}
              />
            </FormGroup>
          </div>
          <div className="grid grid-cols-3 gap-4">
            <FormGroup label="Base Salary">
              <Input
                name="baseSalary"
                type="number"
                placeholder="Basic"
                value={formData.baseSalary}
                onChange={handleChange}
                required
              />
            </FormGroup>
            <FormGroup label="Allowances">
              <Input
                name="allowances"
                type="number"
                placeholder="Allowances"
                value={formData.allowances}
                onChange={handleChange}
                required
              />
            </FormGroup>
            <FormGroup label="Deductions">
              <Input
                name="deductions"
                type="number"
                placeholder="Tax / PF"
                value={formData.deductions}
                onChange={handleChange}
                required
              />
            </FormGroup>
          </div>
          <div className="flex justify-end gap-2 pt-2 border-t border-slate-800/60">
            <Button onClick={() => setCreateModalOpen(false)} variant="outline" className="font-semibold text-xs py-1.5" size="sm">
              Cancel
            </Button>
            <Button type="submit" variant="primary" className="font-semibold text-xs py-1.5" size="sm" isLoading={formLoading}>
              Disburse Statement
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
export default Payroll;
