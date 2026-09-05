import { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import {
  Menu,
  X,
  Moon,
  Sun,
  Compass,
  Briefcase,
  Layers,
  ArrowRight,
  Home,
  Newspaper,
  Phone
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [isDark, setIsDark] = useState(() => localStorage.getItem('theme') !== 'light');

  // Sync the HTML class whenever isDark changes
  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
      document.documentElement.classList.remove('light');
    } else {
      document.documentElement.classList.remove('dark');
      document.documentElement.classList.add('light');
    }
  }, [isDark]);

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

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Lock background scroll when drawer is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const toggleMenu = () => setIsOpen(!isOpen);

  const navLinks = [
    { name: 'Home', path: '/', icon: Home },
    { name: 'About', path: '/about', icon: Compass },
    { name: 'Services', path: '/services', icon: Briefcase },
    { name: 'News', path: '/news', icon: Newspaper },
    { name: 'Projects', path: '/portfolio', icon: Layers },
    { name: 'Contact', path: '/contact', icon: Phone },
  ];

  return (
    <>
      <nav
        className={`fixed left-0 right-0 top-0 z-50 transition-all duration-300 ${
          isScrolled ? 'bg-[#02140B]/95 text-white backdrop-blur-2xl border-b border-[#00E676]/25 py-3.5 shadow-xl shadow-black/30' : 'bg-[#02140B]/85 text-white backdrop-blur-lg border-b border-white/10 py-5'
        }`}
      >
        <div className="container mx-auto px-6 flex justify-between items-center">
          {/* Logo */}
          <NavLink to="/" className="flex items-center gap-3 group">
            <img src="/assets/images/logo.png" alt="Dhiil Tech" className="h-12 w-12 sm:h-14 sm:w-14 rounded-full object-cover border-2 border-[#00E676]/40 shadow-lg shadow-[#00E676]/20 group-hover:scale-105 transition-transform" />
            <span className="text-xl sm:text-2xl font-black text-white tracking-wider uppercase font-poppins">
              Dhiil <span className="text-[#00E676] drop-shadow-[0_0_12px_rgba(0,230,118,0.4)]">Tech</span>
            </span>
          </NavLink>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-8">
            <ul className="flex gap-6">
              {navLinks.map((link) => (
                <li key={link.name}>
                  <NavLink
                    to={link.path}
                    className={({ isActive }) =>
                      `text-sm font-medium transition-all hover:text-[#00FF66] ${
                        isActive ? 'text-[#00FF66] font-bold border-b-2 border-[#00FF66] pb-1 drop-shadow-[0_0_10px_rgba(0,255,102,0.3)]' : 'text-slate-300'
                      }`
                    }
                  >
                    {link.name}
                  </NavLink>
                </li>
              ))}
            </ul>

            {/* Theme Toggle */}
            <motion.button
              onClick={toggleTheme}
              whileTap={{ scale: 0.85 }}
              className="w-9 h-9 rounded-full border border-black/15 dark:border-white/15 hover:border-[#04C244] flex items-center justify-center transition-colors text-slate-600 dark:text-slate-300 hover:text-[#04C244]"
              aria-label="Toggle theme"
              title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            >
              <AnimatePresence mode="wait">
                {isDark ? (
                  <motion.span key="moon" initial={{ opacity: 0, rotate: -90 }} animate={{ opacity: 1, rotate: 0 }} exit={{ opacity: 0, rotate: 90 }} transition={{ duration: 0.2 }}>
                    <Moon size={17} />
                  </motion.span>
                ) : (
                  <motion.span key="sun" initial={{ opacity: 0, rotate: -90 }} animate={{ opacity: 1, rotate: 0 }} exit={{ opacity: 0, rotate: 90 }} transition={{ duration: 0.2 }}>
                    <Sun size={17} />
                  </motion.span>
                )}
              </AnimatePresence>
            </motion.button>
          </div>

          {/* Mobile Menu Toggle Button */}
          <div className="md:hidden flex items-center gap-3">
            <motion.button
              onClick={toggleTheme}
              whileTap={{ scale: 0.85 }}
              className="w-9 h-9 rounded-full border border-black/15 dark:border-white/15 hover:border-[#04C244] flex items-center justify-center transition-colors text-slate-600 dark:text-slate-300 hover:text-[#04C244]"
            >
              {isDark ? <Moon size={17} /> : <Sun size={17} />}
            </motion.button>
            <button onClick={toggleMenu} className="text-slate-800 dark:text-slate-200 focus:outline-none" aria-label="Toggle menu">
              {isOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>
        </div>
      </nav>

      {/* Slide-out Mobile Drawer */}
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-55 md:hidden"
            />

            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 220 }}
              className="fixed top-0 right-0 bottom-0 w-[85%] max-w-[380px] bg-white dark:bg-zinc-950 z-60 p-6 flex flex-col shadow-2xl border-l border-slate-200 dark:border-zinc-800 md:hidden"
            >
              <div className="flex items-center justify-between pb-5 border-b border-slate-100 dark:border-zinc-900">
                <div className="flex items-center gap-2.5">
                  <img src="/assets/images/logo.png" alt="Dhiil Tech" className="h-10 w-10 rounded-full object-cover border border-[#00E676]/40 shadow-sm" />
                  <span className="text-lg font-bold text-black dark:text-white">
                    Dhiil <span className="text-[#04C244]">Tech</span>
                  </span>
                </div>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-1.5 rounded-full hover:bg-slate-100 dark:hover:bg-zinc-900 text-slate-500 dark:text-slate-400 hover:text-black dark:hover:text-white transition-colors"
                >
                  <X size={22} />
                </button>
              </div>

              <div className="flex-1 mt-6 flex flex-col justify-between overflow-y-auto pr-1">
                <div className="flex flex-col h-full justify-between">
                  <div className="grid grid-cols-2 gap-2">
                    {navLinks.map((link) => {
                      const Icon = link.icon;
                      return (
                        <NavLink
                          key={link.name}
                          to={link.path}
                          onClick={() => setIsOpen(false)}
                          className={({ isActive }) =>
                            `flex flex-col items-center justify-center p-4 rounded-2xl text-center transition-all border ${
                              isActive
                                ? 'bg-green-500/10 dark:bg-green-950/30 border-green-500/20 text-[#04C244]'
                                : 'bg-slate-50 dark:bg-zinc-900 border-slate-100 dark:border-zinc-800/60 text-slate-600 dark:text-zinc-400 hover:bg-slate-100/50 dark:hover:bg-zinc-800/50 hover:text-black dark:hover:text-white'
                            }`
                          }
                        >
                          <Icon size={20} className="mb-2 opacity-80" />
                          <span className="text-xs font-semibold">{link.name}</span>
                        </NavLink>
                      );
                    })}
                  </div>

                  <div className="mt-6 p-5 rounded-2xl bg-gradient-to-br from-slate-50 to-slate-100 dark:from-zinc-900 dark:to-zinc-950 border border-slate-100 dark:border-zinc-800/60 shadow-sm">
                    <h4 className="text-sm font-bold text-black dark:text-white mb-1">
                      Order Any Service!
                    </h4>
                    <p className="text-xs text-slate-500 dark:text-zinc-400 leading-relaxed mb-4">
                      We are ready to help you grow your business. Contact us today to get started.
                    </p>
                    <NavLink
                      to="/contact"
                      onClick={() => setIsOpen(false)}
                      className="flex items-center justify-center gap-2 w-full py-2.5 px-4 rounded-xl bg-[#04C244] text-black text-xs font-bold transition-all shadow-md shadow-[#04C244]/10"
                    >
                      Order Now
                      <ArrowRight size={14} />
                    </NavLink>
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;
