import { useState } from 'react';
import { useAdmin } from '../context/AdminContext';
import { 
    Plus, Search, Edit2, Trash2, Newspaper, 
    Calendar, CheckCircle, Clock, X, Save, Filter, RotateCcw
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const AdminNews = () => {
    const { data, deleteFromCollection, updateCollection } = useAdmin();
    const [search, setSearch] = useState('');
    const [statusFilter, setStatusFilter] = useState('All');
    const [sortBy, setSortBy] = useState('newest');

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingNews, setEditingNews] = useState(null);
    const [formData, setFormData] = useState({ 
        title: '', 
        content: '', 
        status: 'Draft' 
    });

    const filteredNews = (data.news || [])
        .filter(n => {
            const matchesSearch = (n.title || '').toLowerCase().includes(search.toLowerCase()) ||
                (n.content || '').toLowerCase().includes(search.toLowerCase());

            const matchesStatus = statusFilter === 'All' || n.status === statusFilter;

            return matchesSearch && matchesStatus;
        })
        .sort((a, b) => {
            if (sortBy === 'title') return (a.title || '').localeCompare(b.title || '');
            if (sortBy === 'oldest') return a.id - b.id;
            return b.id - a.id;
        });

    const resetFilters = () => {
        setSearch('');
        setStatusFilter('All');
        setSortBy('newest');
    };

    const handleOpenModal = (news = null) => {
        if (news) {
            setEditingNews(news);
            setFormData({ title: news.title, content: news.content, status: news.status });
        } else {
            setEditingNews(null);
            setFormData({ title: '', content: '', status: 'Draft' });
        }
        setIsModalOpen(true);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const newsData = {
            ...formData,
            date: new Date().toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' })
        };

        if (editingNews) {
            updateCollection('news', newsData, editingNews.id);
        } else {
            updateCollection('news', newsData);
        }
        setIsModalOpen(false);
    };

    return (
        <div className="space-y-6 pb-12">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">News & Blog Articles</h1>
                    <p className="text-slate-500 text-xs sm:text-sm font-medium mt-1">Manage company updates, tech announcements, and articles</p>
                </div>
                <button 
                    onClick={() => handleOpenModal()}
                    className="flex items-center justify-center gap-2 px-5 py-3 bg-[#04C244] text-black rounded-2xl text-xs sm:text-sm font-extrabold hover:bg-[#03a837] transition-all shadow-lg shadow-[#04C244]/20"
                >
                    <Plus size={18} />
                    <span>Create Article</span>
                </button>
            </div>

            {/* Filter Bar */}
            <div className="bg-white dark:bg-[#0A0C10] border border-black/10 dark:border-white/5 rounded-3xl p-4 sm:p-5 flex flex-col md:flex-row items-center justify-between gap-4 shadow-sm">
                <div className="relative flex-1 w-full">
                    <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input 
                        type="text" 
                        placeholder="Search articles by title or content..." 
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-2xl py-3 pl-12 pr-4 text-xs sm:text-sm text-slate-900 dark:text-white focus:outline-none focus:border-[#04C244]/50 transition-all font-semibold"
                    />
                </div>

                <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
                    {/* Status Filter */}
                    <div className="flex items-center gap-2 bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-2xl px-3 py-2 text-xs">
                        <Filter size={14} className="text-slate-400 shrink-0" />
                        <select
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                            className="bg-transparent text-slate-900 dark:text-white font-bold focus:outline-none cursor-pointer"
                        >
                            <option value="All" className="bg-white dark:bg-[#0A0C10]">All Statuses</option>
                            <option value="Published" className="bg-white dark:bg-[#0A0C10]">Published</option>
                            <option value="Draft" className="bg-white dark:bg-[#0A0C10]">Draft</option>
                            <option value="Scheduled" className="bg-white dark:bg-[#0A0C10]">Scheduled</option>
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
                            <option value="oldest" className="bg-white dark:bg-[#0A0C10]">Oldest First</option>
                            <option value="title" className="bg-white dark:bg-[#0A0C10]">Title (A-Z)</option>
                        </select>
                    </div>

                    {(search || statusFilter !== 'All') && (
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

            {/* List */}
            <div className="bg-white dark:bg-[#0A0C10] border border-black/10 dark:border-white/5 rounded-3xl overflow-hidden shadow-sm">
                <div className="divide-y divide-black/10 dark:divide-white/5">
                    {filteredNews.map((n, i) => (
                        <motion.div 
                            key={n.id}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: i * 0.04 }}
                            className="p-5 sm:p-6 hover:bg-black/5 dark:hover:bg-white/5 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-4 sm:gap-6 group"
                        >
                            <div className="flex items-center gap-4 sm:gap-6 w-full sm:w-auto">
                                <div className="w-12 h-12 rounded-2xl bg-[#04C244]/10 border border-[#04C244]/20 flex items-center justify-center text-[#04C244] group-hover:scale-110 transition-transform shrink-0">
                                    <Newspaper size={22} />
                                </div>
                                <div className="min-w-0 flex-1">
                                    <h3 className="text-sm sm:text-base font-extrabold text-slate-900 dark:text-white group-hover:text-[#04C244] transition-colors mb-1 truncate">{n.title}</h3>
                                    <div className="flex items-center gap-4">
                                        <div className="flex items-center gap-1.5 text-slate-500 text-[10px] font-bold uppercase tracking-widest">
                                            <Calendar size={12} />
                                            <span>{n.date || 'Recent'}</span>
                                        </div>
                                        <div className={`flex items-center gap-1.5 text-[10px] font-extrabold uppercase tracking-widest ${n.status === 'Published' ? 'text-[#04C244]' : 'text-amber-500'}`}>
                                            {n.status === 'Published' ? <CheckCircle size={12} /> : <Clock size={12} />}
                                            <span>{n.status || 'Draft'}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center gap-2 self-end sm:self-auto shrink-0">
                                <button 
                                    onClick={() => handleOpenModal(n)}
                                    className="p-2.5 bg-black/5 dark:bg-white/5 rounded-2xl text-slate-400 hover:text-[#04C244] hover:bg-[#04C244]/10 transition-all"
                                    title="Edit article"
                                >
                                    <Edit2 size={15} />
                                </button>
                                <button 
                                    onClick={() => { if(confirm('Delete article?')) deleteFromCollection('news', n.id) }}
                                    className="p-2.5 bg-black/5 dark:bg-white/5 rounded-2xl text-slate-400 hover:text-rose-500 hover:bg-rose-500/10 transition-all"
                                    title="Delete article"
                                >
                                    <Trash2 size={15} />
                                </button>
                            </div>
                        </motion.div>
                    ))}
                    {filteredNews.length === 0 && (
                        <div className="p-12 text-center text-slate-500 font-medium text-xs sm:text-sm">No articles found matching your active filters.</div>
                    )}
                </div>
            </div>

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
                            className="bg-white dark:bg-[#0A0C10] border border-black/10 dark:border-white/10 rounded-3xl w-full max-w-2xl overflow-hidden relative z-10 shadow-2xl my-auto"
                        >
                            <div className="p-6 border-b border-black/10 dark:border-white/5 flex items-center justify-between">
                                <h2 className="text-xl font-bold text-slate-900 dark:text-white">{editingNews ? 'Edit Article' : 'New Article'}</h2>
                                <button onClick={() => setIsModalOpen(false)} className="text-slate-500 hover:text-white transition-colors">
                                    <X size={22} />
                                </button>
                            </div>
                            <form onSubmit={handleSubmit} className="p-6 space-y-6">
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">Article Title</label>
                                    <input 
                                        type="text" 
                                        value={formData.title}
                                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                        className="w-full bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-2xl py-3.5 px-5 text-slate-900 dark:text-white focus:outline-none focus:border-[#04C244]/50 transition-all font-bold text-base"
                                        placeholder="Enter catchy article title..."
                                        required
                                    />
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">Publication Status</label>
                                    <select 
                                        value={formData.status}
                                        onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                                        className="w-full bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-2xl py-3 px-4 text-xs sm:text-sm text-slate-900 dark:text-white focus:outline-none focus:border-[#04C244]/50 transition-all appearance-none font-semibold cursor-pointer"
                                    >
                                        <option value="Draft" className="bg-white dark:bg-[#0A0C10]">Draft</option>
                                        <option value="Published" className="bg-white dark:bg-[#0A0C10]">Published</option>
                                        <option value="Scheduled" className="bg-white dark:bg-[#0A0C10]">Scheduled</option>
                                    </select>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">Article Content</label>
                                    <textarea 
                                        value={formData.content}
                                        onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                                        className="w-full bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-2xl py-4 px-5 text-slate-900 dark:text-white focus:outline-none focus:border-[#04C244]/50 transition-all min-h-[180px] resize-none text-xs sm:text-sm leading-relaxed font-semibold"
                                        placeholder="Write your article content here..."
                                        required
                                    ></textarea>
                                </div>
                                <div className="pt-4 flex gap-4">
                                    <button 
                                        type="button"
                                        onClick={() => setIsModalOpen(false)}
                                        className="flex-1 py-3.5 bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-2xl text-xs sm:text-sm font-bold text-slate-400 hover:text-white transition-all"
                                    >
                                        Discard
                                    </button>
                                    <button 
                                        type="submit"
                                        className="flex-1 py-3.5 bg-[#04C244] text-black rounded-2xl text-xs sm:text-sm font-extrabold hover:bg-[#03a837] transition-all flex items-center justify-center gap-2 shadow-xl shadow-[#04C244]/20"
                                    >
                                        <Save size={18} />
                                        <span>Save & Publish</span>
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

export default AdminNews;
