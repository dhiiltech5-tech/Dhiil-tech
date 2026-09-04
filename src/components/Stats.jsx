import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, Users, Map, Award } from 'lucide-react';
import { getStats } from '../services/api';

const Stats = () => {
  const calculateYearsOfExperience = () => {
    const startDate = new Date(2025, 3); // April 2025 (Month is 0-indexed: 3 is April)
    const today = new Date();
    let years = today.getFullYear() - startDate.getFullYear();
    const m = today.getMonth() - startDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < startDate.getDate())) {
      years--;
    }
    return Math.max(1, years);
  };

  const [statsList, setStatsList] = useState([
    { number: 1, suffix: '+', label: 'Projects Done', icon: <CheckCircle2 className="w-6 h-6 sm:w-8 sm:h-8 text-[#00E676]" /> },
    { number: 20, suffix: '+', label: 'Trusted Partners', icon: <Users className="w-6 h-6 sm:w-8 sm:h-8 text-[#00E676]" /> },
    { number: 2, suffix: '+', label: 'Regions Served', icon: <Map className="w-6 h-6 sm:w-8 sm:h-8 text-[#00E676]" /> },
    { number: calculateYearsOfExperience(), suffix: '+', label: 'Years Experience', icon: <Award className="w-6 h-6 sm:w-8 sm:h-8 text-[#00E676]" /> }
  ]);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await getStats();
        if (data) {
          setStatsList([
            { number: data.projects, suffix: '+', label: 'Projects Done', icon: <CheckCircle2 className="w-6 h-6 sm:w-8 sm:h-8 text-[#00E676]" /> },
            { number: data.clients, suffix: '+', label: 'Trusted Partners', icon: <Users className="w-6 h-6 sm:w-8 sm:h-8 text-[#00E676]" /> },
            { number: data.services, suffix: '+', label: 'Regions Served', icon: <Map className="w-6 h-6 sm:w-8 sm:h-8 text-[#00E676]" /> },
            { number: calculateYearsOfExperience(), suffix: '+', label: 'Years Experience', icon: <Award className="w-6 h-6 sm:w-8 sm:h-8 text-[#00E676]" /> }
          ]);
        }
      } catch (err) {
        console.error('Failed to fetch public stats:', err);
      }
    };
    
    fetchStats();
  }, []);

  return (
    <section className="py-10 md:py-20 relative overflow-hidden bg-[#02140B] border-y border-[#00E676]/15 transition-colors duration-300">
      {/* Background glowing effects */}
      <div className="absolute top-1/2 left-1/4 w-96 h-96 bg-[#00E676]/10 rounded-full blur-[100px] -translate-y-1/2 pointer-events-none"></div>
      <div className="absolute top-1/2 right-1/4 w-96 h-96 bg-[#04C244]/10 rounded-full blur-[100px] -translate-y-1/2 pointer-events-none"></div>
      
      <div className="container mx-auto px-4 sm:px-6 relative z-10">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-8">
          {statsList.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.6 }}
              className="group relative"
            >
              {/* Animated glowing border background on hover */}
              <div className="absolute -inset-0.5 bg-gradient-to-r from-[#00E676]/0 via-[#00E676]/40 to-[#00E676]/0 rounded-3xl blur opacity-0 group-hover:opacity-100 transition duration-500"></div>
              
              {/* Card content */}
              <div className="relative h-full glass-card border border-[#00E676]/20 p-5 sm:p-8 rounded-3xl flex flex-col items-center text-center hover:-translate-y-2 transition-all duration-300 shadow-xl">
                
                {/* Icon Container */}
                <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-2xl bg-[#00E676]/10 border border-[#00E676]/20 flex items-center justify-center mb-4 sm:mb-6 group-hover:scale-110 group-hover:border-[#00E676]/50 transition-all duration-300">
                  {stat.icon}
                </div>
                
                {/* Number */}
                <div className="text-3xl sm:text-4xl md:text-5xl font-extrabold mb-1.5 sm:mb-3 text-white transition-colors flex items-center">
                  {stat.number}<span className="text-gradient ml-1">{stat.suffix}</span>
                </div>
                
                {/* Label */}
                <p className="text-slate-300 font-bold tracking-wider uppercase text-[10px] sm:text-xs md:text-sm transition-colors">
                  {stat.label}
                </p>
                
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Stats;
