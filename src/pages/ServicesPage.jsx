import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Code, MonitorPlay, Smartphone, GitPullRequest, Palette, Megaphone } from 'lucide-react';
import { getServices } from '../services/api';

const iconMap = {
  'fas fa-laptop-code': <MonitorPlay size={28} className="text-[#00E676]" />,
  'fas fa-mobile-alt': <Smartphone size={28} className="text-[#00E676]" />,
  'fas fa-cogs': <GitPullRequest size={28} className="text-[#00E676]" />,
  'fas fa-palette': <Palette size={28} className="text-[#00E676]" />,
  'fas fa-film': <MonitorPlay size={28} className="text-[#00E676]" />,
  'fas fa-bullhorn': <Megaphone size={28} className="text-[#00E676]" />,
};

const renderIcon = (icon) => {
  if (typeof icon === 'string' && icon.startsWith('fas ')) {
    return <i className={`${icon} text-2xl text-[#00E676]`}></i>;
  }
  return iconMap[icon] || <Code size={28} className="text-[#00E676]" />;
};

const ServicesPage = () => {
  const [servicesList, setServicesList] = useState([]);
  const [activeStepIndex, setActiveStepIndex] = useState(0);

  useEffect(() => {
    let mounted = true;
    getServices().then(data => {
      if (mounted && data) {
        setServicesList(data);
      }
    });
    return () => { mounted = false; };
  }, []);

  const handleStepScroll = (e) => {
    const container = e.target;
    const scrollPosition = container.scrollLeft;
    const cardWidth = container.scrollWidth / 4;
    const index = Math.round(scrollPosition / cardWidth);
    if (index >= 0 && index < 4) {
      setActiveStepIndex(index);
    }
  };

  const fadeUp = {
    initial: { opacity: 0, y: 30 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true },
    transition: { duration: 0.6 },
  };

  return (
    <div className="min-h-screen bg-[#02140B]">

      {/* ── Hero Banner ── */}
      <section className="page-hero relative flex items-center justify-center text-center overflow-hidden" style={{ minHeight: '380px' }}>
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(0,230,118,0.15)_0%,#02140B_70%)] hero-bg-overlay"></div>
        <div className="relative z-10 px-6 py-28">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-5xl md:text-6xl font-extrabold text-white mb-6 font-poppins"
          >
            Our <span className="text-[#00E676]">Services</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-slate-300 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed"
          >
            Comprehensive digital solutions designed to elevate your business in the modern digital landscape.
          </motion.p>
        </div>
      </section>

      {/* ── Services Grid ── */}
      <section className="py-24">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {servicesList.map((service, i) => (
              <motion.div
                key={i}
                {...fadeUp}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="glass-card p-6 sm:p-8 group hover:border-[#00E676]/50 transition-all border border-[#00E676]/15"
              >
                <div className="w-14 h-14 rounded-2xl bg-[#00E676]/10 border border-[#00E676]/20 flex items-center justify-center text-[#00E676] mb-6 group-hover:scale-110 transition-transform">
                  {renderIcon(service.icon)}
                </div>
                <h3 className="text-xl font-extrabold text-white mb-3 group-hover:text-[#00E676] transition-colors truncate">
                  {service.name || service.title}
                </h3>
                <p className="text-slate-300 text-sm leading-relaxed mb-6 line-clamp-3 font-normal">{service.desc}</p>

                {service.features && service.features.length > 0 && (
                  <ul className="space-y-2 pt-4 border-t border-white/10 text-xs sm:text-sm text-slate-300">
                    {service.features.slice(0, 3).map((feat, idx) => (
                      <li key={idx} className="flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#00E676] shrink-0"></span>
                        <span className="truncate">{feat}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Workflow Process Section ── */}
      <section className="py-20 border-t border-white/10 bg-[#02140B]">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-4xl font-extrabold text-white mb-4 font-poppins">How We <span className="text-[#00E676]">Work</span></h2>
          <p className="text-slate-300 max-w-xl mx-auto mb-16 text-sm sm:text-base">Our structured process guarantees quality results delivered on time.</p>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { step: '01', title: 'Discovery', desc: 'Understanding your requirements and business goals.' },
              { step: '02', title: 'Design', desc: 'Creating intuitive UI/UX mockups and prototypes.' },
              { step: '03', title: 'Development', desc: 'Building scalable code with best security practices.' },
              { step: '04', title: 'Deployment', desc: 'Testing, launching, and continuous support.' },
            ].map((st, i) => (
              <div key={i} className="text-center glass-card p-6 border border-[#00E676]/20">
                <div className="w-14 h-14 rounded-full border-2 border-[#00E676]/50 flex items-center justify-center text-[#00E676] font-extrabold text-lg mx-auto mb-4 bg-[#00E676]/10">
                  {st.step}
                </div>
                <h3 className="text-lg font-bold text-white mb-2">{st.title}</h3>
                <p className="text-xs text-slate-300 leading-relaxed">{st.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA Banner Section ── */}
      <section className="py-20 bg-gradient-to-b from-transparent to-[#010D07]">
        <div className="container mx-auto px-6 text-center">
          <div className="glass-card max-w-4xl mx-auto p-10 sm:p-14 border border-[#00E676]/30">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white mb-4 font-poppins">
              Have a project in <span className="text-[#00E676]">mind?</span>
            </h2>
            <p className="text-slate-300 max-w-xl mx-auto mb-8 text-sm sm:text-base">
              Let's talk about how we can help your business thrive online.
            </p>
            <Link
              to="/contact"
              className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl bg-gradient-to-r from-[#00E676] to-[#04C244] text-black font-extrabold hover:shadow-lg hover:shadow-[#00E676]/30 hover:scale-[1.02] transition-all group"
            >
              Start A Project
              <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
};

export default ServicesPage;
