import { useState } from 'react';
import { useAdmin } from '../context/AdminContext';
import { 
    Plus, Search, Edit2, Trash2, ExternalLink, 
    Calendar, Briefcase, Building2, 
    X, Filter, RotateCcw
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const AdminProjects = () => {
    const { data, deleteFromCollection, updateCollection } = useAdmin();
    const [search, setSearch] = useState('');
    const [categoryFilter, setCategoryFilter] = useState('All');
    const [statusFilter, setStatusFilter] = useState('All');
    const [sortBy, setSortBy] = useState('newest');

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingProject, setEditingProject] = useState(null);
    const [formData, setFormData] = useState({ 
        name: '', 
        client: '', 
        status: 'Development', 
        deadline: '',
        url: '',
        category: 'Web Development',
        image: ''
    });

    const filteredProjects = (data.projects || [])
        .filter(p => {
            const matchesSearch = (p.name || p.title || '').toLowerCase().includes(search.toLowerCase()) || (p.client || '').toLowerCase().includes(search.toLowerCase());
            const matchesCategory = categoryFilter === 'All' || p.category === categoryFilter;
            const matchesStatus = statusFilter === 'All' || p.status === statusFilter;
            return matchesSearch && matchesCategory && matchesStatus;
        })
        .sort((a, b) => {
            if (sortBy === 'name') return (a.name || a.title || '').localeCompare(b.name || b.title || '');
            if (sortBy === 'progress') return (b.progress || 0) - (a.progress || 0);
            return b.id - a.id;
        });

    const resetFilters = () => {
        setSearch('');
        setCategoryFilter('All');
        setStatusFilter('All');
        setSortBy('newest');
    };

    const handleOpenModal = (project = null) => {
        if (project) {
            setEditingProject(project);
            let dateVal = '';
            try {
                const d = new Date(project.deadline);
                if(!isNaN(d.getTime())) dateVal = d.toISOString().split('T')[0];
            } catch {
                // Ignore parsing error
            }

            setFormData({ 
                name: project.name || project.title || '', 
                client: project.client || '', 
                status: project.status || 'Development', 
                deadline: dateVal,
                url: project.url || '',
                category: project.category || 'Web Development',
                image: project.image || ''
            });
        } else {
            setEditingProject(null);
            setFormData({ 
                name: '', 
                client: '', 
                status: 'Development', 
                deadline: '',
                url: '',
                category: 'Web Development',
                image: ''
            });
        }
        setIsModalOpen(true);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const dateObj = new Date(formData.deadline);
        const formattedDate = !isNaN(dateObj.getTime()) ? dateObj.toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' }) : 'Ongoing';

        const submissionData = {
            ...formData,
            deadline: formattedDate,
            progress: formData.status === 'Live' ? 100 : (editingProject?.progress || 40),
            icon: formData.category === 'Mobile App' ? 'fas fa-mobile-alt' : 'fas fa-code'
        };

        if (editingProject) {
            updateCollection('projects', submissionData, editingProject.id);
        } else {
            updateCollection('projects', submissionData);
        }
        setIsModalOpen(false);
    };

    return (
        <div className="space-y-6 pb-12">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">Project Portfolio</h1>
                    <p className="text-slate-500 text-xs sm:text-sm font-medium mt-1">Manage client software solutions and digital products</p>
                </div>
                <button 
                    onClick={() => handleOpenModal()}
                    className="flex items-center justify-center gap-2 px-5 py-3 bg-[#04C244] text-black rounded-2xl text-xs sm:text-sm font-extrabold hover:bg-[#03a837] transition-all shadow-lg shadow-[#04C244]/20"
                >
                    <Plus size={18} />
                    <span>Create Project</span>
                </button>
            </div>

            {/* Filter Bar */}
            <div className="bg-white dark:bg-[#0A0C10] border border-black/10 dark:border-white/5 rounded-3xl p-4 sm:p-5 flex flex-col md:flex-row items-center justify-between gap-4 shadow-sm">
                <div className="relative flex-1 w-full">
                    <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input 
                        type="text" 
                        placeholder="Search projects or clients..." 
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-2xl py-3 pl-12 pr-4 text-xs sm:text-sm text-slate-900 dark:text-white focus:outline-none focus:border-[#04C244]/50 transition-all font-semibold"
                    />
                </div>

                <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
                    {/* Category Filter */}
                    <div className="flex items-center gap-2 bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-2xl px-3 py-2 text-xs">
                        <Filter size={14} className="text-slate-400 shrink-0" />
                        <select
                            value={categoryFilter}
                            onChange={(e) => setCategoryFilter(e.target.value)}
                            className="bg-transparent text-slate-900 dark:text-white font-bold focus:outline-none cursor-pointer"
                        >
                            <option value="All" className="bg-white dark:bg-[#0A0C10]">All Categories</option>
                            <option value="Web Development" className="bg-white dark:bg-[#0A0C10]">Web Development</option>
                            <option value="Mobile App" className="bg-white dark:bg-[#0A0C10]">Mobile App</option>
                            <option value="Business Automation" className="bg-white dark:bg-[#0A0C10]">Business Automation</option>
                            <option value="Multimedia" className="bg-white dark:bg-[#0A0C10]">Multimedia</option>
                        </select>
                    </div>

                    {/* Status Filter */}
                    <div className="flex items-center gap-2 bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-2xl px-3 py-2 text-xs">
                        <span className="text-slate-400 font-medium">Status:</span>
                        <select
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                            className="bg-transparent text-slate-900 dark:text-white font-bold focus:outline-none cursor-pointer"
                        >
                            <option value="All" className="bg-white dark:bg-[#0A0C10]">All Statuses</option>
                            <option value="Live" className="bg-white dark:bg-[#0A0C10]">Live / Completed</option>
                            <option value="Development" className="bg-white dark:bg-[#0A0C10]">In Development</option>
                            <option value="Pending" className="bg-white dark:bg-[#0A0C10]">Pending</option>
                            <option value="Hold" className="bg-white dark:bg-[#0A0C10]">On Hold</option>
                        </select>
                    </div>

                    {/* Sort Filter */}
                    <div className="flex items-center gap-2 bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-2xl px-3 py-2 text-xs">
                        <span className="text-slate-400 font-medium">Sort:</span>
                        <select
                            value={sortBy}
                            onChange={(e) => setSortBy(e.target.value)}
                            className="bg-transparent text-slate-900 dark:text-white font-bold focus:outline-none cursor-pointer"
                        >
                            <option value="newest" className="bg-white dark:bg-[#0A0C10]">Newest First</option>
                            <option value="name" className="bg-white dark:bg-[#0A0C10]">Name (A-Z)</option>
                            <option value="progress" className="bg-white dark:bg-[#0A0C10]">Highest Progress</option>
                        </select>
                    </div>

                    {(search || categoryFilter !== 'All' || statusFilter !== 'All') && (
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

            {/* Projects Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProjects.map((p, i) => (
                    <motion.div 
                        key={p.id}
                        initial={{ opacity: 0, scale: 0.96 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: i * 0.04 }}
                        className="bg-white dark:bg-[#0A0C10] border border-black/10 dark:border-white/5 rounded-3xl p-6 hover:border-[#04C244]/30 hover:shadow-xl transition-all group relative overflow-hidden flex flex-col justify-between"
                    >
                        <div>
                            {/* Status Badge */}
                            <div className="flex items-center justify-between mb-4">
                                <div className="w-12 h-12 rounded-2xl bg-[#04C244]/10 border border-[#04C244]/20 flex items-center justify-center text-[#04C244] group-hover:scale-110 transition-transform shrink-0">
                                    <Briefcase size={22} />
                                </div>
                                <span className={`text-[10px] font-extrabold px-3 py-1 rounded-full ${
                                    p.status === 'Live' ? 'bg-[#04C244]/15 text-[#04C244] border border-[#04C244]/30' : 
                                    p.status === 'Development' ? 'bg-blue-500/15 text-blue-400 border border-blue-500/30' :
                                    'bg-amber-500/15 text-amber-400 border border-amber-500/30'
                                }`}>
                                    {p.status || 'Active'}
                                </span>
                            </div>

                            <h3 className="text-base sm:text-lg font-extrabold text-slate-900 dark:text-white group-hover:text-[#04C244] transition-colors mb-1 truncate">{p.name || p.title}</h3>
                            <p className="text-xs text-slate-500 font-medium mb-6">{p.category || 'Technology'}</p>

                            <div className="space-y-3 mb-6 bg-black/5 dark:bg-white/5 p-3.5 rounded-2xl border border-black/5 dark:border-white/5">
                                <div className="flex items-center justify-between text-xs text-slate-400 font-medium">
                                    <span className="flex items-center gap-2"><Building2 size={14} className="text-slate-500" /> Client:</span>
                                    <span className="font-bold text-slate-900 dark:text-white">{p.client || 'Internal Solution'}</span>
                                </div>
                                <div className="flex items-center justify-between text-xs text-slate-400 font-medium">
                                    <span className="flex items-center gap-2"><Calendar size={14} className="text-slate-500" /> Deadline:</span>
                                    <span className="font-bold text-slate-900 dark:text-white">{p.deadline || 'Ongoing'}</span>
                                </div>
                            </div>

                            {/* Progress */}
                            <div className="space-y-2 mb-6">
                                <div className="flex items-center justify-between text-[10px] font-extrabold uppercase tracking-widest text-slate-500">
                                    <span>Completion</span>
                                    <span>{p.progress ?? (p.status === 'Live' ? 100 : 40)}%</span>
                                </div>
                                <div className="h-2 w-full bg-black/5 dark:bg-white/5 rounded-full overflow-hidden">
                                    <motion.div 
                                        initial={{ width: 0 }}
                                        animate={{ width: `${p.progress ?? (p.status === 'Live' ? 100 : 40)}%` }}
                                        className={`h-full rounded-full ${p.status === 'Live' ? 'bg-[#04C244]' : 'bg-blue-500'}`}
                                    ></motion.div>
                                </div>
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center gap-2 pt-4 border-t border-black/10 dark:border-white/5">
                            <button 
                                onClick={() => handleOpenModal(p)}
                                className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-black/5 dark:bg-white/5 hover:bg-black/10 dark:hover:bg-white/10 rounded-2xl text-xs font-bold text-slate-300 transition-all"
                            >
                                <Edit2 size={14} />
                                <span>Edit</span>
                            </button>
                            <button 
                                onClick={() => { if(confirm('Delete project?')) deleteFromCollection('projects', p.id) }}
                                className="p-2.5 bg-rose-500/10 hover:bg-rose-500/20 rounded-2xl text-rose-500 transition-all"
                                title="Delete Project"
                            >
                                <Trash2 size={14} />
                            </button>
                            {p.url && (
                                <a 
                                    href={p.url} 
                                    target="_blank" 
                                    rel="noreferrer"
                                    className="p-2.5 bg-black/5 dark:bg-white/5 hover:bg-black/10 dark:hover:bg-white/10 rounded-2xl text-slate-400 hover:text-white transition-all"
                                    title="Open Project"
                                >
                                    <ExternalLink size={14} />
                                </a>
                            )}
                        </div>
                    </motion.div>
                ))}
            </div>

            {filteredProjects.length === 0 && (
                <div className="p-12 bg-white dark:bg-[#0A0C10] border border-black/10 dark:border-white/5 rounded-3xl text-center text-slate-500 text-xs sm:text-sm font-medium">
                    No projects found matching your active filters.
                </div>
            )}

            {/* Modal */}
            <AnimatePresence>
                {isModalOpen && (
                    <div className="fixed inset-0 z-60 flex items-center justify-center p-6 overflow-y-auto">
                        <motion.div 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsModalOpen(false)}
                            className="fixed inset-0 bg-black/80 backdrop-blur-sm"
                        ></motion.div>
                        <motion.div 
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            className="bg-white dark:bg-[#0A0C10] border border-black/10 dark:border-white/10 rounded-3xl w-full max-w-xl overflow-hidden relative z-10 shadow-2xl my-auto"
                        >
                            <div className="p-6 border-b border-black/10 dark:border-white/5 flex items-center justify-between">
                                <h2 className="text-xl font-bold text-slate-900 dark:text-white">{editingProject ? 'Edit Project' : 'New Project'}</h2>
                                <button onClick={() => setIsModalOpen(false)} className="text-slate-500 hover:text-white transition-colors">
                                    <X size={22} />
                                </button>
                            </div>
                            <form onSubmit={handleSubmit} className="p-6 space-y-6 max-h-[70vh] overflow-y-auto custom-scrollbar">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">Project Name</label>
                                        <input 
                                            type="text" 
                                            value={formData.name}
                                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                            className="w-full bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-2xl py-3.5 px-4 text-xs sm:text-sm text-slate-900 dark:text-white focus:outline-none focus:border-[#04C244]/50 transition-all font-semibold"
                                            placeholder="e.g. Dhiil Tech Web System"
                                            required
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">Client Name</label>
                                        <input 
                                            type="text" 
                                            value={formData.client}
                                            onChange={(e) => setFormData({ ...formData, client: e.target.value })}
                                            className="w-full bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-2xl py-3.5 px-4 text-xs sm:text-sm text-slate-900 dark:text-white focus:outline-none focus:border-[#04C244]/50 transition-all font-semibold"
                                            placeholder="e.g. Enterprise Client"
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">Category</label>
                                        <select 
                                            value={formData.category}
                                            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                            className="w-full bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-2xl py-3.5 px-4 text-xs sm:text-sm text-slate-900 dark:text-white focus:outline-none focus:border-[#04C244]/50 transition-all appearance-none font-semibold cursor-pointer"
                                        >
                                            <option value="Web Development" className="bg-white dark:bg-[#0A0C10]">Web Development</option>
                                            <option value="Mobile App" className="bg-white dark:bg-[#0A0C10]">Mobile App</option>
                                            <option value="Business Automation" className="bg-white dark:bg-[#0A0C10]">Business Automation</option>
                                            <option value="Multimedia" className="bg-white dark:bg-[#0A0C10]">Multimedia</option>
                                        </select>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">Status</label>
                                        <select 
                                            value={formData.status}
                                            onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                                            className="w-full bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-2xl py-3.5 px-4 text-xs sm:text-sm text-slate-900 dark:text-white focus:outline-none focus:border-[#04C244]/50 transition-all appearance-none font-semibold cursor-pointer"
                                        >
                                            <option value="Development" className="bg-white dark:bg-[#0A0C10]">In Development</option>
                                            <option value="Pending" className="bg-white dark:bg-[#0A0C10]">Pending Review</option>
                                            <option value="Live" className="bg-white dark:bg-[#0A0C10]">Live / Completed</option>
                                            <option value="Hold" className="bg-white dark:bg-[#0A0C10]">On Hold</option>
                                        </select>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">Deadline</label>
                                        <input 
                                            type="date" 
                                            value={formData.deadline}
                                            onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
                                            className="w-full bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-2xl py-3.5 px-4 text-xs sm:text-sm text-slate-900 dark:text-white focus:outline-none focus:border-[#04C244]/50 transition-all font-semibold"
                                            required
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">Project URL</label>
                                        <input 
                                            type="url" 
                                            value={formData.url}
                                            onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                                            className="w-full bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-2xl py-3.5 px-4 text-xs sm:text-sm text-slate-900 dark:text-white focus:outline-none focus:border-[#04C244]/50 transition-all font-semibold"
                                            placeholder="https://example.com"
                                        />
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
                                        {editingProject ? 'Save Changes' : 'Launch Project'}
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

export default AdminProjects;
