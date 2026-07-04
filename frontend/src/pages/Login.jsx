import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FormGroup, Input } from '../components/Form';
import Button from '../components/Button';
import { Mail, Lock, LogIn } from 'lucide-react';

const Login = () => {
  const { login, error: authError } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [validationError, setValidationError] = useState('');

  // ✅ LOGIN SUBMIT
  const handleSubmit = async (e) => {
    e.preventDefault();
    setValidationError('');

    if (!email || !password) {
      setValidationError('Please enter both email and password.');
      return;
    }

    setLoading(true);
    try {
      const user = await login(email, password); // 🔥 IMPORTANT

      // ✅ ROLE BASED REDIRECT
      if (user?.role === 'admin') {
        navigate('/admin');
      } else {
        navigate('/employee');
      }

    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // ✅ QUICK LOGIN
  const handleQuickLogin = async (Email) => {
    setEmail(Email);
    setPassword('password123');
    setLoading(true);

    try {
      const user = await login(Email, 'password123');

      // ✅ ROLE BASED REDIRECT
      if (user?.role === 'admin') {
        navigate('/admin');
      } else {
        navigate('/employee');
      }

    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-4 relative overflow-hidden">
      
      {/* Background */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary-600/10 rounded-full blur-3xl -z-10 animate-pulse"></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-indigo-600/10 rounded-full blur-3xl -z-10 animate-pulse"></div>

      {/* Logo */}
      <div className="flex items-center gap-3 mb-8">
        <div className="w-10 h-10 rounded-xl bg-primary-600 flex items-center justify-center text-white font-black text-xl shadow-lg shadow-primary-600/40">
          E
        </div>
        <span className="text-xl font-extrabold text-slate-100 tracking-wider">
          EMS PORTAL
        </span>
      </div>

      {/* Card */}
      <div className="w-full max-w-md glass-card rounded-2xl p-8 border border-slate-800 shadow-2xl animate-enter">
        
        <h2 className="text-xl font-extrabold text-slate-100 text-center mb-1">
          Welcome Back
        </h2>
        <p className="text-xs text-slate-400 text-center mb-6">
          Sign in to manage your attendance and leaves
        </p>

        {(validationError || authError) && (
          <div className="bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs font-semibold px-4 py-3 rounded-lg mb-4 text-center">
            {validationError || authError}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          
          <FormGroup label="Email Address" icon={<Mail size={16} />}>
            <Input
              type="email"
              placeholder="name@company.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              icon
            />
          </FormGroup>

          <FormGroup label="Password" icon={<Lock size={16} />}>
            <Input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              icon
            />
          </FormGroup>

          <Button
            type="submit"
            variant="primary"
            className="w-full mt-2 font-bold"
            isLoading={loading}
            icon={<LogIn size={16} />}
          >
            Sign In
          </Button>
        </form>

        <p className="text-xs text-slate-400 text-center mt-6">
          Don't have an account?{' '}
          <Link
            to="/signup"
            className="text-primary-400 hover:text-primary-300 font-bold"
          >
            Register Here
          </Link>
        </p>

        {/* Quick Login */}
        <div className="mt-8 pt-6 border-t border-slate-800/80">
          <p className="text-[9px] font-bold text-slate-500 uppercase tracking-widest text-center mb-3">
            Fast Track Access
          </p>

          <div className="grid grid-cols-2 gap-3">
            
            <button
              onClick={() => handleQuickLogin('employee@ems.com')}
              className="text-xs py-2 px-3 bg-slate-900 border border-slate-800 rounded-lg text-slate-300 hover:bg-slate-800/80 hover:text-slate-100 transition-all font-semibold"
            >
              Employee
            </button>

            <button
              onClick={() => handleQuickLogin('admin@ems.com')}
              className="text-xs py-2 px-3 bg-slate-900 border border-slate-800 rounded-lg text-slate-300 hover:bg-slate-800/80 hover:text-slate-100 transition-all font-semibold"
            >
              HR Admin
            </button>

          </div>
        </div>

      </div>
    </div>
  );
};

export default Login;