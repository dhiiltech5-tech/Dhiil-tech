import { useState } from 'react';
import { useAdmin } from '../context/AdminContext';
import { Search, Plus, Edit2, Trash2, Shield, Circle, X, Lock, Activity, Filter, RotateCcw } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import RolePicker from '../components/RolePicker';

const AdminUsers = () => {
    const { data, deleteFromCollection, updateCollection } = useAdmin();
    const [search, setSearch] = useState('');
    const [roleFilter, setRoleFilter] = useState('All');
    const [statusFilter, setStatusFilter] = useState('All');
    const [sortBy, setSortBy] = useState('name');
    
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingUser, setEditingUser] = useState(null);
    const [formData, setFormData] = useState({ 
        name: '', 
        email: '', 
        role: 'Admin', 
        status: 'Active',
        password: '',
        permissions: ['manage_content', 'manage_team']
    });

    const filteredUsers = (data.users || [])
        .filter(u => {
            const matchesSearch = u.name.toLowerCase().includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase());
            const matchesRole = roleFilter === 'All' || u.role === roleFilter;
            const matchesStatus = statusFilter === 'All' || u.status === statusFilter;
            return matchesSearch && matchesRole && matchesStatus;
        })
        .sort((a, b) => {
            if (sortBy === 'name') return a.name.localeCompare(b.name);
            if (sortBy === 'role') return a.role.localeCompare(b.role);
            if (sortBy === 'status') return a.status.localeCompare(b.status);
            return b.id - a.id;
        });

    const resetFilters = () => {
        setSearch('');
        setRoleFilter('All');
        setStatusFilter('All');
        setSortBy('name');
    };

    const handleOpenModal = (user = null) => {
        if (user) {
            setEditingUser(user);
            setFormData({ 
                name: user.name, 
                email: user.email, 
                role: user.role, 
                status: user.status || 'Active',
                password: '',
                permissions: user.permissions || []
            });
        } else {
            setEditingUser(null);
            setFormData({ 
                name: '', 
                email: '', 
                role: 'Admin', 
                status: 'Active',
                password: '',
                permissions: ['manage_content', 'manage_team']
            });
        }
        setIsModalOpen(true);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const submissionData = { ...formData };
        if (editingUser && !submissionData.password) {
            delete submissionData.password;
        }

        if (editingUser) {
            updateCollection('users', submissionData, editingUser.id);
        } else {
            updateCollection('users', { 
                ...submissionData, 
                joined: new Date().toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' }) 
            });
        }
        setIsModalOpen(false);
    };

    const handleRoleChange = (roleId, permissions) => {
        setFormData({ ...formData, role: roleId, permissions });
    };

    return (
        <div className="space-y-6 pb-12">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">User Management</h1>
                    <p className="text-slate-500 text-xs sm:text-sm font-medium mt-1">Manage administrative access and system permissions</p>
                </div>
                <button 
                    onClick={() => handleOpenModal()}
                    className="flex items-center justify-center gap-2 px-5 py-3 bg-[#04C244] text-black rounded-2xl text-xs sm:text-sm font-extrabold hover:bg-[#03a837] transition-all shadow-lg shadow-[#04C244]/20"
                >
                    <Plus size={18} />
                    <span>Add New User</span>
                </button>
            </div>

            {/* Filtering & Search Bar */}
            <div className="bg-white dark:bg-[#0A0C10] border border-black/10 dark:border-white/5 rounded-3xl p-4 sm:p-5 flex flex-col md:flex-row items-center justify-between gap-4 shadow-sm">
                {/* Search Input */}
                <div className="relative flex-1 w-full">
                    <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input 
                        type="text" 
                        placeholder="Search users by name or email..." 
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-2xl py-3 pl-12 pr-4 text-xs sm:text-sm text-slate-900 dark:text-white focus:outline-none focus:border-[#04C244]/50 transition-all font-semibold"
                    />
                </div>

                {/* Filter Controls */}
                <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
                    {/* Role Filter */}
                    <div className="flex items-center gap-2 bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-2xl px-3 py-2 text-xs">
                        <Filter size={14} className="text-slate-400 shrink-0" />
                        <select
                            value={roleFilter}
                            onChange={(e) => setRoleFilter(e.target.value)}
                            className="bg-transparent text-slate-900 dark:text-white font-bold focus:outline-none cursor-pointer"
                        >
                            <option value="All" className="bg-white dark:bg-[#0A0C10]">All Roles</option>
                            <option value="Super Admin" className="bg-white dark:bg-[#0A0C10]">Super Admin</option>
                            <option value="Admin" className="bg-white dark:bg-[#0A0C10]">Admin</option>
                            <option value="Editor" className="bg-white dark:bg-[#0A0C10]">Editor</option>
                            <option value="Employee" className="bg-white dark:bg-[#0A0C10]">Employee</option>
                            <option value="Viewer" className="bg-white dark:bg-[#0A0C10]">Viewer</option>
                        </select>
                    </div>

                    {/* Status Filter */}
                    <div className="flex items-center gap-2 bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-2xl px-3 py-2 text-xs">
                        <Activity size={14} className="text-slate-400 shrink-0" />
                        <select
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                            className="bg-transparent text-slate-900 dark:text-white font-bold focus:outline-none cursor-pointer"
                        >
                            <option value="All" className="bg-white dark:bg-[#0A0C10]">All Statuses</option>
                            <option value="Active" className="bg-white dark:bg-[#0A0C10]">Active</option>
                            <option value="Offline" className="bg-white dark:bg-[#0A0C10]">Offline</option>
                        </select>
                    </div>

                    {/* Sort Dropdown */}
                    <div className="flex items-center gap-2 bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-2xl px-3 py-2 text-xs">
                        <span className="text-slate-400 font-medium">Sort:</span>
                        <select
                            value={sortBy}
                            onChange={(e) => setSortBy(e.target.value)}
                            className="bg-transparent text-slate-900 dark:text-white font-bold focus:outline-none cursor-pointer"
                        >
                            <option value="name" className="bg-white dark:bg-[#0A0C10]">Name (A-Z)</option>
                            <option value="role" className="bg-white dark:bg-[#0A0C10]">Role</option>
                            <option value="status" className="bg-white dark:bg-[#0A0C10]">Status</option>
                        </select>
                    </div>

                    {/* Reset Button */}
                    {(search || roleFilter !== 'All' || statusFilter !== 'All') && (
                        <button
                            onClick={resetFilters}
                            className="p-2.5 bg-rose-500/10 text-rose-500 hover:bg-rose-500/20 rounded-2xl text-xs font-bold transition-all flex items-center gap-1.5"
                            title="Reset filters"
                        >
                            <RotateCcw size={14} />
                            <span className="hidden sm:inline">Reset</span>
                        </button>
                    )}
                </div>
            </div>

            {/* Users Table */}
            <div className="bg-white dark:bg-[#0A0C10] border border-black/10 dark:border-white/5 rounded-3xl overflow-hidden shadow-sm">
                <div className="overflow-x-auto">
                    <table className="w-full border-collapse">
                        <thead>
                            <tr className="text-left border-b border-black/10 dark:border-white/5 text-[10px] font-extrabold uppercase tracking-widest text-slate-500">
                                <th className="px-8 py-5">User</th>
                                <th className="px-8 py-5">Access Role</th>
                                <th className="px-8 py-5">Status</th>
                                <th className="px-8 py-5">Joined Date</th>
                                <th className="px-8 py-5 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-black/10 dark:divide-white/5">
                            {filteredUsers.map((u, i) => (
                                <motion.tr 
                                    key={u.id}
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ delay: i * 0.04 }}
                                    className="hover:bg-black/5 dark:hover:bg-white/5 transition-colors group"
                                >
                                    <td className="px-8 py-5">
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-[#04C244]/20 to-emerald-500/10 flex items-center justify-center text-[#04C244] font-extrabold text-sm border border-[#04C244]/20 shrink-0">
                                                {u.name.charAt(0)}
                                            </div>
                                            <div>
                                                <p className="text-xs sm:text-sm font-extrabold text-slate-900 dark:text-white group-hover:text-[#04C244] transition-colors">{u.name}</p>
                                                <p className="text-xs text-slate-500 font-medium">{u.email}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-8 py-5">
                                        <div className="flex items-center gap-2">
                                            <Shield size={14} className={u.role === 'Super Admin' ? 'text-amber-500' : 'text-slate-500'} />
                                            <span className="text-xs font-bold text-slate-700 dark:text-slate-300">{u.role}</span>
                                        </div>
                                    </td>
                                    <td className="px-8 py-5">
                                        <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wide ${u.status === 'Active' ? 'bg-[#04C244]/15 text-[#04C244] border border-[#04C244]/30' : 'bg-slate-500/10 text-slate-500'}`}>
                                            <Circle size={7} fill="currentColor" />
                                            <span>{u.status}</span>
                                        </div>
                                    </td>
                                    <td className="px-8 py-5">
                                        <span className="text-xs font-medium text-slate-500">{u.joined || 'Recent'}</span>
                                    </td>
                                    <td className="px-8 py-5 text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            <button 
                                                onClick={() => handleOpenModal(u)}
                                                className="p-2.5 bg-black/5 dark:bg-white/5 rounded-xl text-slate-400 hover:text-[#04C244] hover:bg-[#04C244]/10 transition-all"
                                                title="Edit user"
                                            >
                                                <Edit2 size={15} />
                                            </button>
                                            <button 
                                                onClick={() => { if(confirm('Are you sure you want to delete this user?')) deleteFromCollection('users', u.id) }}
                                                className="p-2.5 bg-black/5 dark:bg-white/5 rounded-xl text-slate-400 hover:text-rose-500 hover:bg-rose-500/10 transition-all"
                                                title="Delete user"
                                            >
                                                <Trash2 size={15} />
                                            </button>
                                        </div>
                                    </td>
                                </motion.tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                {filteredUsers.length === 0 && (
                    <div className="p-12 text-center text-slate-500 font-medium text-xs sm:text-sm">
                        No users found matching your active filters.
                    </div>
                )}
            </div>

            {/* Modal */}
            <AnimatePresence>
                {isModalOpen && (
                    <div className="fixed inset-0 z-100 flex items-center justify-center p-6">
                        <motion.div 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsModalOpen(false)}
                            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
                        ></motion.div>
                        <motion.div 
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            className="bg-white dark:bg-[#0A0C10] border border-black/10 dark:border-white/10 rounded-3xl w-full max-w-lg max-h-[90vh] overflow-hidden relative z-10 shadow-2xl flex flex-col"
                        >
                            <div className="p-6 border-b border-black/10 dark:border-white/5 flex items-center justify-between shrink-0">
                                <h2 className="text-xl font-bold text-slate-900 dark:text-white">{editingUser ? 'Edit System User' : 'Create New User'}</h2>
                                <button onClick={() => setIsModalOpen(false)} className="text-slate-500 hover:text-white transition-colors">
                                    <X size={22} />
                                </button>
                            </div>
                            
                            <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-6 custom-scrollbar">
                                <div className="space-y-4">
                                    <h3 className="text-xs font-extrabold text-[#04C244] uppercase tracking-widest">Personal Information</h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">Full Name</label>
                                            <input 
                                                type="text" 
                                                value={formData.name}
                                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                                className="w-full bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-2xl py-3 px-4 text-xs sm:text-sm text-slate-900 dark:text-white focus:outline-none focus:border-[#04C244]/50 transition-all font-semibold"
                                                placeholder="e.g. Faisal Hassan"
                                                required
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">Email Address</label>
                                            <input 
                                                type="email" 
                                                value={formData.email}
                                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                                className="w-full bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-2xl py-3 px-4 text-xs sm:text-sm text-slate-900 dark:text-white focus:outline-none focus:border-[#04C244]/50 transition-all font-semibold"
                                                placeholder="email@example.com"
                                                required
                                            />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1 flex items-center gap-2">
                                                <Lock size={12} />
                                                {editingUser ? 'New Password (Optional)' : 'Password'}
                                            </label>
                                            <input 
                                                type="password" 
                                                value={formData.password}
                                                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                                className="w-full bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-2xl py-3 px-4 text-xs sm:text-sm text-slate-900 dark:text-white focus:outline-none focus:border-[#04C244]/50 transition-all font-semibold"
                                                placeholder="••••••••"
                                                required={!editingUser}
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1 flex items-center gap-2">
                                                <Activity size={12} />
                                                Account Status
                                            </label>
                                            <div className="flex items-center gap-2 p-1 bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-2xl">
                                                {['Active', 'Offline'].map((status) => (
                                                    <button
                                                        key={status}
                                                        type="button"
                                                        onClick={() => setFormData({ ...formData, status })}
                                                        className={`flex-1 py-2 text-[10px] font-bold uppercase rounded-xl transition-all ${formData.status === status ? 'bg-[#04C244] text-black font-extrabold' : 'text-slate-500 hover:text-white'}`}
                                                    >
                                                        {status}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <h3 className="text-xs font-extrabold text-[#04C244] uppercase tracking-widest">Access Role & Permissions</h3>
                                    <RolePicker 
                                        value={formData.role} 
                                        onChange={handleRoleChange} 
                                    />
                                </div>

                                <div className="pt-4 flex gap-3 shrink-0">
                                    <button 
                                        type="button"
                                        onClick={() => setIsModalOpen(false)}
                                        className="flex-1 py-3.5 bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-2xl text-xs sm:text-sm font-bold text-slate-400 hover:text-white transition-all"
                                    >
                                        Cancel
                                    </button>
                                    <button 
                                        type="submit"
                                        className="flex-1 py-3.5 bg-[#04C244] text-black rounded-2xl text-xs sm:text-sm font-extrabold hover:bg-[#03a837] transition-all shadow-xl shadow-[#04C244]/20"
                                    >
                                        {editingUser ? 'Save Changes' : 'Create Account'}
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default AdminUsers;
