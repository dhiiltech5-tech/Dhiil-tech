import { useState } from 'react';
import { useAdmin } from '../context/AdminContext';
import { 
    Plus, Search, Edit2, Trash2, 
    X, RotateCcw
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const AdminServices = () => {
    const { data, deleteFromCollection, updateCollection } = useAdmin();
    const [search, setSearch] = useState('');
    const [sortBy, setSortBy] = useState('name');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingService, setEditingService] = useState(null);
    const [formData, setFormData] = useState({ 
        name: '', 
        desc: '', 
        icon: 'fas fa-laptop-code'
    });

    const filteredServices = (data.services || [])
        .filter(s => 
            (s.name || '').toLowerCase().includes(search.toLowerCase()) ||
            (s.desc || '').toLowerCase().includes(search.toLowerCase())
        )
        .sort((a, b) => {
            if (sortBy === 'name') return (a.name || '').localeCompare(b.name || '');
            return b.id - a.id;
        });

    const resetFilters = () => {
        setSearch('');
        setSortBy('name');
    };

    const handleOpenModal = (service = null) => {
        if (service) {
            setEditingService(service);
            setFormData({ 
                name: service.name, 
                desc: service.desc, 
                icon: service.icon 
            });
        } else {
            setEditingService(null);
            setFormData({ name: '', desc: '', icon: 'fas fa-laptop-code' });
        }
        setIsModalOpen(true);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (editingService) {
            updateCollection('services', formData, editingService.id);
        } else {
            updateCollection('services', { ...formData, status: 'Active' });
        }
        setIsModalOpen(false);
    };

    return (
        <div className="space-y-6 pb-12">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">Our Services</h1>
                    <p className="text-slate-500 text-xs sm:text-sm font-medium mt-1">Manage the digital solutions and services offered to clients</p>
                </div>
                <button 
                    onClick={() => handleOpenModal()}
                    className="flex items-center justify-center gap-2 px-5 py-3 bg-[#04C244] text-black rounded-2xl text-xs sm:text-sm font-extrabold hover:bg-[#03a837] transition-all shadow-lg shadow-[#04C244]/20"
                >
                    <Plus size={18} />
                    <span>Add Service</span>
                </button>
            </div>

            {/* Filter Bar */}
            <div className="bg-white dark:bg-[#0A0C10] border border-black/10 dark:border-white/5 rounded-3xl p-4 sm:p-5 flex flex-col md:flex-row items-center justify-between gap-4 shadow-sm">
                <div className="relative flex-1 w-full">
                    <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input 
                        type="text" 
                        placeholder="Search services by title or description..." 
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-2xl py-3 pl-12 pr-4 text-xs sm:text-sm text-slate-900 dark:text-white focus:outline-none focus:border-[#04C244]/50 transition-all font-semibold"
                    />
                </div>

                <div className="flex items-center gap-3 w-full md:w-auto justify-end">
                    {/* Sort Filter */}
                    <div className="flex items-center gap-2 bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-2xl px-3 py-2 text-xs">
                        <span className="text-slate-400 font-medium">Sort:</span>
                        <select
                            value={sortBy}
                            onChange={(e) => setSortBy(e.target.value)}
                            className="bg-transparent text-slate-900 dark:text-white font-bold focus:outline-none cursor-pointer"
                        >
                            <option value="name" className="bg-white dark:bg-[#0A0C10]">Title (A-Z)</option>
                            <option value="newest" className="bg-white dark:bg-[#0A0C10]">Newest First</option>
                        </select>
                    </div>

                    {search && (
                        <button
                            onClick={resetFilters}
                            className="p-2.5 bg-rose-500/10 text-rose-500 hover:bg-rose-500/20 rounded-2xl text-xs font-bold transition-all flex items-center gap-1.5"
                        >
                            <RotateCcw size={14} />
                            <span className="hidden sm:inline">Reset</span>
                        </button>
                    )}
                </div>
            </div>

            {/* Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredServices.map((s, i) => (
                    <motion.div 
                        key={s.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.04 }}
                        className="bg-white dark:bg-[#0A0C10] border border-black/10 dark:border-white/5 rounded-3xl p-6 sm:p-8 hover:border-[#04C244]/30 hover:shadow-xl transition-all group relative overflow-hidden flex flex-col justify-between"
                    >
                        <div>
                            <div className="w-14 h-14 rounded-2xl bg-[#04C244]/10 border border-[#04C244]/20 flex items-center justify-center text-[#04C244] mb-6 group-hover:bg-[#04C244] group-hover:text-black transition-all duration-500 text-2xl shrink-0">
                                <i className={s.icon}></i>
                            </div>

                            <h3 className="text-lg font-extrabold text-slate-900 dark:text-white mb-2 group-hover:text-[#04C244] transition-colors">{s.name}</h3>
                            <p className="text-xs text-slate-500 leading-relaxed mb-8 line-clamp-3 font-medium">
                                {s.desc}
                            </p>
                        </div>

                        <div className="flex items-center gap-3 pt-6 border-t border-black/10 dark:border-white/5">
                            <button 
                                onClick={() => handleOpenModal(s)}
                                className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-black/5 dark:bg-white/5 hover:bg-black/10 dark:hover:bg-white/10 rounded-2xl text-xs font-bold text-slate-300 transition-all"
                            >
                                <Edit2 size={14} />
                                <span>Edit Service</span>
                            </button>
                            <button 
                                onClick={() => { if(confirm('Delete service?')) deleteFromCollection('services', s.id) }}
                                className="p-2.5 bg-rose-500/10 hover:bg-rose-500/20 rounded-2xl text-rose-500 transition-all"
                                title="Delete service"
                            >
                                <Trash2 size={14} />
                            </button>
                        </div>
                    </motion.div>
                ))}
            </div>

            {filteredServices.length === 0 && (
                <div className="p-12 bg-white dark:bg-[#0A0C10] border border-black/10 dark:border-white/5 rounded-3xl text-center text-slate-500 text-xs sm:text-sm font-medium">
                    No services found matching your search.
                </div>
            )}

            {/* Modal */}
            <AnimatePresence>
                {isModalOpen && (
                    <div className="fixed inset-0 z-60 flex items-center justify-center p-6">
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
                            className="bg-white dark:bg-[#0A0C10] border border-black/10 dark:border-white/10 rounded-3xl w-full max-w-lg overflow-hidden relative z-10 shadow-2xl"
                        >
                            <div className="p-6 border-b border-black/10 dark:border-white/5 flex items-center justify-between">
                                <h2 className="text-xl font-bold text-slate-900 dark:text-white">{editingService ? 'Edit Service' : 'New Service'}</h2>
                                <button onClick={() => setIsModalOpen(false)} className="text-slate-500 hover:text-white transition-colors">
                                    <X size={22} />
                                </button>
                            </div>
                            <form onSubmit={handleSubmit} className="p-6 space-y-6">
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">Service Name</label>
                                    <input 
                                        type="text" 
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        className="w-full bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-2xl py-3.5 px-4 text-xs sm:text-sm text-slate-900 dark:text-white focus:outline-none focus:border-[#04C244]/50 transition-all font-semibold"
                                        placeholder="e.g. Cloud Infrastructure"
                                        required
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">Description</label>
                                    <textarea 
                                        value={formData.desc}
                                        onChange={(e) => setFormData({ ...formData, desc: e.target.value })}
                                        className="w-full bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-2xl py-3.5 px-4 text-xs sm:text-sm text-slate-900 dark:text-white focus:outline-none focus:border-[#04C244]/50 transition-all min-h-[120px] resize-none font-semibold"
                                        placeholder="Describe the service..."
                                        required
                                    ></textarea>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">Service Icon</label>
                                    <div className="relative">
                                        <select 
                                            value={formData.icon}
                                            onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                                            className="w-full bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-2xl py-3.5 px-4 text-xs sm:text-sm text-slate-900 dark:text-white focus:outline-none focus:border-[#04C244]/50 transition-all appearance-none cursor-pointer font-semibold"
                                        >
                                            <option value="fas fa-laptop-code" className="bg-white dark:bg-[#0A0C10]">Web Development (Laptop)</option>
                                            <option value="fas fa-mobile-alt" className="bg-white dark:bg-[#0A0C10]">Mobile Apps (Phone)</option>
                                            <option value="fas fa-server" className="bg-white dark:bg-[#0A0C10]">Cloud Services (Server)</option>
                                            <option value="fas fa-shield-alt" className="bg-white dark:bg-[#0A0C10]">Cyber Security (Shield)</option>
                                            <option value="fas fa-chart-line" className="bg-white dark:bg-[#0A0C10]">Digital Marketing (Chart)</option>
                                            <option value="fas fa-database" className="bg-white dark:bg-[#0A0C10]">Database Management (Database)</option>
                                            <option value="fas fa-brush" className="bg-white dark:bg-[#0A0C10]">UI/UX Design (Brush)</option>
                                            <option value="fas fa-search-dollar" className="bg-white dark:bg-[#0A0C10]">SEO Optimization (Search)</option>
                                            <option value="fas fa-network-wired" className="bg-white dark:bg-[#0A0C10]">Network Solutions (Network)</option>
                                            <option value="fas fa-robot" className="bg-white dark:bg-[#0A0C10]">Artificial Intelligence (Robot)</option>
                                            <option value="fas fa-headset" className="bg-white dark:bg-[#0A0C10]">Technical Support (Headset)</option>
                                            <option value="fas fa-tools" className="bg-white dark:bg-[#0A0C10]">Maintenance (Tools)</option>
                                        </select>
                                        <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-500">
                                            <i className={formData.icon}></i>
                                        </div>
                                    </div>
                                </div>
                                <div className="pt-4 flex gap-3">
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
                                        {editingService ? 'Save Changes' : 'Create Service'}
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

export default AdminServices;
