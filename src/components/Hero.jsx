import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Sparkles } from 'lucide-react';

const bgImages = [
  '/assets/images/bg1.jpg',
  '/assets/images/bg2.jpg',
  '/assets/images/bg3.jpg'
];

const Hero = () => {
  const [currentBg, setCurrentBg] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentBg((prev) => (prev + 1) % bgImages.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="relative min-h-screen flex items-center justify-center pt-24 pb-16 overflow-hidden transition-colors duration-300">
      {/* Background Slider with Unified Emerald Glows */}
      <div className="absolute inset-0 z-0 bg-[#02140B] transition-colors">
        <AnimatePresence>
          <motion.img
            key={currentBg}
            src={bgImages[currentBg]}
            initial={{ opacity: 0, scale: 1.05 }}
            animate={{ opacity: 0.25, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.5 }}
            className="absolute inset-0 w-full h-full object-cover filter brightness-75 contrast-125"
            alt="Hero Background"
          />
        </AnimatePresence>
        {/* Soft Emerald Gradient Overlays */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#02140B]/90 via-[#02140B]/70 to-[#02140B]"></div>
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(0,230,118,0.14)_0%,transparent_70%)]"></div>
      </div>
      
      {/* Ambient Radial Orbs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#00E676]/15 rounded-full blur-[140px] pointer-events-none z-0 animate-pulse"></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[#04C244]/15 rounded-full blur-[140px] pointer-events-none z-0"></div>

      <div className="container mx-auto px-6 relative z-10 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-4xl mx-auto"
        >
          {/* Tech Badge */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="inline-flex items-center gap-2.5 px-5 py-2 rounded-full glass-card mb-8 text-xs sm:text-sm font-semibold text-white/90 border border-[#00E676]/30 shadow-[0_0_20px_rgba(0,230,118,0.15)]"
          >
            <Sparkles size={16} className="text-[#00E676]" />
            <span className="tracking-wide">Smart Digital Solutions & Enterprise Tech</span>
          </motion.div>

          {/* Main Title */}
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="text-5xl sm:text-6xl md:text-7xl font-extrabold tracking-tight mb-6 text-white leading-[1.1]"
          >
            Smart Digital <br className="hidden sm:block" />
            <span className="text-gradient drop-shadow-[0_0_35px_rgba(0,230,118,0.35)]">Solutions</span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.8 }}
            className="text-base sm:text-lg md:text-xl text-slate-300 mb-10 max-w-2xl mx-auto leading-relaxed font-normal"
          >
            We build high-performance web applications, mobile platforms, and enterprise software engineered for speed, innovation, and exponential growth.
          </motion.p>

          {/* Action CTA Buttons */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, duration: 0.8 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Link 
              to="/services" 
              className="w-full sm:w-auto px-8 py-4 rounded-xl bg-gradient-to-r from-[#00E676] to-[#04C244] text-black font-extrabold shadow-[0_0_25px_rgba(0,230,118,0.3)] hover:shadow-[0_0_35px_rgba(0,230,118,0.5)] hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 flex items-center justify-center gap-2 group text-base"
            >
              Explore Services
              <ArrowRight size={18} className="group-hover:translate-x-1.5 transition-transform" />
            </Link>
            <Link 
              to="/portfolio" 
              className="w-full sm:w-auto px-8 py-4 rounded-xl glass-card text-white font-semibold border border-[#00E676]/30 hover:border-[#00E676]/60 hover:bg-white/10 transition-all duration-300 flex items-center justify-center text-base"
            >
              View Our Projects
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;
