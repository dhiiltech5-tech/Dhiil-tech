import { useState, useEffect } from 'react';
import { useAdmin } from '../context/AdminContext';
import { 
    MailOpen, Trash2, Search, 
    User, Reply, X, Mail, Copy, Check, Filter, RotateCcw
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { API_BASE } from '../../services/api';

const AdminMessages = () => {
    const { data, deleteFromCollection, setData, user } = useAdmin();
    const [search, setSearch] = useState('');
    const [statusFilter, setStatusFilter] = useState('All'); // 'All', 'Unread', 'Read'
    const [sortBy, setSortBy] = useState('newest');
    const [selectedMessage, setSelectedMessage] = useState(null);
    
    // Newsletter states
    const [activeTab, setActiveTab] = useState('messages');
    const [subscribers, setSubscribers] = useState([]);
    const [copiedAll, setCopiedAll] = useState(false);
    const [copiedId, setCopiedId] = useState(null);

    const filteredMessages = (data.messages || [])
        .filter(m => {
            const matchesSearch = (m.name || '').toLowerCase().includes(search.toLowerCase()) ||
                (m.subject || '').toLowerCase().includes(search.toLowerCase()) ||
                (m.email || '').toLowerCase().includes(search.toLowerCase());
            
            const isUnread = m.unread || !m.is_read;
            const matchesStatus = statusFilter === 'All' || 
                (statusFilter === 'Unread' && isUnread) || 
                (statusFilter === 'Read' && !isUnread);

            return matchesSearch && matchesStatus;
        })
        .sort((a, b) => {
            if (sortBy === 'oldest') return a.id - b.id;
            return b.id - a.id;
        });

    useEffect(() => {
        const fetchSubscribers = async () => {
            if (!user?.token) return;
            try {
                const res = await fetch(`${API_BASE}/newsletter/`, {
                    headers: { 'Authorization': `Bearer ${user.token}` }
                });
                const result = await res.json();
                if (result.success && result.data) {
                    setSubscribers(result.data);
                }
            } catch (err) {
                console.error("Failed to fetch subscribers:", err);
            }
        };

        if (activeTab === 'subscribers') {
            fetchSubscribers();
        }
    }, [activeTab, user?.token]);

    const handleDeleteSubscriber = async (id) => {
        if (!confirm('Are you sure you want to delete this subscriber?')) return;
        try {
            const res = await fetch(`${API_BASE}/newsletter/${id}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${user.token}` }
            });
            const result = await res.json();
            if (result.success) {
                setSubscribers(prev => prev.filter(s => s.id !== id));
            } else {
                alert(result.message || "Failed to delete subscriber");
            }
        } catch (err) {
            console.error("Failed to delete subscriber:", err);
        }
    };

    const handleCopyAll = () => {
        if (subscribers.length === 0) return;
        const emailsStr = subscribers.map(s => s.email).join(', ');
        navigator.clipboard.writeText(emailsStr);
        setCopiedAll(true);
        setTimeout(() => setCopiedAll(false), 2000);
    };

    const handleCopySingle = (email, id) => {
        navigator.clipboard.writeText(email);
        setCopiedId(id);
        setTimeout(() => setCopiedId(null), 2000);
    };

    const markAsRead = async (id) => {
        setData(prev => ({
            ...prev,
            messages: prev.messages.map(m => m.id === id ? { ...m, unread: false, is_read: true } : m)
        }));

        if (!user?.token) return;
        try {
            await fetch(`${API_BASE}/contact/${id}/read`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${user.token}`
                }
            });
        } catch (err) {
            console.error("Failed to sync message read status to server:", err);
        }
    };

    const handleOpenMessage = (msg) => {
        setSelectedMessage(msg);
        if (msg.unread || !msg.is_read) markAsRead(msg.id);
    };

    const resetFilters = () => {
        setSearch('');
        setStatusFilter('All');
        setSortBy('newest');
    };

    return (
        <div className="space-y-6 pb-12">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">Messages</h1>
                    <p className="text-slate-500 text-xs sm:text-sm font-medium mt-1">Manage inquiries, newsletters, and client communications</p>
                </div>
                {activeTab === 'messages' && (
                    <div className="flex items-center gap-3 text-xs font-bold uppercase tracking-widest text-slate-500">
                        <div className="flex items-center gap-2 px-3 py-1.5 bg-[#04C244]/10 border border-[#04C244]/20 rounded-full text-[#04C244]">
                            <span className="w-2 h-2 rounded-full bg-[#04C244]"></span>
                            <span>{(data.messages || []).filter(m => m.unread || !m.is_read).length} Unread</span>
                        </div>
                    </div>
                )}
            </div>

            {/* Tabs */}
            <div className="flex border-b border-black/10 dark:border-white/5">
                <button
                    onClick={() => { setActiveTab('messages'); setSearch(''); }}
                    className={`pb-4 px-6 font-bold text-sm transition-all border-b-2 ${activeTab === 'messages' ? 'border-[#04C244] text-[#04C244]' : 'border-transparent text-slate-500 hover:text-slate-900 dark:hover:text-white'}`}
                >
                    Contact Messages ({(data.messages || []).length})
                </button>
                <button
                    onClick={() => { setActiveTab('subscribers'); setSearch(''); }}
                    className={`pb-4 px-6 font-bold text-sm transition-all border-b-2 ${activeTab === 'subscribers' ? 'border-[#04C244] text-[#04C244]' : 'border-transparent text-slate-500 hover:text-slate-900 dark:hover:text-white'}`}
                >
                    Newsletter Subscribers ({subscribers.length})
                </button>
            </div>

            {activeTab === 'messages' ? (
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    
                    {/* Message List Side */}
                    <div className={`lg:col-span-5 space-y-4 ${selectedMessage ? 'hidden lg:block' : ''}`}>
                        
                        {/* Search & Filter Bar */}
                        <div className="space-y-3 bg-white dark:bg-[#0A0C10] border border-black/10 dark:border-white/5 rounded-3xl p-4 shadow-sm">
                            <div className="relative">
                                <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                                <input 
                                    type="text" 
                                    placeholder="Search by name, subject, or email..." 
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    className="w-full bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-2xl py-2.5 pl-11 pr-4 text-xs font-semibold text-slate-900 dark:text-white focus:outline-none focus:border-[#04C244]/50"
                                />
                            </div>

                            <div className="flex items-center justify-between gap-2">
                                <div className="flex items-center gap-1.5 bg-black/5 dark:bg-white/5 px-2.5 py-1.5 rounded-xl text-xs border border-black/5 dark:border-white/5">
                                    <Filter size={13} className="text-slate-400" />
                                    <select 
                                        value={statusFilter}
                                        onChange={(e) => setStatusFilter(e.target.value)}
                                        className="bg-transparent text-slate-900 dark:text-white font-bold focus:outline-none text-[11px] cursor-pointer"
                                    >
                                        <option value="All" className="bg-white dark:bg-[#0A0C10]">All Statuses</option>
                                        <option value="Unread" className="bg-white dark:bg-[#0A0C10]">Unread Only</option>
                                        <option value="Read" className="bg-white dark:bg-[#0A0C10]">Read Only</option>
                                    </select>
                                </div>

                                <div className="flex items-center gap-1.5 bg-black/5 dark:bg-white/5 px-2.5 py-1.5 rounded-xl text-xs border border-black/5 dark:border-white/5">
                                    <select 
                                        value={sortBy}
                                        onChange={(e) => setSortBy(e.target.value)}
                                        className="bg-transparent text-slate-900 dark:text-white font-bold focus:outline-none text-[11px] cursor-pointer"
                                    >
                                        <option value="newest" className="bg-white dark:bg-[#0A0C10]">Newest First</option>
                                        <option value="oldest" className="bg-white dark:bg-[#0A0C10]">Oldest First</option>
                                    </select>
                                </div>

                                {(search || statusFilter !== 'All') && (
                                    <button onClick={resetFilters} className="p-1.5 text-rose-500 hover:bg-rose-500/10 rounded-xl" title="Reset">
                                        <RotateCcw size={14} />
                                    </button>
                                )}
                            </div>
                        </div>

                        {/* List Items */}
                        <div className="space-y-3 custom-scrollbar max-h-[65vh] overflow-y-auto pr-1">
                            {filteredMessages.map((msg, i) => {
                                const isUnread = msg.unread || !msg.is_read;
                                return (
                                    <motion.div 
                                        key={msg.id}
                                        initial={{ opacity: 0, x: -16 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: i * 0.03 }}
                                        onClick={() => handleOpenMessage(msg)}
                                        className={`
                                            p-4 rounded-3xl border transition-all cursor-pointer group
                                            ${selectedMessage?.id === msg.id 
                                                ? 'bg-[#04C244]/15 border-[#04C244]/40 shadow-md shadow-[#04C244]/5' 
                                                : isUnread 
                                                    ? 'bg-white dark:bg-[#0A0C10] border-[#04C244]/30 hover:border-[#04C244]/50' 
                                                    : 'bg-white dark:bg-[#0A0C10] border-black/10 dark:border-white/5 hover:border-black/20 dark:hover:border-white/15'
                                            }
                                        `}
                                    >
                                        <div className="flex items-start justify-between mb-1.5">
                                            <h4 className={`text-xs sm:text-sm font-extrabold ${isUnread ? 'text-slate-900 dark:text-white' : 'text-slate-400 dark:text-slate-500'}`}>
                                                {msg.name}
                                            </h4>
                                            <span className="text-[10px] text-slate-400 font-bold">{msg.date || 'Recent'}</span>
                                        </div>
                                        <p className={`text-xs font-semibold truncate mb-2 ${isUnread ? 'text-slate-800 dark:text-slate-200' : 'text-slate-500'}`}>
                                            {msg.subject}
                                        </p>
                                        <div className="flex items-center justify-between">
                                            <span className="text-[10px] text-slate-500 font-medium truncate max-w-[200px]">{msg.email}</span>
                                            {isUnread && (
                                                <div className="w-2.5 h-2.5 rounded-full bg-[#04C244] shadow-[0_0_10px_#04C244]"></div>
                                            )}
                                        </div>
                                    </motion.div>
                                );
                            })}

                            {filteredMessages.length === 0 && (
                                <div className="p-8 bg-white dark:bg-[#0A0C10] border border-black/10 dark:border-white/5 rounded-3xl text-center text-slate-500 text-xs font-medium">
                                    No messages found matching your filters.
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Message Detailed View */}
                    <div className={`lg:col-span-7 bg-white dark:bg-[#0A0C10] border border-black/10 dark:border-white/5 rounded-3xl p-6 sm:p-8 min-h-[500px] flex flex-col ${!selectedMessage ? 'hidden lg:flex items-center justify-center' : ''}`}>
                        <AnimatePresence mode="wait">
                            {selectedMessage ? (
                                <motion.div 
                                    key={selectedMessage.id}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                    className="flex-1 flex flex-col h-full"
                                >
                                    <div className="flex items-center justify-between mb-8 pb-6 border-b border-black/10 dark:border-white/5">
                                        <div className="flex items-center gap-4">
                                            <button 
                                                onClick={() => setSelectedMessage(null)}
                                                className="p-2 bg-black/5 dark:bg-white/5 rounded-xl text-slate-500 hover:text-white lg:hidden"
                                            >
                                                <X size={20} />
                                            </button>
                                            <div className="w-12 h-12 rounded-2xl bg-[#04C244]/10 border border-[#04C244]/20 flex items-center justify-center text-[#04C244] font-bold">
                                                <User size={22} />
                                            </div>
                                            <div>
                                                <h3 className="text-base font-extrabold text-slate-900 dark:text-white">{selectedMessage.name}</h3>
                                                <p className="text-xs text-slate-500 font-medium">{selectedMessage.email}</p>
                                            </div>
                                        </div>
                                        <button 
                                            onClick={() => { if(confirm('Delete message?')) { deleteFromCollection('messages', selectedMessage.id); setSelectedMessage(null); } }}
                                            className="p-3 bg-rose-500/10 text-rose-500 rounded-2xl hover:bg-rose-500/20 transition-all"
                                            title="Delete message"
                                        >
                                            <Trash2 size={18} />
                                        </button>
                                    </div>

                                    <div className="mb-6">
                                        <span className="text-[10px] font-extrabold text-slate-500 uppercase tracking-widest mb-1 block">Subject</span>
                                        <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white leading-tight">
                                            {selectedMessage.subject}
                                        </h2>
                                    </div>

                                    <div className="flex-1 bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/5 rounded-2xl p-5 sm:p-6 mb-6 text-slate-700 dark:text-slate-300 text-xs sm:text-sm leading-relaxed whitespace-pre-wrap">
                                        {selectedMessage.message}
                                    </div>

                                    <div className="flex items-center gap-4">
                                        <a 
                                            href={`mailto:${selectedMessage.email}`}
                                            className="flex-1 py-3.5 bg-[#04C244] text-black rounded-2xl text-xs sm:text-sm font-extrabold hover:bg-[#03a837] transition-all flex items-center justify-center gap-2 shadow-lg shadow-[#04C244]/20"
                                        >
                                            <Reply size={18} />
                                            <span>Reply to Client</span>
                                        </a>
                                    </div>
                                </motion.div>
                            ) : (
                                <div className="text-center space-y-4 max-w-xs mx-auto my-auto">
                                    <div className="w-16 h-16 bg-black/5 dark:bg-white/5 rounded-full flex items-center justify-center mx-auto text-slate-500">
                                        <MailOpen size={32} />
                                    </div>
                                    <h3 className="text-base font-bold text-slate-900 dark:text-white">Select a Message</h3>
                                    <p className="text-xs text-slate-500 font-medium">Click on a message from the left list to view details and reply.</p>
                                </div>
                            )}
                        </AnimatePresence>
                    </div>

                </div>
            ) : (
                /* Newsletter Subscribers Tab */
                <div className="bg-white dark:bg-[#0A0C10] border border-black/10 dark:border-white/5 rounded-3xl p-6 sm:p-8 shadow-sm">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
                        <div className="relative flex-1 max-w-md">
                            <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                            <input 
                                type="text" 
                                placeholder="Search subscribers..." 
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="w-full bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-2xl py-3 pl-12 pr-4 text-xs sm:text-sm text-slate-900 dark:text-white focus:outline-none focus:border-[#04C244]/50 transition-all font-semibold"
                            />
                        </div>
                        <button
                            onClick={handleCopyAll}
                            disabled={subscribers.length === 0}
                            className="px-5 py-3 bg-[#04C244]/10 border border-[#04C244]/20 hover:border-[#04C244]/40 text-[#04C244] rounded-2xl text-xs sm:text-sm font-extrabold transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                        >
                            {copiedAll ? <Check size={16} /> : <Copy size={16} />}
                            <span>{copiedAll ? 'Copied List!' : 'Copy All Emails'}</span>
                        </button>
                    </div>

                    <div className="overflow-x-auto rounded-2xl border border-black/5 dark:border-white/5">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-black/5 dark:bg-white/5 text-[10px] font-extrabold text-slate-500 uppercase tracking-widest border-b border-black/5 dark:border-white/5">
                                    <th className="py-4 px-6">Email Address</th>
                                    <th className="py-4 px-6">Subscribed Date</th>
                                    <th className="py-4 px-6 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-black/5 dark:divide-white/5 text-xs sm:text-sm text-slate-700 dark:text-slate-300">
                                {subscribers.filter(s => s.email.toLowerCase().includes(search.toLowerCase())).map((sub, i) => (
                                    <motion.tr 
                                        key={sub.id}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: i * 0.03 }}
                                        className="hover:bg-black/5 dark:hover:bg-white/5 transition-all"
                                    >
                                        <td className="py-4 px-6 font-bold text-slate-900 dark:text-white flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-xl bg-[#04C244]/10 text-[#04C244] flex items-center justify-center shrink-0">
                                                <Mail size={14} />
                                            </div>
                                            <span>{sub.email}</span>
                                        </td>
                                        <td className="py-4 px-6 font-medium text-slate-500">
                                            {sub.subscribed_at ? new Date(sub.subscribed_at).toLocaleDateString('en-US', {
                                                year: 'numeric',
                                                month: 'short',
                                                day: 'numeric'
                                            }) : 'Recent'}
                                        </td>
                                        <td className="py-4 px-6 text-right space-x-2">
                                            <button
                                                onClick={() => handleCopySingle(sub.email, sub.id)}
                                                className="p-2 bg-black/5 dark:bg-white/5 text-slate-400 hover:text-[#04C244] rounded-xl transition-all"
                                                title="Copy email"
                                            >
                                                {copiedId === sub.id ? <Check size={16} /> : <Copy size={16} />}
                                            </button>
                                            <button
                                                onClick={() => handleDeleteSubscriber(sub.id)}
                                                className="p-2 bg-rose-500/10 text-rose-500 hover:bg-rose-500/20 rounded-xl transition-all"
                                                title="Delete subscriber"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </td>
                                    </motion.tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminMessages;
