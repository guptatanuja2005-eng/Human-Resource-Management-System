import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FormGroup, Input, Select } from '../components/Form';
import Button from '../components/Button';
import { User, Mail, Lock, UserPlus, Briefcase } from 'lucide-react';
const Signup = () => {
  const { signup, error: authError } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'employee',
    department: 'Engineering',
    designation: 'Software Engineer'
  });
  const [loading, setLoading] = useState(false);
  const [validationError, setValidationError] = useState('');
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    setValidationError('');
    if (!formData.name || !formData.email || !formData.password) {
      setValidationError('Please fill out all required fields.');
      return;
    }
    setLoading(true);
    try {
      await signup(formData);
      navigate('/');
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };
  const departmentOptions = [
    { value: 'Engineering', label: 'Engineering' },
    { value: 'Marketing', label: 'Marketing' },
    { value: 'Human Resources', label: 'Human Resources' },
    { value: 'Finance', label: 'Finance' }
  ];
  const roleOptions = [
    { value: 'employee', label: 'Employee' },
    { value: 'admin', label: 'HR Admin' }
  ];
  return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-4 relative overflow-hidden">
      {/* Background blobs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary-600/10 rounded-full blur-3xl -z-10 animate-pulse"></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-indigo-600/10 rounded-full blur-3xl -z-10 animate-pulse"></div>
      {/* Brand Header */}
      <div className="flex items-center gap-3 mb-8">
        <div className="w-10 h-10 rounded-xl bg-primary-600 flex items-center justify-center text-white font-black text-xl shadow-lg shadow-primary-600/40">
          E
        </div>
        <span className="text-xl font-extrabold text-slate-100 tracking-wider">EMS PORTAL</span>
      </div>
      {/* Signup Box */}
      <div className="w-full max-w-lg glass-card rounded-2xl p-8 border border-slate-800 shadow-2xl animate-enter">
        <h2 className="text-xl font-extrabold text-slate-100 text-center mb-1 tracking-tight">Create Account</h2>
        <p className="text-xs text-slate-400 text-center mb-6 font-medium">Join the Employee Management portal</p>
        {(validationError || authError) && (
          <div className="bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs font-semibold px-4 py-3 rounded-lg mb-4 text-center">
            {validationError || authError}
          </div>
        )}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormGroup label="Full Name" icon={<User size={16} />}>
              <Input
                name="name"
                placeholder="John Doe"
                value={formData.name}
                onChange={handleChange}
                required
                icon
              />
            </FormGroup>
            <FormGroup label="Email Address" icon={<Mail size={16} />}>
              <Input
                name="email"
                type="email"
                placeholder="name@company.com"
                value={formData.email}
                onChange={handleChange}
                required
                icon
              />
            </FormGroup>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormGroup label="Password" icon={<Lock size={16} />}>
              <Input
                name="password"
                type="password"
                placeholder="••••••••"
                value={formData.password}
                onChange={handleChange}
                required
                icon
              />
            </FormGroup>
            <FormGroup label="Register As" icon={<UserPlus size={16} />}>
              <Select
                name="role"
                value={formData.role}
                onChange={handleChange}
                options={roleOptions}
                icon
              />
            </FormGroup>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormGroup label="Department" icon={<Briefcase size={16} />}>
              <Select
                name="department"
                value={formData.department}
                onChange={handleChange}
                options={departmentOptions}
                icon
              />
            </FormGroup>
            <FormGroup label="Designation">
              <Input
                name="designation"
                placeholder="e.g. UX Designer"
                value={formData.designation}
                onChange={handleChange}
                required
              />
            </FormGroup>
          </div>
          <Button type="submit" variant="primary" className="w-full mt-4 font-bold" isLoading={loading} icon={<UserPlus size={16} />}>
            Create Account
          </Button>
        </form>
        <p className="text-xs text-slate-400 text-center mt-6 font-medium">
          Already have an account?{' '}
          <Link to="/login" className="text-primary-400 hover:text-primary-300 font-bold transition-colors">
            Sign In Here
          </Link>
        </p>
      </div>
    </div>
  );
};
export default Signup;
