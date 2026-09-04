import { useState } from 'react';
import { NavLink, Link } from 'react-router-dom';
import { 
    LayoutDashboard, Users, Briefcase, Star, 
    Mail, Settings, Newspaper, PieChart, LogOut, X, 
    Settings2, Moon, Sun, User
} from 'lucide-react';
import { useAdmin } from '../context/AdminContext';

const AdminSidebar = ({ isOpen, toggleSidebar }) => {
    const { logout, hasPermission } = useAdmin();
    const [isDark, setIsDark] = useState(() => localStorage.getItem('theme') !== 'light');

    const toggleTheme = () => {
        const next = !isDark;
        setIsDark(next);
        if (next) {
            document.documentElement.classList.add('dark');
            document.documentElement.classList.remove('light');
            localStorage.setItem('theme', 'dark');
        } else {
            document.documentElement.classList.remove('dark');
            document.documentElement.classList.add('light');
            localStorage.setItem('theme', 'light');
        }
    };

    const menuItems = [
        { title: 'Main Menu', type: 'header' },
        { title: 'Dashboard', path: '/admin/dashboard', icon: <LayoutDashboard size={18} />, permission: 'view_dashboard' },
        { title: 'Users', path: '/admin/users', icon: <Users size={18} />, permission: 'view_users' },
        { title: 'Projects', path: '/admin/projects', icon: <Briefcase size={18} />, permission: 'view_projects' },
        { title: 'Testimonials', path: '/admin/testimonials', icon: <Star size={18} />, permission: 'view_testimonials' },
        { title: 'Messages', path: '/admin/messages', icon: <Mail size={18} />, badge: true, permission: 'view_contacts' },
        
        { title: 'Management', type: 'header' },
        { title: 'Services', path: '/admin/services', icon: <Settings size={18} />, permission: 'view_services' },
        { title: 'News', path: '/admin/news', icon: <Newspaper size={18} />, permission: 'view_news' },
        { title: 'Analytics', path: '/admin/analytics', icon: <PieChart size={18} />, permission: 'view_analytics' },
        
        { title: 'Account', type: 'header' },
        { title: 'Profile', path: '/admin/settings', icon: <User size={18} /> },
        
        { title: 'System', type: 'header', permission: 'manage_settings' },
        { title: 'General', path: '/admin/settings', icon: <Settings2 size={18} />, permission: 'manage_settings' },
    ];

    const filteredMenu = menuItems.filter((item, idx) => {
        if (item.type === 'header') {
            const nextItems = menuItems.slice(idx + 1);
            const headerEnd = nextItems.findIndex(i => i.type === 'header');
            const group = headerEnd === -1 ? nextItems : nextItems.slice(0, headerEnd);
            return group.some(i => !i.permission || hasPermission(i.permission));
        }
        return !item.permission || hasPermission(item.permission);
    });

    return (
        <>
            {/* Mobile Overlay */}
            {isOpen && (
                <div 
                    className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 md:hidden"
                    onClick={toggleSidebar}
                ></div>
            )}

            <aside className={`fixed top-0 left-0 bottom-0 bg-white dark:bg-[#0A0C10] border-r border-slate-200 dark:border-white/5 z-50 transition-all duration-300 w-64 ${isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}`}>
                <div className="flex flex-col h-full">
                    {/* Header */}
                    <div className="p-6 flex items-center justify-between">
                        <Link to="/" className="flex items-center gap-2.5">
                            <img src="/assets/images/logo.png" alt="Logo" className="h-9 w-9 rounded-full object-cover border border-[#00E676]/40 shadow-sm" />
                            <span className="text-slate-900 dark:text-white font-black text-base tracking-tight font-poppins">Dhiil Tech <span className="text-[#00E676]">Admin</span></span>
                        </Link>
                        <button onClick={toggleSidebar} className="md:hidden text-slate-500 dark:text-slate-400">
                            <X size={20} />
                        </button>
                    </div>

                    {/* Menu */}
                    <nav className="flex-1 overflow-y-auto px-4 py-2 custom-scrollbar">
                        <ul className="space-y-1">
                            {filteredMenu.map((item, idx) => (
                                item.type === 'header' ? (
                                    <li key={idx} className="pt-4 pb-2 px-3">
                                        <span className="text-[10px] font-extrabold text-slate-400 dark:text-slate-500 uppercase tracking-widest">{item.title}</span>
                                    </li>
                                ) : (
                                    <li key={idx}>
                                        <NavLink
                                            to={item.path}
                                            onClick={() => window.innerWidth < 768 && toggleSidebar()}
                                            className={({ isActive }) => `
                                                flex items-center justify-between px-3.5 py-2.5 rounded-2xl transition-all group font-bold text-xs sm:text-sm
                                                ${isActive ? 'bg-gradient-to-r from-[#00FF66] to-[#04C244] text-black shadow-md shadow-[#00FF66]/20' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-white/5 hover:text-slate-900 dark:hover:text-white'}
                                            `}
                                        >
                                            {({ isActive }) => (
                                                <>
                                                    <div className="flex items-center gap-3">
                                                        <span className={`${isActive ? 'text-black' : 'text-[#04C244]'} group-hover:scale-110 transition-transform`}>
                                                            {item.icon}
                                                        </span>
                                                        <span>{item.title}</span>
                                                    </div>
                                                    {item.badge && (
                                                        <span className={`w-2 h-2 rounded-full ${isActive ? 'bg-black' : 'bg-[#04C244]'} animate-pulse`}></span>
                                                    )}
                                                </>
                                            )}
                                        </NavLink>
                                    </li>
                                )
                            ))}
                        </ul>
                    </nav>

                    {/* Footer Theme & Logout */}
                    <div className="p-4 border-t border-slate-200 dark:border-white/5 flex flex-col gap-2">
                        <button 
                            onClick={toggleTheme}
                            className="flex items-center gap-3 w-full px-3.5 py-2.5 rounded-2xl text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-white/5 hover:text-slate-900 dark:hover:text-white transition-all text-xs sm:text-sm font-bold"
                        >
                            {isDark ? <Sun size={18} className="text-amber-500" /> : <Moon size={18} className="text-indigo-500" />}
                            <span>{isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}</span>
                        </button>

                        <button 
                            onClick={logout}
                            className="flex items-center gap-3 w-full px-3.5 py-2.5 rounded-2xl text-rose-500 hover:bg-rose-500/10 transition-all text-xs sm:text-sm font-bold"
                        >
                            <LogOut size={18} />
                            <span>Sign Out</span>
                        </button>
                    </div>
                </div>
            </aside>
        </>
    );
};

export default AdminSidebar;
