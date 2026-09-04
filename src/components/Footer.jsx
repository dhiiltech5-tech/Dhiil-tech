import { useState, useEffect } from 'react';
import { NavLink, Link } from 'react-router-dom';
import { Phone, Mail, MapPin, Send, ArrowRight } from 'lucide-react';
import { subscribeNewsletter, getSettings } from '../services/api';

const Footer = () => {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState('idle'); // idle, loading, success, error
  const [settings, setSettings] = useState({
    company_email: 'hello@dhiiltech.com',
    contact_phone: '+252 61 9586339',
    office_location: 'Mogadishu, Somalia'
  });
  const currentYear = new Date().getFullYear();

  useEffect(() => {
    let mounted = true;
    getSettings().then(data => {
      if (mounted && data) {
        setSettings(data);
      }
    });
    return () => { mounted = false; };
  }, []);

  return (
    <footer className="relative bg-[#02140B] overflow-hidden border-t border-[#00E676]/20">
      {/* Top green glow accent */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[2px] bg-gradient-to-r from-transparent via-[#00E676] to-transparent shadow-[0_0_20px_#00E676]"></div>

      {/* CTA Banner */}
      <div className="hidden md:block border-b border-white/10">
        <div className="container mx-auto px-6 py-14 flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <h3 className="text-2xl md:text-3xl font-extrabold text-white mb-1 font-poppins">
              Ready to build something <span className="text-[#00E676]">amazing?</span>
            </h3>
            <p className="text-slate-300 text-sm">Let's turn your idea into a powerful digital product.</p>
          </div>
          <Link
            to="/contact"
            className="shrink-0 flex items-center gap-2 px-8 py-3.5 rounded-xl bg-gradient-to-r from-[#00E676] to-[#04C244] text-black font-extrabold shadow-[0_0_25px_rgba(0,230,118,0.3)] hover:shadow-[0_0_35px_rgba(0,230,118,0.5)] hover:scale-[1.02] transition-all group text-sm"
          >
            Get In Touch
            <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>

      {/* Main Footer */}
      <div className="container mx-auto px-6 pt-14 pb-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-10 mb-14">

          {/* Brand Column */}
          <div className="col-span-2 lg:col-span-1 space-y-5">
            <Link to="/" className="flex items-center gap-3">
              <img src="/assets/images/logo.png" alt="Dhiil Tech Logo" className="h-14 w-14 rounded-full object-cover border-2 border-[#00E676]/40 shadow-lg shadow-[#00E676]/20" />
              <span className="text-xl font-black text-white tracking-wider uppercase font-poppins">
                Dhiil <span className="text-[#00E676] drop-shadow-[0_0_10px_rgba(0,230,118,0.4)]">Tech</span>
              </span>
            </Link>
            <p className="text-slate-400 text-sm leading-relaxed max-w-sm">
              Delivering modern, world-class digital solutions for the next generation of Somali businesses.
            </p>

            {/* Social Links */}
            <div className="flex flex-wrap gap-2.5 pt-1">
              {[
                { href: 'https://www.facebook.com/profile.php?id=61589772293579', icon: 'fab fa-facebook-f' },
                { href: 'https://www.instagram.com/dhiiltech?igsh=MW5qaDk3M3N0NnRneQ%3D%3D&utm_source=qr', icon: 'fab fa-instagram' },
                { href: 'https://linkedin.com/company/dhiiltech', icon: 'fab fa-linkedin-in' },
                { href: 'https://wa.me/252619586339', icon: 'fab fa-whatsapp' },
              ].map((s, i) => (
                <a
                  key={i}
                  href={s.href}
                  target="_blank"
                  rel="noreferrer"
                  className="w-10 h-10 rounded-full border border-white/10 bg-white/5 flex items-center justify-center text-slate-300 hover:text-black hover:bg-[#00E676] hover:border-[#00E676] hover:scale-105 transition-all duration-300"
                  aria-label="Social Link"
                >
                  <i className={`${s.icon} text-sm`}></i>
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links Column */}
          <div className="col-span-1">
            <h4 className="text-white font-bold mb-5 uppercase tracking-widest text-[11px] flex items-center gap-2 font-poppins">
              Quick Links
              <span className="h-0.5 w-6 bg-[#00E676] rounded"></span>
            </h4>
            <ul className="space-y-3.5">
              {[
                { label: 'Home', to: '/' },
                { label: 'About Us', to: '/about' },
                { label: 'Services', to: '/services' },
                { label: 'News', to: '/news' },
                { label: 'Projects', to: '/portfolio' },
                { label: 'Contact', to: '/contact' },
              ].map((link, idx) => (
                <li key={idx}>
                  <NavLink
                    to={link.to}
                    className="text-slate-300 hover:text-[#00E676] transition-all duration-300 text-sm flex items-center gap-1.5 hover:translate-x-1"
                  >
                    {link.label}
                  </NavLink>
                </li>
              ))}
            </ul>
          </div>

          {/* Services Column */}
          <div className="col-span-1">
            <h4 className="text-white font-bold mb-5 uppercase tracking-widest text-[11px] flex items-center gap-2 font-poppins">
              Services
              <span className="h-0.5 w-6 bg-[#00E676] rounded"></span>
            </h4>
            <ul className="space-y-3.5">
              {['Web Development', 'Mobile Apps', 'Multimedia', 'UI/UX Design', 'Digital Marketing'].map((service, idx) => (
                <li key={idx}>
                  <Link
                    to="/services"
                    className="text-slate-300 hover:text-[#00E676] transition-all duration-300 text-sm flex items-center gap-1.5 hover:translate-x-1"
                  >
                    {service}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact & Newsletter Column */}
          <div className="col-span-2 lg:col-span-1 space-y-6">
            <h4 className="text-white font-bold mb-5 uppercase tracking-widest text-[11px] flex items-center gap-2 font-poppins">
              Contact Us
              <span className="h-0.5 w-6 bg-[#00E676] rounded"></span>
            </h4>
            
            <div className="space-y-4">
              <a href={`tel:${settings.contact_phone.replace(/\s+/g, '')}`} className="flex items-center gap-3.5 text-sm text-slate-300 hover:text-[#00E676] transition-all hover:translate-x-1 group">
                <span className="w-9 h-9 rounded-full border border-white/10 group-hover:bg-[#00E676]/15 group-hover:border-[#00E676]/40 flex items-center justify-center transition-colors shrink-0">
                  <Phone size={14} className="text-[#00E676]" />
                </span>
                <span className="truncate">{settings.contact_phone}</span>
              </a>
              
              <a href={`mailto:${settings.company_email}`} className="flex items-center gap-3.5 text-sm text-slate-300 hover:text-[#00E676] transition-all hover:translate-x-1 group">
                <span className="w-9 h-9 rounded-full border border-white/10 group-hover:bg-[#00E676]/15 group-hover:border-[#00E676]/40 flex items-center justify-center transition-colors shrink-0">
                  <Mail size={14} className="text-[#00E676]" />
                </span>
                <span className="truncate">{settings.company_email}</span>
              </a>
              
              <div className="flex items-center gap-3.5 text-sm text-slate-300">
                <span className="w-9 h-9 rounded-full border border-white/10 flex items-center justify-center shrink-0">
                  <MapPin size={14} className="text-[#00E676]" />
                </span>
                <span>{settings.office_location}</span>
              </div>
            </div>

            {/* Newsletter */}
            <div className="pt-2">
              <p className="text-[10px] text-slate-400 mb-2.5 uppercase tracking-widest font-semibold">Newsletter</p>
              {status === 'success' ? (
                <p className="text-xs text-[#00E676] font-medium bg-[#00E676]/10 border border-[#00E676]/20 py-2 px-3 rounded-lg">
                  Successfully subscribed!
                </p>
              ) : (
                <form 
                  className="flex gap-2" 
                  onSubmit={async (e) => {
                    e.preventDefault();
                    setStatus('loading');
                    const res = await subscribeNewsletter(email);
                    if (res.success) {
                      setStatus('success');
                      setEmail('');
                      setTimeout(() => setStatus('idle'), 5000);
                    } else {
                      setStatus('error');
                      alert(res.message || "Failed to subscribe");
                      setStatus('idle');
                    }
                  }}
                >
                  <input
                    type="email"
                    placeholder="Your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="flex-1 bg-white/5 border border-white/10 rounded-xl py-2.5 px-3 text-sm text-white placeholder-slate-400 focus:outline-none focus:border-[#00E676] transition-colors"
                    required
                    disabled={status === 'loading'}
                  />
                  <button
                    type="submit"
                    disabled={status === 'loading'}
                    className="p-2.5 rounded-xl bg-gradient-to-r from-[#00E676] to-[#04C244] text-black hover:shadow-lg hover:shadow-[#00E676]/30 hover:scale-105 transition-all disabled:opacity-50 flex items-center justify-center font-bold"
                    aria-label="Subscribe"
                  >
                    <Send size={15} />
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-white/5 pt-6 flex flex-col sm:flex-row justify-between items-center gap-3">
          <div className="flex flex-col sm:flex-row items-center gap-4">
            <p className="text-slate-600 text-xs">
              © {currentYear} <span className="text-slate-500">Dhiil Tech</span>. All Rights Reserved.
            </p>
          </div>
          <p className="text-slate-700 text-xs">
            Built with 💚 in Somalia
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
