import { useState, useEffect } from 'react';
import { useAdmin } from '../context/AdminContext';
import { 
    Globe, Shield, 
    Smartphone, Database, Save, CheckCircle2, 
    Lock, User, Phone, Mail, MapPin, Sparkles, Key, AlertCircle, Sun, Moon, Monitor
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { API_BASE } from '../../services/api';

const AdminSettings = () => {
    const { user, hasPermission } = useAdmin();
    const [activeTab, setActiveTab] = useState('profile');
    const [isSaving, setIsSaving] = useState(false);

    // Profile States
    const [profileName, setProfileName] = useState(user?.name || '');
    const [profileEmail, setProfileEmail] = useState(user?.email || '');
    const [profilePhone, setProfilePhone] = useState(user?.phone || '');
    const [profileAvatar] = useState(user?.avatar || '');
    const [profileLoading, setProfileLoading] = useState(false);
    const [profileError, setProfileError] = useState('');
    const [profileSuccess, setProfileSuccess] = useState('');

    const calculateYearsOfExperience = () => {
        const startDate = new Date(2025, 3);
        const today = new Date();
        let years = today.getFullYear() - startDate.getFullYear();
        const m = today.getMonth() - startDate.getMonth();
        if (m < 0 || (m === 0 && today.getDate() < startDate.getDate())) {
            years--;
        }
        return Math.max(1, years);
    };

    // System Settings States
    const [siteName] = useState('Dhiil Tech');
    const [companyEmail, setCompanyEmail] = useState('info@dhiiltech.com');
    const [contactPhone, setContactPhone] = useState('+252 61 9586339');
    const [officeLocation, setOfficeLocation] = useState('Mogadishu, Somalia');
    const [projectsDone, setProjectsDone] = useState(1);
    const [trustedPartners, setTrustedPartners] = useState(20);
    const [servicesProvided, setServicesProvided] = useState(7);
    const [satisfactionRate, setSatisfactionRate] = useState(99);

    // Security States
    const [oldPassword, setOldPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [passwordError, setPasswordError] = useState('');
    const [passwordSuccess, setPasswordSuccess] = useState('');
    const [passwordLoading, setPasswordLoading] = useState(false);

    // Theme Logic
    const [theme, setTheme] = useState(() => localStorage.getItem('ots-theme') || 'system');

    const handleThemeChange = (newTheme) => {
        setTheme(newTheme);
        localStorage.setItem('ots-theme', newTheme);
        const root = document.documentElement;
        if (newTheme === 'light') {
            root.classList.remove('dark');
            root.classList.add('light');
        } else if (newTheme === 'dark') {
            root.classList.remove('light');
            root.classList.add('dark');
        } else {
            const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
            root.classList.toggle('dark', systemPrefersDark);
            root.classList.toggle('light', !systemPrefersDark);
        }
    };

    useEffect(() => {
        const fetchSettings = async () => {
            try {
                const res = await fetch(`${API_BASE}/settings/`);
                const result = await res.json();
                if (result.success && result.data) {
                    setCompanyEmail(result.data.company_email || 'info@dhiiltech.com');
                    setContactPhone(result.data.contact_phone || '+252 61 9586339');
                    setOfficeLocation(result.data.office_location || 'Mogadishu, Somalia');
                    setProjectsDone(result.data.projects_done ?? 1);
                    setTrustedPartners(result.data.trusted_partners ?? 20);
                    setServicesProvided(result.data.services_provided ?? 7);
                    setSatisfactionRate(result.data.satisfaction_rate ?? 99);
                }
            } catch (err) {
                console.error("Failed to fetch settings:", err);
            }
        };
        fetchSettings();
    }, []);

    const handleUpdateProfile = async (e) => {
        e.preventDefault();
        setProfileError('');
        setProfileSuccess('');
        setProfileLoading(true);

        try {
            const res = await fetch(`${API_BASE}/auth/profile`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${user.token}`
                },
                body: JSON.stringify({
                    name: profileName,
                    email: profileEmail,
                    phone: profilePhone,
                    avatar: profileAvatar
                })
            });

            const result = await res.json();
            if (res.ok && result.success) {
                setProfileSuccess('Profile updated successfully!');
                const updatedUser = { ...user, ...result.data };
                localStorage.setItem('ots-admin-session', JSON.stringify(updatedUser));
                setTimeout(() => window.location.reload(), 1000); 
            } else {
                setProfileError(result.message || 'Failed to update profile');
            }
        } catch (err) {
            console.error('Profile update failed:', err);
            setProfileError('Cannot connect to server.');
        } finally {
            setProfileLoading(false);
        }
    };

    const handleUpdatePassword = async (e) => {
        e.preventDefault();
        setPasswordError('');
        setPasswordSuccess('');

        if (!oldPassword || !newPassword || !confirmPassword) {
            setPasswordError('Please fill out all password fields.');
            return;
        }

        if (newPassword.length < 8) {
            setPasswordError('New password must be at least 8 characters long.');
            return;
        }

        if (newPassword !== confirmPassword) {
            setPasswordError('New passwords do not match.');
            return;
        }

        setPasswordLoading(true);
        try {
            const res = await fetch(`${API_BASE}/auth/profile`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${user.token}`
                },
                body: JSON.stringify({
                    old_password: oldPassword,
                    password: newPassword
                })
            });
            
            const result = await res.json();
            if (res.ok && result.success) {
                setPasswordSuccess('Password updated successfully!');
                setOldPassword('');
                setNewPassword('');
                setConfirmPassword('');
            } else {
                setPasswordError(result.message || 'Failed to update password.');
            }
        } catch (err) {
            console.error('Password update failed:', err);
            setPasswordError('Cannot connect to database.');
        } finally {
            setPasswordLoading(false);
        }
    };

    const handleSave = async () => {
        setIsSaving(true);
        try {
            const res = await fetch(`${API_BASE}/settings/`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${user.token}`
                },
                body: JSON.stringify({
                    company_email: companyEmail,
                    contact_phone: contactPhone,
                    office_location: officeLocation,
                    projects_done: Number(projectsDone),
                    trusted_partners: Number(trustedPartners),
                    services_provided: Number(servicesProvided),
                    satisfaction_rate: Number(satisfactionRate)
                })
            });
            const result = await res.json();
            if (res.ok && result.success) {
                window.dispatchEvent(new Event('app-settings-updated'));
                alert('System settings updated successfully!');
            } else {
                alert(result.message || 'Failed to save settings.');
            }
        } catch (err) {
            console.error('Failed to save settings:', err);
            alert('Cannot connect to database.');
        } finally {
            setIsSaving(false);
        }
    };

    const tabs = [
        { id: 'profile', label: 'My Profile', icon: <User size={18} />, desc: 'Personal account details' },
        ...(hasPermission('manage_settings') ? [{ id: 'general', label: 'System Settings', icon: <Globe size={18} />, desc: 'Company & platform stats' }] : []),
        { id: 'security', label: 'Security', icon: <Shield size={18} />, desc: 'Password & authentication' },
        { id: 'appearance', label: 'Appearance', icon: <Smartphone size={18} />, desc: 'Theme & display preferences' },
    ];

    return (
        <div className="space-y-8 pb-12">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">Account & System</h1>
                    <p className="text-slate-500 text-xs sm:text-sm font-medium mt-1">Manage your profile, security credentials, and global configurations</p>
                </div>
                {hasPermission('manage_settings') && activeTab === 'general' && (
                    <button 
                        onClick={handleSave}
                        disabled={isSaving}
                        className="flex items-center justify-center gap-2 px-6 py-3 bg-[#04C244] text-black rounded-2xl text-xs sm:text-sm font-extrabold hover:bg-[#03a837] transition-all shadow-lg shadow-[#04C244]/20 disabled:opacity-50"
                    >
                        {isSaving ? <span className="flex items-center gap-2 italic"><div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin"></div> Saving...</span> : <><Save size={18} /><span>Save Configuration</span></>}
                    </button>
                )}
            </div>

            {/* Layout Grid: Left Sidebar Tabs + Right Content Box */}
            <div className="flex flex-col lg:flex-row gap-8 items-start">
                
                {/* Vertical Navigation Tabs */}
                <div className="w-full lg:w-72 shrink-0 bg-white dark:bg-[#0A0C10] border border-black/10 dark:border-white/5 rounded-3xl p-3 sm:p-4 shadow-sm">
                    <div className="space-y-1.5">
                        {tabs.map((tab) => {
                            const isActive = activeTab === tab.id;
                            return (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={`
                                        w-full flex items-center gap-3.5 p-3.5 rounded-2xl text-left transition-all duration-200 group relative overflow-hidden
                                        ${isActive 
                                            ? 'bg-[#04C244]/15 text-[#04C244] font-extrabold border border-[#04C244]/30 shadow-md shadow-[#04C244]/5' 
                                            : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/5 border border-transparent'
                                        }
                                    `}
                                >
                                    {isActive && (
                                        <motion.div 
                                            layoutId="tabGlow" 
                                            className="absolute inset-0 bg-gradient-to-r from-[#04C244]/10 to-transparent pointer-events-none rounded-2xl" 
                                        />
                                    )}
                                    <div className={`p-2.5 rounded-xl transition-all ${isActive ? 'bg-[#04C244] text-black shadow-md shadow-[#04C244]/30' : 'bg-black/5 dark:bg-white/5 text-slate-500 group-hover:text-slate-900 dark:group-hover:text-white'}`}>
                                        {tab.icon}
                                    </div>
                                    <div className="min-w-0">
                                        <p className="text-xs sm:text-sm tracking-tight truncate">{tab.label}</p>
                                        <p className="text-[10px] text-slate-400 font-medium truncate">{tab.desc}</p>
                                    </div>
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* Right Form Content */}
                <div className="flex-1 w-full">
                    <AnimatePresence mode="wait">
                        
                        {/* MY PROFILE TAB */}
                        {activeTab === 'profile' && (
                            <motion.div 
                                key="profile"
                                initial={{ opacity: 0, y: 12 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -12 }}
                                transition={{ duration: 0.2 }}
                                className="bg-white dark:bg-[#0A0C10] border border-black/10 dark:border-white/5 rounded-3xl p-6 sm:p-10 space-y-8 shadow-sm relative overflow-hidden"
                            >
                                <div className="flex items-center justify-between pb-6 border-b border-black/10 dark:border-white/5">
                                    <div className="flex items-center gap-4">
                                        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#04C244] to-emerald-500 text-black flex items-center justify-center font-black text-2xl shadow-lg shadow-[#04C244]/20 border border-white/20">
                                            {profileName.charAt(0) || 'A'}
                                        </div>
                                        <div>
                                            <h3 className="text-lg font-bold text-slate-900 dark:text-white">Personal Information</h3>
                                            <p className="text-xs text-slate-500">Update your account credentials and personal information</p>
                                        </div>
                                    </div>
                                    <span className="px-3 py-1 bg-[#04C244]/15 border border-[#04C244]/30 text-[#04C244] text-xs font-extrabold rounded-full">
                                        {user?.role || 'Super Admin'}
                                    </span>
                                </div>

                                <form onSubmit={handleUpdateProfile} className="space-y-6">
                                    {profileError && (
                                        <div className="p-4 bg-rose-500/10 border border-rose-500/20 text-rose-500 text-xs font-bold rounded-2xl flex items-center gap-2">
                                            <AlertCircle size={16} />
                                            <span>{profileError}</span>
                                        </div>
                                    )}
                                    {profileSuccess && (
                                        <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 text-xs font-bold rounded-2xl flex items-center gap-2">
                                            <CheckCircle2 size={16} />
                                            <span>{profileSuccess}</span>
                                        </div>
                                    )}

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <label className="text-[11px] font-extrabold text-slate-500 dark:text-slate-400 uppercase tracking-widest ml-1">Full Name</label>
                                            <div className="relative">
                                                <input 
                                                    type="text" 
                                                    required
                                                    value={profileName}
                                                    onChange={(e) => setProfileName(e.target.value)}
                                                    className="w-full bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-2xl py-3.5 px-4 text-slate-900 dark:text-white focus:outline-none focus:border-[#04C244]/50 focus:ring-2 focus:ring-[#04C244]/20 transition-all text-sm font-semibold" 
                                                />
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            <label className="text-[11px] font-extrabold text-slate-500 dark:text-slate-400 uppercase tracking-widest ml-1">Email Address</label>
                                            <div className="relative">
                                                <input 
                                                    type="email" 
                                                    required
                                                    value={profileEmail}
                                                    onChange={(e) => setProfileEmail(e.target.value)}
                                                    className="w-full bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-2xl py-3.5 px-4 text-slate-900 dark:text-white focus:outline-none focus:border-[#04C244]/50 focus:ring-2 focus:ring-[#04C244]/20 transition-all text-sm font-semibold" 
                                                />
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            <label className="text-[11px] font-extrabold text-slate-500 dark:text-slate-400 uppercase tracking-widest ml-1">Phone Number</label>
                                            <div className="relative">
                                                <input 
                                                    type="text" 
                                                    value={profilePhone}
                                                    onChange={(e) => setProfilePhone(e.target.value)}
                                                    placeholder="+252 61 XXXXXXX"
                                                    className="w-full bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-2xl py-3.5 px-4 text-slate-900 dark:text-white focus:outline-none focus:border-[#04C244]/50 focus:ring-2 focus:ring-[#04C244]/20 transition-all text-sm font-semibold" 
                                                />
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            <label className="text-[11px] font-extrabold text-slate-500 dark:text-slate-400 uppercase tracking-widest ml-1">Role (Read-Only)</label>
                                            <input 
                                                type="text" 
                                                value={user?.role || 'Super Admin'}
                                                readOnly
                                                className="w-full bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-2xl py-3.5 px-4 text-slate-400 dark:text-slate-500 focus:outline-none text-sm font-semibold cursor-not-allowed" 
                                            />
                                        </div>
                                    </div>

                                    <div className="pt-4 border-t border-black/10 dark:border-white/5 flex justify-end">
                                        <button 
                                            type="submit"
                                            disabled={profileLoading}
                                            className="px-8 py-3.5 bg-[#04C244] text-black rounded-2xl text-xs sm:text-sm font-extrabold hover:bg-[#03a837] transition-all shadow-lg shadow-[#04C244]/20 disabled:opacity-50 flex items-center gap-2"
                                        >
                                            <Save size={16} />
                                            {profileLoading ? 'Updating Profile...' : 'Save Profile Changes'}
                                        </button>
                                    </div>
                                </form>
                            </motion.div>
                        )}

                        {/* SYSTEM SETTINGS TAB */}
                        {activeTab === 'general' && hasPermission('manage_settings') && (
                            <motion.div 
                                key="general"
                                initial={{ opacity: 0, y: 12 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -12 }}
                                transition={{ duration: 0.2 }}
                                className="bg-white dark:bg-[#0A0C10] border border-black/10 dark:border-white/5 rounded-3xl p-6 sm:p-10 space-y-8 shadow-sm"
                            >
                                <section>
                                    <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-2.5">
                                        <Globe className="text-[#04C244]" size={20} />
                                        Company Information
                                    </h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <div className="flex justify-between items-center mr-1">
                                                <label className="text-[11px] font-extrabold text-slate-500 dark:text-slate-400 uppercase tracking-widest ml-1">Website Name</label>
                                                <span className="text-[9px] bg-[#04C244]/10 text-[#04C244] font-extrabold px-2 py-0.5 rounded-md border border-[#04C244]/20">Fixed</span>
                                            </div>
                                            <input 
                                                type="text" 
                                                value={siteName} 
                                                readOnly
                                                className="w-full bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-2xl py-3.5 px-4 text-slate-400 dark:text-slate-500 focus:outline-none cursor-not-allowed text-sm font-semibold" 
                                            />
                                        </div>

                                        <div className="space-y-2">
                                            <label className="text-[11px] font-extrabold text-slate-500 dark:text-slate-400 uppercase tracking-widest ml-1">Company Email</label>
                                            <input 
                                                type="email" 
                                                value={companyEmail} 
                                                onChange={(e) => setCompanyEmail(e.target.value)} 
                                                className="w-full bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-2xl py-3.5 px-4 text-slate-900 dark:text-white focus:outline-none focus:border-[#04C244]/50 transition-all text-sm font-semibold" 
                                            />
                                        </div>

                                        <div className="space-y-2">
                                            <label className="text-[11px] font-extrabold text-slate-500 dark:text-slate-400 uppercase tracking-widest ml-1">Contact Phone</label>
                                            <input 
                                                type="text" 
                                                value={contactPhone} 
                                                onChange={(e) => setContactPhone(e.target.value)} 
                                                className="w-full bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-2xl py-3.5 px-4 text-slate-900 dark:text-white focus:outline-none focus:border-[#04C244]/50 transition-all text-sm font-semibold" 
                                            />
                                        </div>

                                        <div className="space-y-2">
                                            <label className="text-[11px] font-extrabold text-slate-500 dark:text-slate-400 uppercase tracking-widest ml-1">Office Location</label>
                                            <input 
                                                type="text" 
                                                value={officeLocation} 
                                                onChange={(e) => setOfficeLocation(e.target.value)} 
                                                className="w-full bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-2xl py-3.5 px-4 text-slate-900 dark:text-white focus:outline-none focus:border-[#04C244]/50 transition-all text-sm font-semibold" 
                                            />
                                        </div>
                                    </div>
                                </section>

                                <section className="pt-8 border-t border-black/10 dark:border-white/5">
                                    <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-2.5">
                                        <Database className="text-[#04C244]" size={20} />
                                        Public Statistics
                                    </h3>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
                                        <div className="space-y-2">
                                            <label className="text-[11px] font-extrabold text-slate-500 dark:text-slate-400 uppercase tracking-widest ml-1">Projects Done (+)</label>
                                            <input 
                                                type="number" 
                                                value={projectsDone} 
                                                onChange={(e) => setProjectsDone(e.target.value)} 
                                                className="w-full bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-2xl py-3.5 px-4 text-slate-900 dark:text-white focus:outline-none focus:border-[#04C244]/50 transition-all text-sm font-semibold" 
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[11px] font-extrabold text-slate-500 dark:text-slate-400 uppercase tracking-widest ml-1">Trusted Partners (+)</label>
                                            <input 
                                                type="number" 
                                                value={trustedPartners} 
                                                onChange={(e) => setTrustedPartners(e.target.value)} 
                                                className="w-full bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-2xl py-3.5 px-4 text-slate-900 dark:text-white focus:outline-none focus:border-[#04C244]/50 transition-all text-sm font-semibold" 
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[11px] font-extrabold text-slate-500 dark:text-slate-400 uppercase tracking-widest ml-1">Services Provided (+)</label>
                                            <input 
                                                type="number" 
                                                value={servicesProvided} 
                                                onChange={(e) => setServicesProvided(e.target.value)} 
                                                className="w-full bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-2xl py-3.5 px-4 text-slate-900 dark:text-white focus:outline-none focus:border-[#04C244]/50 transition-all text-sm font-semibold" 
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[11px] font-extrabold text-slate-500 dark:text-slate-400 uppercase tracking-widest ml-1">Years Experience</label>
                                            <input 
                                                type="number" 
                                                value={calculateYearsOfExperience()} 
                                                readOnly
                                                className="w-full bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-2xl py-3.5 px-4 text-slate-400 dark:text-slate-500 focus:outline-none cursor-not-allowed text-sm font-semibold" 
                                            />
                                        </div>
                                    </div>
                                </section>
                            </motion.div>
                        )}

                        {/* SECURITY TAB */}
                        {activeTab === 'security' && (
                            <motion.div 
                                key="security"
                                initial={{ opacity: 0, y: 12 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -12 }}
                                transition={{ duration: 0.2 }}
                                className="bg-white dark:bg-[#0A0C10] border border-black/10 dark:border-white/5 rounded-3xl p-6 sm:p-10 space-y-8 shadow-sm"
                            >
                                <section>
                                    <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-2.5">
                                        <Lock className="text-[#04C244]" size={20} />
                                        Password Management
                                    </h3>
                                    <form onSubmit={handleUpdatePassword} className="max-w-md space-y-6">
                                        {passwordError && (
                                            <div className="p-4 bg-rose-500/10 border border-rose-500/20 text-rose-500 text-xs font-bold rounded-2xl flex items-center gap-2">
                                                <AlertCircle size={16} />
                                                <span>{passwordError}</span>
                                            </div>
                                        )}
                                        {passwordSuccess && (
                                            <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 text-xs font-bold rounded-2xl flex items-center gap-2">
                                                <CheckCircle2 size={16} />
                                                <span>{passwordSuccess}</span>
                                            </div>
                                        )}

                                        <div className="space-y-2">
                                            <label className="text-[11px] font-extrabold text-slate-500 dark:text-slate-400 uppercase tracking-widest ml-1">Current Password</label>
                                            <input 
                                                type="password" 
                                                required
                                                value={oldPassword}
                                                onChange={(e) => setOldPassword(e.target.value)}
                                                placeholder="Enter current password" 
                                                className="w-full bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-2xl py-3.5 px-4 text-slate-900 dark:text-white focus:outline-none focus:border-[#04C244]/50 transition-all text-sm font-semibold" 
                                            />
                                        </div>

                                        <div className="space-y-2">
                                            <label className="text-[11px] font-extrabold text-slate-500 dark:text-slate-400 uppercase tracking-widest ml-1">New Password</label>
                                            <input 
                                                type="password" 
                                                required
                                                value={newPassword}
                                                onChange={(e) => setNewPassword(e.target.value)}
                                                placeholder="Min. 8 characters" 
                                                className="w-full bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-2xl py-3.5 px-4 text-slate-900 dark:text-white focus:outline-none focus:border-[#04C244]/50 transition-all text-sm font-semibold" 
                                            />
                                        </div>

                                        <div className="space-y-2">
                                            <label className="text-[11px] font-extrabold text-slate-500 dark:text-slate-400 uppercase tracking-widest ml-1">Confirm New Password</label>
                                            <input 
                                                type="password" 
                                                required
                                                value={confirmPassword}
                                                onChange={(e) => setConfirmPassword(e.target.value)}
                                                placeholder="Confirm new password" 
                                                className="w-full bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-2xl py-3.5 px-4 text-slate-900 dark:text-white focus:outline-none focus:border-[#04C244]/50 transition-all text-sm font-semibold" 
                                            />
                                        </div>

                                        <button 
                                            type="submit"
                                            disabled={passwordLoading}
                                            className="px-8 py-3.5 bg-[#04C244] text-black disabled:opacity-50 rounded-2xl text-xs sm:text-sm font-extrabold hover:bg-[#03a837] transition-all shadow-lg shadow-[#04C244]/20 flex items-center gap-2"
                                        >
                                            <Key size={16} />
                                            {passwordLoading ? 'Updating…' : 'Update Password'}
                                        </button>
                                    </form>
                                </section>
                            </motion.div>
                        )}

                        {/* APPEARANCE TAB */}
                        {activeTab === 'appearance' && (
                            <motion.div 
                                key="appearance"
                                initial={{ opacity: 0, y: 12 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -12 }}
                                transition={{ duration: 0.2 }}
                                className="bg-white dark:bg-[#0A0C10] border border-black/10 dark:border-white/5 rounded-3xl p-6 sm:p-10 space-y-8 shadow-sm"
                            >
                                <section>
                                    <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-2.5">
                                        <Smartphone className="text-[#04C244]" size={20} />
                                        Theme & Display Preferences
                                    </h3>
                                    <div className="space-y-6 max-w-3xl">
                                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                                            <button 
                                                onClick={() => handleThemeChange('light')}
                                                className={`p-5 border-2 ${theme === 'light' ? 'border-[#04C244] bg-[#04C244]/10' : 'border-black/10 dark:border-white/10 bg-black/5 dark:bg-white/5'} rounded-3xl text-left transition-all hover:scale-[1.02] group`}
                                            >
                                                <div className="flex items-center justify-between mb-4">
                                                    <div className="p-2.5 rounded-2xl bg-amber-500/10 text-amber-500"><Sun size={20} /></div>
                                                    {theme === 'light' && <span className="w-2.5 h-2.5 rounded-full bg-[#04C244]"></span>}
                                                </div>
                                                <h4 className="text-sm font-extrabold text-slate-900 dark:text-white">Light Theme</h4>
                                                <p className="text-xs text-slate-500 mt-1">Clean & crisp light dashboard style</p>
                                            </button>

                                            <button 
                                                onClick={() => handleThemeChange('dark')}
                                                className={`p-5 border-2 ${theme === 'dark' ? 'border-[#04C244] bg-[#04C244]/10' : 'border-black/10 dark:border-white/10 bg-black/5 dark:bg-white/5'} rounded-3xl text-left transition-all hover:scale-[1.02] group`}
                                            >
                                                <div className="flex items-center justify-between mb-4">
                                                    <div className="p-2.5 rounded-2xl bg-indigo-500/10 text-indigo-500"><Moon size={20} /></div>
                                                    {theme === 'dark' && <span className="w-2.5 h-2.5 rounded-full bg-[#04C244]"></span>}
                                                </div>
                                                <h4 className="text-sm font-extrabold text-slate-900 dark:text-white">Dark Theme</h4>
                                                <p className="text-xs text-slate-500 mt-1">Sleek dark mode for low-light environments</p>
                                            </button>

                                            <button 
                                                onClick={() => handleThemeChange('system')}
                                                className={`p-5 border-2 ${theme === 'system' ? 'border-[#04C244] bg-[#04C244]/10' : 'border-black/10 dark:border-white/10 bg-black/5 dark:bg-white/5'} rounded-3xl text-left transition-all hover:scale-[1.02] group`}
                                            >
                                                <div className="flex items-center justify-between mb-4">
                                                    <div className="p-2.5 rounded-2xl bg-emerald-500/10 text-emerald-500"><Monitor size={20} /></div>
                                                    {theme === 'system' && <span className="w-2.5 h-2.5 rounded-full bg-[#04C244]"></span>}
                                                </div>
                                                <h4 className="text-sm font-extrabold text-slate-900 dark:text-white">System Sync</h4>
                                                <p className="text-xs text-slate-500 mt-1">Auto matches your operating system theme</p>
                                            </button>
                                        </div>
                                    </div>
                                </section>
                            </motion.div>
                        )}

                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
};

export default AdminSettings;
