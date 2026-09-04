import { useState } from 'react';
import { useAdmin } from '../context/AdminContext';
import { 
    Plus, Edit2, Trash2, Star, Quote, 
    X, Save, Search, Filter, RotateCcw
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const AdminTestimonials = () => {
    const { data, deleteFromCollection, updateCollection } = useAdmin();
    const [search, setSearch] = useState('');
    const [ratingFilter, setRatingFilter] = useState('All');
    const [sortBy, setSortBy] = useState('newest');

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingTestimonial, setEditingTestimonial] = useState(null);
    const [formData, setFormData] = useState({ 
        name: '', 
        role: '', 
        review: '', 
        img: '',
        rating: 5
    });

    const filteredTestimonials = (data.testimonials || [])
        .filter(t => {
            const matchesSearch = (t.name || '').toLowerCase().includes(search.toLowerCase()) ||
                (t.role || '').toLowerCase().includes(search.toLowerCase()) ||
                (t.review || '').toLowerCase().includes(search.toLowerCase());

            const rating = Number(t.rating || 5);
            const matchesRating = ratingFilter === 'All' ||
                (ratingFilter === '5' && rating === 5) ||
                (ratingFilter === '4' && rating === 4) ||
                (ratingFilter === '3' && rating <= 3);

            return matchesSearch && matchesRating;
        })
        .sort((a, b) => {
            if (sortBy === 'rating') return (b.rating || 5) - (a.rating || 5);
            if (sortBy === 'name') return (a.name || '').localeCompare(b.name || '');
            return b.id - a.id;
        });

    const resetFilters = () => {
        setSearch('');
        setRatingFilter('All');
        setSortBy('newest');
    };

    const handleOpenModal = (t = null) => {
        if (t) {
            setEditingTestimonial(t);
            setFormData({ ...t });
        } else {
            setEditingTestimonial(null);
            setFormData({ name: '', role: '', review: '', img: '', rating: 5 });
        }
        setIsModalOpen(true);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (editingTestimonial) {
            updateCollection('testimonials', formData, editingTestimonial.id);
        } else {
            updateCollection('testimonials', formData);
        }
        setIsModalOpen(false);
    };

    return (
        <div className="space-y-6 pb-12">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">Feedback & Reviews</h1>
                    <p className="text-slate-500 text-xs sm:text-sm font-medium mt-1">Manage client reviews and testimonials shown on the website</p>
                </div>
                <button 
                    onClick={() => handleOpenModal()}
                    className="flex items-center justify-center gap-2 px-5 py-3 bg-[#04C244] text-black rounded-2xl text-xs sm:text-sm font-extrabold hover:bg-[#03a837] transition-all shadow-lg shadow-[#04C244]/20"
                >
                    <Plus size={18} />
                    <span>Add Feedback</span>
                </button>
            </div>

            {/* Filter Bar */}
            <div className="bg-white dark:bg-[#0A0C10] border border-black/10 dark:border-white/5 rounded-3xl p-4 sm:p-5 flex flex-col md:flex-row items-center justify-between gap-4 shadow-sm">
                <div className="relative flex-1 w-full">
                    <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input 
                        type="text" 
                        placeholder="Search feedback by client name, company, or review text..." 
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-2xl py-3 pl-12 pr-4 text-xs sm:text-sm text-slate-900 dark:text-white focus:outline-none focus:border-[#04C244]/50 transition-all font-semibold"
                    />
                </div>

                <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
                    {/* Rating Filter */}
                    <div className="flex items-center gap-2 bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-2xl px-3 py-2 text-xs">
                        <Filter size={14} className="text-slate-400 shrink-0" />
                        <select
                            value={ratingFilter}
                            onChange={(e) => setRatingFilter(e.target.value)}
                            className="bg-transparent text-slate-900 dark:text-white font-bold focus:outline-none cursor-pointer"
                        >
                            <option value="All" className="bg-white dark:bg-[#0A0C10]">All Ratings</option>
                            <option value="5" className="bg-white dark:bg-[#0A0C10]">5 Stars ⭐</option>
                            <option value="4" className="bg-white dark:bg-[#0A0C10]">4 Stars ⭐</option>
                            <option value="3" className="bg-white dark:bg-[#0A0C10]">3 Stars & Below</option>
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
                            <option value="rating" className="bg-white dark:bg-[#0A0C10]">Highest Rating</option>
                            <option value="name" className="bg-white dark:bg-[#0A0C10]">Client Name (A-Z)</option>
                        </select>
                    </div>

                    {(search || ratingFilter !== 'All') && (
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

            {/* Testimonials Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {filteredTestimonials.map((t, i) => (
                    <motion.div 
                        key={t.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.05 }}
                        className="bg-white dark:bg-[#0A0C10] border border-black/10 dark:border-white/5 rounded-3xl p-6 sm:p-8 group relative overflow-hidden flex flex-col justify-between shadow-sm"
                    >
                        <Quote className="absolute top-8 right-8 text-black/5 dark:text-white/5 w-20 h-20 -rotate-12 group-hover:text-[#04C244]/5 transition-colors" />

                        <div>
                            <div className="flex items-center gap-1.5 mb-4">
                                {[1,2,3,4,5].map(star => (
                                    <Star 
                                        key={star} 
                                        size={14} 
                                        className={star <= (t.rating || 5) ? 'text-[#04C244]' : 'text-slate-600'} 
                                        fill={star <= (t.rating || 5) ? 'currentColor' : 'none'} 
                                    />
                                ))}
                                <span className="text-xs font-extrabold text-[#04C244] ml-2">{(t.rating || 5)}.0</span>
                            </div>

                            <p className="text-slate-600 dark:text-slate-300 text-xs sm:text-sm leading-relaxed mb-8 relative z-10 italic">
                                "{t.review}"
                            </p>
                        </div>

                        <div className="flex items-center justify-between border-t border-black/10 dark:border-white/5 pt-6">
                            <div className="flex items-center gap-3">
                                <div className="w-11 h-11 rounded-full border border-[#04C244]/20 overflow-hidden bg-[#04C244]/10 flex items-center justify-center shrink-0 text-[#04C244] font-extrabold text-sm">
                                    {t.img ? (
                                        <img src={t.img} alt={t.name} className="w-full h-full object-cover" />
                                    ) : (
                                        <span>{t.name ? t.name.charAt(0).toUpperCase() : '?'}</span>
                                    )}
                                </div>
                                <div>
                                    <h4 className="text-xs sm:text-sm font-extrabold text-slate-900 dark:text-white">{t.name}</h4>
                                    <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">{t.role}</p>
                                </div>
                            </div>

                            <div className="flex items-center gap-2">
                                <button 
                                    onClick={() => handleOpenModal(t)}
                                    className="p-2.5 bg-black/5 dark:bg-white/5 rounded-2xl text-slate-400 hover:text-[#04C244] hover:bg-[#04C244]/10 transition-all"
                                    title="Edit feedback"
                                >
                                    <Edit2 size={15} />
                                </button>
                                <button 
                                    onClick={() => { if(confirm('Delete testimonial?')) deleteFromCollection('testimonials', t.id) }}
                                    className="p-2.5 bg-black/5 dark:bg-white/5 rounded-2xl text-slate-400 hover:text-rose-500 hover:bg-rose-500/10 transition-all"
                                    title="Delete feedback"
                                >
                                    <Trash2 size={15} />
                                </button>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>

            {filteredTestimonials.length === 0 && (
                <div className="p-12 bg-white dark:bg-[#0A0C10] border border-black/10 dark:border-white/5 rounded-3xl text-center text-slate-500 text-xs sm:text-sm font-medium">
                    No testimonials found matching your active filters.
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
                            className="bg-white dark:bg-[#0A0C10] border border-black/10 dark:border-white/10 rounded-3xl w-full max-w-lg overflow-hidden relative z-10 shadow-2xl my-auto"
                        >
                            <div className="p-6 border-b border-black/10 dark:border-white/5 flex items-center justify-between">
                                <h2 className="text-xl font-bold text-slate-900 dark:text-white">{editingTestimonial ? 'Edit Review & Feedback' : 'New Review & Feedback'}</h2>
                                <button onClick={() => setIsModalOpen(false)} className="text-slate-500 hover:text-white transition-colors">
                                    <X size={22} />
                                </button>
                            </div>
                            <form onSubmit={handleSubmit} className="p-6 space-y-6">
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div className="space-y-1.5">
                                        <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">Full Name</label>
                                        <input 
                                            type="text" 
                                            value={formData.name}
                                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                            className="w-full bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-2xl py-3.5 px-4 text-xs sm:text-sm text-slate-900 dark:text-white focus:outline-none focus:border-[#04C244]/50 transition-all font-semibold"
                                            placeholder="e.g. John Doe"
                                            required
                                        />
                                    </div>
                                    <div className="space-y-1.5">
                                        <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">Role / Title / Company</label>
                                        <input 
                                            type="text" 
                                            value={formData.role}
                                            onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                                            className="w-full bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-2xl py-3.5 px-4 text-xs sm:text-sm text-slate-900 dark:text-white focus:outline-none focus:border-[#04C244]/50 transition-all font-semibold"
                                            placeholder="e.g. CEO at GreenTech"
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">Feedback / Review Content</label>
                                    <textarea 
                                        value={formData.review}
                                        onChange={(e) => setFormData({ ...formData, review: e.target.value })}
                                        className="w-full bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-2xl py-3.5 px-4 text-xs sm:text-sm text-slate-900 dark:text-white focus:outline-none focus:border-[#04C244]/50 transition-all min-h-[120px] resize-none font-semibold"
                                        placeholder="Enter feedback or review content here..."
                                        required
                                    ></textarea>
                                </div>

                                <div className="space-y-3">
                                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">Rating</label>
                                    <div className="flex items-center gap-3 bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/5 p-4 rounded-2xl">
                                        {[1, 2, 3, 4, 5].map((star) => (
                                            <button
                                                key={star}
                                                type="button"
                                                onClick={() => setFormData({ ...formData, rating: star })}
                                                className="transition-all hover:scale-125"
                                            >
                                                <Star 
                                                    size={22} 
                                                    className={star <= (formData.rating || 5) ? 'text-[#04C244]' : 'text-slate-600'} 
                                                    fill={star <= (formData.rating || 5) ? 'currentColor' : 'none'} 
                                                />
                                            </button>
                                        ))}
                                        <span className="ml-auto text-xs font-extrabold text-[#04C244]">{(formData.rating || 5)}.0 Rating</span>
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
                                        className="flex-1 py-3.5 bg-[#04C244] text-black rounded-2xl text-xs sm:text-sm font-extrabold hover:bg-[#03a837] transition-all flex items-center justify-center gap-2 shadow-xl shadow-[#04C244]/20"
                                    >
                                        <Save size={16} />
                                        <span>Save Feedback</span>
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

export default AdminTestimonials;
