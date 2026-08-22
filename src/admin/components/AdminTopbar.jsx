import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu, Bell, Search, ChevronDown, User, LogOut, Settings, ExternalLink, Globe } from 'lucide-react';
import { useAdmin } from '../context/AdminContext';
import { motion, AnimatePresence } from 'framer-motion';

const AdminTopbar = ({ toggleSidebar }) => {
    const { user, logout } = useAdmin();
    const [showProfileMenu, setShowProfileMenu] = useState(false);

    return (
        <header className="sticky top-0 z-30 bg-white/90 dark:bg-[#0A0C10]/90 backdrop-blur-md border-b border-slate-200 dark:border-white/5 h-16 flex items-center justify-between px-6 transition-colors duration-300 shadow-xs">
            <div className="flex items-center gap-4">
                <button 
                    onClick={toggleSidebar}
                    className="p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-white/5 text-slate-600 dark:text-slate-400 md:hidden"
                >
                    <Menu size={20} />
                </button>
                <div className="relative hidden sm:block">
                    <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input 
                        type="text" 
                        placeholder="Search dashboard..." 
                        className="bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl py-2 pl-10 pr-4 text-xs font-semibold text-slate-900 dark:text-white focus:outline-none focus:border-[#04C244]/50 w-64 transition-all placeholder-slate-400"
                    />
                </div>
            </div>

            <div className="flex items-center gap-3">
                {/* View Public Website Quick Button */}
                <Link 
                    to="/" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="hidden md:flex items-center gap-2 px-3.5 py-2 bg-[#04C244]/15 border border-[#04C244]/30 hover:bg-[#04C244]/25 text-[#04C244] rounded-2xl text-xs font-extrabold transition-all shadow-xs"
                    title="Open public website in a new tab to check live updates"
                >
                    <Globe size={14} />
                    <span>View Live Site</span>
                    <ExternalLink size={12} className="opacity-70" />
                </Link>

                {/* Notifications */}
                <button className="relative p-2.5 rounded-2xl hover:bg-slate-100 dark:hover:bg-white/5 text-slate-500 dark:text-slate-400 transition-colors">
                    <Bell size={18} />
                    <span className="absolute top-2 right-2 w-2 h-2 bg-[#04C244] rounded-full border-2 border-white dark:border-black"></span>
                </button>

                {/* Profile Dropdown */}
                <div className="relative">
                    <button 
                        onClick={() => setShowProfileMenu(!showProfileMenu)}
                        className="flex items-center gap-3 p-1.5 rounded-2xl hover:bg-slate-100 dark:hover:bg-white/5 transition-all group"
                    >
                        <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#04C244] to-emerald-600 flex items-center justify-center text-black font-extrabold text-xs uppercase shadow-md shadow-[#04C244]/20 border border-white/20">
                            {user?.name?.charAt(0) || 'A'}
                        </div>
                        <div className="hidden lg:block text-left">
                            <p className="text-xs font-extrabold text-slate-900 dark:text-white leading-none mb-1">{user?.name}</p>
                            <p className="text-[10px] text-slate-500 font-bold">{user?.role}</p>
                        </div>
                        <ChevronDown size={14} className={`text-slate-400 transition-transform duration-300 ${showProfileMenu ? 'rotate-180' : ''}`} />
                    </button>

                    <AnimatePresence>
                        {showProfileMenu && (
                            <>
                                <div className="fixed inset-0 z-10" onClick={() => setShowProfileMenu(false)}></div>
                                <motion.div 
                                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                    animate={{ opacity: 1, y: 0, scale: 1 }}
                                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                    className="absolute right-0 mt-2 w-56 bg-white dark:bg-[#0A0C10] border border-slate-200 dark:border-white/10 rounded-2xl shadow-xl z-20 py-2 overflow-hidden"
                                >
                                    <Link 
                                        to="/"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        onClick={() => setShowProfileMenu(false)}
                                        className="flex items-center gap-3 w-full px-4 py-2.5 text-xs font-extrabold text-[#04C244] bg-[#04C244]/10 hover:bg-[#04C244]/20 transition-all border-b border-slate-100 dark:border-white/5 mb-1"
                                    >
                                        <Globe size={16} />
                                        <span className="flex-1">View Public Site</span>
                                        <ExternalLink size={13} />
                                    </Link>

                                    <Link 
                                        to="/admin/settings"
                                        onClick={() => setShowProfileMenu(false)}
                                        className="flex items-center gap-3 w-full px-4 py-2.5 text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/5 hover:text-slate-900 dark:hover:text-white transition-all"
                                    >
                                        <User size={16} className="text-slate-400" />
                                        <span>My Profile</span>
                                    </Link>
                                    <Link 
                                        to="/admin/settings"
                                        onClick={() => setShowProfileMenu(false)}
                                        className="flex items-center gap-3 w-full px-4 py-2.5 text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/5 hover:text-slate-900 dark:hover:text-white transition-all"
                                    >
                                        <Settings size={16} className="text-blue-500" />
                                        <span>Settings</span>
                                    </Link>
                                    <div className="border-t border-slate-200 dark:border-white/5 my-1"></div>
                                    <button 
                                        onClick={logout}
                                        className="flex items-center gap-3 w-full px-4 py-2.5 text-xs font-bold text-rose-500 hover:bg-rose-500/10 transition-all"
                                    >
                                        <LogOut size={16} />
                                        <span>Log Out</span>
                                    </button>
                                </motion.div>
                            </>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </header>
    );
};

export default AdminTopbar;
