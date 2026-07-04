import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import apiService from '../services/api';
import Card from '../components/Card';
import { FormGroup, Input } from '../components/Form';
import Button from '../components/Button';
import { User, Phone, MapPin, Briefcase, Calendar, CreditCard, ShieldCheck } from 'lucide-react';

const Profile = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({ phone: '', address: '' });
  const [saveLoading, setSaveLoading] = useState(false);
  React.useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = await apiService.getProfile();
        setProfile(data);
        setFormData({ phone: data.phone || '', address: data.address || '' });
      } catch (err) {
        console.error("Failed to load user profile:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);
  const handleSave = async (e) => {
    e.preventDefault();
    setSaveLoading(true);
    try {
      const updated = await apiService.updateProfile(formData);
      setProfile(updated);
      setEditing(false);
    } catch (err) {
      alert('Failed to update profile info');
    } finally {
      setSaveLoading(false);
    }
  };
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-primary-500"></div>
      </div>
    );
  }
  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Profile Overview Card */}
      <Card className="border border-slate-800/80 bg-gradient-to-r from-slate-900/60 to-primary-950/20">
        <div className="flex flex-col md:flex-row items-center gap-6">
          <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-primary-600 to-indigo-500 text-white flex items-center justify-center text-2xl font-extrabold uppercase shadow-lg shadow-primary-500/20 border border-primary-500/30">
            {profile?.name ? profile.name[0] : 'U'}
          </div>
          <div className="text-center md:text-left flex-grow space-y-1">
            <h2 className="text-xl font-extrabold text-slate-100 tracking-wide flex items-center justify-center md:justify-start gap-2">
              {profile?.name}
              {profile?.role === 'admin' && (
                <span className="inline-flex items-center gap-1 text-[8.5px] bg-primary-500/10 text-primary-400 border border-primary-500/20 px-2 py-0.5 rounded-full font-black uppercase">
                  <ShieldCheck size={11} /> Admin
                </span>
              )}
            </h2>
            <p className="text-slate-400 text-xs font-semibold">{profile?.designation}</p>
            <p className="text-slate-500 text-[10px] font-bold uppercase tracking-wider">{profile?.department}</p>
          </div>
          <div>
            {!editing ? (
              <Button onClick={() => setEditing(true)} variant="secondary" className="font-semibold text-xs py-1.5" size="sm">
                Edit Contact
              </Button>
            ) : (
              <div className="flex gap-2">
                <Button onClick={() => setEditing(false)} variant="outline" className="font-semibold text-xs py-1.5" size="sm">
                  Cancel
                </Button>
                <Button onClick={handleSave} variant="primary" className="font-semibold text-xs py-1.5" size="sm" isLoading={saveLoading}>
                  Save
                </Button>
              </div>
            )}
          </div>
        </div>
      </Card>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Contact Info Card */}
        <Card className="border border-slate-800/80">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">
            Contact Information
          </h3>
          <form onSubmit={handleSave} className="space-y-4">
            <FormGroup label="Email Address" icon={<User size={16} />}>
              <Input value={profile?.email} disabled icon />
            </FormGroup>
            <FormGroup label="Mobile Phone" icon={<Phone size={16} />}>
              <Input
                name="phone"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                disabled={!editing}
                placeholder="+1 (555) 000-0000"
                icon
              />
            </FormGroup>
            <FormGroup label="Home Address" icon={<MapPin size={16} />}>
              <Input
                name="address"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                disabled={!editing}
                placeholder="123 Street Name, City, Country"
                icon
              />
            </FormGroup>
          </form>
        </Card>
        {/* Professional Details Card */}
        <Card className="border border-slate-800/80 space-y-4">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">
            Professional Information
          </h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center py-2 border-b border-slate-800/60 text-xs font-semibold">
              <span className="text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                <Briefcase size={14} className="text-slate-500" /> Employee ID
              </span>
              <span className="text-slate-200">{profile?.id}</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-slate-800/60 text-xs font-semibold">
              <span className="text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                <Calendar size={14} className="text-slate-500" /> Joining Date
              </span>
              <span className="text-slate-200">{profile?.joiningDate}</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-slate-800/60 text-xs font-semibold">
              <span className="text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                <CreditCard size={14} className="text-slate-500" /> Bank Details
              </span>
              <span className="text-slate-200 font-bold">{profile?.bankAccount}</span>
            </div>
            <div className="flex justify-between items-center py-2 text-xs font-semibold">
              <span className="text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                <Briefcase size={14} className="text-slate-500" /> Base Salary
              </span>
              <span className="text-primary-400 font-bold">
                {profile?.salary ? profile.salary.toLocaleString('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }) : '$0'} / mo
              </span>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};
export default Profile;
