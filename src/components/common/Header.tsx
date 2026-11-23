import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useLanguage } from '../../context/LanguageContext';
import { AurelleLogo } from './AurelleLogo';
import { 
  Sparkles, 
  Menu, 
  X, 
  ChevronDown, 
  UserCheck, 
  Scissors, 
  Tv, 
  ShieldCheck, 
  FlaskConical,
  PhoneCall
} from 'lucide-react';

export const Header: React.FC = () => {
  const { language, setLanguage, t } = useLanguage();
  const location = useLocation();
  const navigate = useNavigate();

  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [staffMenuOpen, setStaffMenuOpen] = useState(false);

  // Monitor scroll for header background opacity
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 30);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close menus on route change
  useEffect(() => {
    setMobileMenuOpen(false);
    setStaffMenuOpen(false);
  }, [location.pathname]);

  // Handle smooth scroll anchor or navigation
  const handleNavClick = (sectionId: string) => {
    if (location.pathname === '/') {
      const el = document.getElementById(sectionId);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      }
    } else {
      navigate(`/#${sectionId}`);
    }
    setMobileMenuOpen(false);
  };

  // Hide in Wall TV Display mode
  if (location.pathname === '/display') {
    return null;
  }

  const isHome = location.pathname === '/';

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          isScrolled || !isHome
            ? 'bg-[#162E25]/95 backdrop-blur-md border-b border-[#2D5240] py-3.5 shadow-md'
            : 'bg-gradient-to-b from-[#0F221B]/90 via-[#162E25]/60 to-transparent py-5 sm:py-6'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            
            {/* LEFT: AURELLE Monogram & Wordmark */}
            <Link to="/" className="group focus:outline-none">
              <AurelleLogo size="md" variant="light" showSubtitle={true} />
            </Link>

            {/* CENTER: Editorial Navigation Links (Desktop) */}
            <nav className="hidden lg:flex items-center space-x-7 text-xs font-medium tracking-[0.14em] uppercase text-stone-200">
              <Link
                to="/"
                className="hover:text-[#C5A880] transition-colors relative py-1 after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-[1px] after:bg-[#C5A880] hover:after:w-full after:transition-all"
              >
                {t('home')}
              </Link>
              <button
                type="button"
                onClick={() => handleNavClick('services')}
                className="hover:text-[#C5A880] transition-colors relative py-1 after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-[1px] after:bg-[#C5A880] hover:after:w-full after:transition-all"
              >
                {t('ourServices')}
              </button>
              <button
                type="button"
                onClick={() => handleNavClick('stylists')}
                className="hover:text-[#C5A880] transition-colors relative py-1 after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-[1px] after:bg-[#C5A880] hover:after:w-full after:transition-all"
              >
                {t('ourStylists')}
              </button>
              <button
                type="button"
                onClick={() => handleNavClick('salon-experience')}
                className="hover:text-[#C5A880] transition-colors relative py-1 after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-[1px] after:bg-[#C5A880] hover:after:w-full after:transition-all"
              >
                {t('ourSalon')}
              </button>
              <button
                type="button"
                onClick={() => handleNavClick('visit')}
                className="hover:text-[#C5A880] transition-colors relative py-1 after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-[1px] after:bg-[#C5A880] hover:after:w-full after:transition-all"
              >
                {t('visitUs')}
              </button>
            </nav>

            {/* RIGHT: Discreet Staff Portal, Language Switcher & Join Queue CTA */}
            <div className="hidden md:flex items-center space-x-3.5">
              
              {/* Discreet Staff / Operations Dropdown */}
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setStaffMenuOpen(!staffMenuOpen)}
                  className="flex items-center space-x-1.5 px-3 py-1.5 rounded-full text-[11px] font-medium tracking-wider uppercase text-stone-300 hover:text-white bg-[#0F221B]/60 hover:bg-[#0F221B] border border-[#2D5240] transition-all"
                >
                  <span>{t('staffPortal')}</span>
                  <ChevronDown className="w-3 h-3 text-[#C5A880]" />
                </button>

                {staffMenuOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-[#162E25] border border-[#2D5240] rounded-2xl shadow-2xl py-2 z-50 text-xs backdrop-blur-lg animate-fade-in divide-y divide-[#2D5240]/60">
                    <div className="px-3 py-1.5 text-[10px] font-mono uppercase tracking-widest text-[#C5A880]">
                      Operations Console
                    </div>
                    <div className="py-1">
                      <Link
                        to="/reception"
                        onClick={() => setStaffMenuOpen(false)}
                        className="flex items-center space-x-2.5 px-3.5 py-2 text-stone-200 hover:bg-[#2D5240] hover:text-[#C5A880] transition-colors"
                      >
                        <UserCheck className="w-3.5 h-3.5 text-[#C5A880]" />
                        <span>{t('reception')}</span>
                      </Link>
                      <Link
                        to="/barber/vikram"
                        onClick={() => setStaffMenuOpen(false)}
                        className="flex items-center space-x-2.5 px-3.5 py-2 text-stone-200 hover:bg-[#2D5240] hover:text-[#C5A880] transition-colors"
                      >
                        <Scissors className="w-3.5 h-3.5 text-[#C5A880]" />
                        <span>{t('barbers')}</span>
                      </Link>
                      <Link
                        to="/display"
                        onClick={() => setStaffMenuOpen(false)}
                        className="flex items-center space-x-2.5 px-3.5 py-2 text-stone-200 hover:bg-[#2D5240] hover:text-[#C5A880] transition-colors"
                      >
                        <Tv className="w-3.5 h-3.5 text-[#C5A880]" />
                        <span>{t('display')}</span>
                      </Link>
                      <Link
                        to="/admin"
                        onClick={() => setStaffMenuOpen(false)}
                        className="flex items-center space-x-2.5 px-3.5 py-2 text-stone-200 hover:bg-[#2D5240] hover:text-[#C5A880] transition-colors"
                      >
                        <ShieldCheck className="w-3.5 h-3.5 text-[#C5A880]" />
                        <span>{t('admin')}</span>
                      </Link>
                    </div>
                    <div className="pt-1">
                      <Link
                        to="/test-suite"
                        onClick={() => setStaffMenuOpen(false)}
                        className="flex items-center space-x-2 px-3.5 py-1.5 text-[11px] font-mono text-amber-300 hover:bg-[#2D5240] transition-colors"
                      >
                        <FlaskConical className="w-3 h-3" />
                        <span>15-Point Diagnostics</span>
                      </Link>
                    </div>
                  </div>
                )}
              </div>

              {/* Language Switcher */}
              <div className="flex items-center bg-[#0F221B] p-1 rounded-full border border-[#2D5240] text-xs font-semibold">
                <button
                  type="button"
                  onClick={() => setLanguage('en')}
                  className={`px-2.5 py-1 rounded-full transition-all text-[11px] ${
                    language === 'en'
                      ? 'bg-[#C5A880] text-[#162E25] font-bold shadow-sm'
                      : 'text-stone-300 hover:text-white'
                  }`}
                >
                  EN
                </button>
                <button
                  type="button"
                  onClick={() => setLanguage('gu')}
                  className={`px-2.5 py-1 rounded-full transition-all text-[11px] ${
                    language === 'gu'
                      ? 'bg-[#C5A880] text-[#162E25] font-bold shadow-sm'
                      : 'text-stone-300 hover:text-white'
                  }`}
                >
                  ગુજરાતી
                </button>
              </div>

              {/* Primary Prominent CTA */}
              <Link
                to="/join"
                className="bg-[#C5A880] hover:bg-[#D4AF37] active:scale-[0.98] text-[#162E25] font-serif font-bold text-xs uppercase tracking-widest py-2.5 px-5 rounded-full shadow-md transition-all flex items-center space-x-2"
              >
                <Sparkles className="w-3.5 h-3.5 fill-[#162E25]" />
                <span>{t('joinQueue')}</span>
              </Link>

            </div>

            {/* Mobile Hamburger Button */}
            <div className="flex items-center space-x-2 md:hidden">
              <Link
                to="/join"
                className="bg-[#C5A880] text-[#162E25] font-bold text-[11px] uppercase tracking-wider py-1.5 px-3 rounded-full"
              >
                {t('joinQueue')}
              </Link>
              <button
                type="button"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 text-stone-200 hover:text-white focus:outline-none"
                aria-label="Open Mobile Menu"
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>

          </div>
        </div>
      </header>

      {/* Mobile Slide-Out Navigation Drawer */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-md md:hidden animate-fade-in">
          <div className="fixed top-0 right-0 bottom-0 w-4/5 max-w-sm bg-[#162E25] border-l border-[#2D5240] p-6 flex flex-col justify-between shadow-2xl overflow-y-auto">
            
            {/* Drawer Top */}
            <div className="space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-[#2D5240]">
                <AurelleLogo size="sm" variant="light" showSubtitle={false} />
                <button
                  type="button"
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-1 text-stone-300 hover:text-white"
                  aria-label="Close menu"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              {/* Language Switch */}
              <div className="flex items-center justify-between bg-[#0F221B] p-2 rounded-xl border border-[#2D5240]">
                <span className="text-xs text-stone-400 font-medium">Language / ભાષા</span>
                <div className="flex space-x-1">
                  <button
                    type="button"
                    onClick={() => setLanguage('en')}
                    className={`px-3 py-1 rounded-lg text-xs font-bold ${
                      language === 'en' ? 'bg-[#C5A880] text-[#162E25]' : 'text-stone-300'
                    }`}
                  >
                    EN
                  </button>
                  <button
                    type="button"
                    onClick={() => setLanguage('gu')}
                    className={`px-3 py-1 rounded-lg text-xs font-bold ${
                      language === 'gu' ? 'bg-[#C5A880] text-[#162E25]' : 'text-stone-300'
                    }`}
                  >
                    ગુજરાતી
                  </button>
                </div>
              </div>

              {/* Primary Mobile Links */}
              <nav className="flex flex-col space-y-3 font-serif text-lg tracking-wide text-stone-200">
                <Link
                  to="/"
                  onClick={() => setMobileMenuOpen(false)}
                  className="py-1 hover:text-[#C5A880] transition-colors"
                >
                  {t('home')}
                </Link>
                <button
                  type="button"
                  onClick={() => handleNavClick('services')}
                  className="py-1 text-left hover:text-[#C5A880] transition-colors"
                >
                  {t('ourServices')}
                </button>
                <button
                  type="button"
                  onClick={() => handleNavClick('stylists')}
                  className="py-1 text-left hover:text-[#C5A880] transition-colors"
                >
                  {t('ourStylists')}
                </button>
                <button
                  type="button"
                  onClick={() => handleNavClick('salon-experience')}
                  className="py-1 text-left hover:text-[#C5A880] transition-colors"
                >
                  {t('ourSalon')}
                </button>
                <button
                  type="button"
                  onClick={() => handleNavClick('visit')}
                  className="py-1 text-left hover:text-[#C5A880] transition-colors"
                >
                  {t('visitUs')}
                </button>
              </nav>

              {/* Staff & Operations Links */}
              <div className="pt-4 border-t border-[#2D5240] space-y-2">
                <p className="text-[10px] font-mono uppercase tracking-widest text-[#C5A880]">
                  {t('staffPortal')}
                </p>
                <div className="grid grid-cols-2 gap-2 text-xs text-stone-300">
                  <Link
                    to="/reception"
                    onClick={() => setMobileMenuOpen(false)}
                    className="p-2 bg-[#0F221B] rounded-lg border border-[#2D5240] flex items-center space-x-1.5"
                  >
                    <UserCheck className="w-3.5 h-3.5 text-[#C5A880]" />
                    <span>Reception</span>
                  </Link>
                  <Link
                    to="/barber/vikram"
                    onClick={() => setMobileMenuOpen(false)}
                    className="p-2 bg-[#0F221B] rounded-lg border border-[#2D5240] flex items-center space-x-1.5"
                  >
                    <Scissors className="w-3.5 h-3.5 text-[#C5A880]" />
                    <span>Stylists</span>
                  </Link>
                  <Link
                    to="/display"
                    onClick={() => setMobileMenuOpen(false)}
                    className="p-2 bg-[#0F221B] rounded-lg border border-[#2D5240] flex items-center space-x-1.5"
                  >
                    <Tv className="w-3.5 h-3.5 text-[#C5A880]" />
                    <span>Wall TV</span>
                  </Link>
                  <Link
                    to="/admin"
                    onClick={() => setMobileMenuOpen(false)}
                    className="p-2 bg-[#0F221B] rounded-lg border border-[#2D5240] flex items-center space-x-1.5"
                  >
                    <ShieldCheck className="w-3.5 h-3.5 text-[#C5A880]" />
                    <span>Admin</span>
                  </Link>
                </div>
              </div>
            </div>

            {/* Drawer Bottom CTA */}
            <div className="pt-6">
              <Link
                to="/join"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full bg-[#C5A880] text-[#162E25] font-serif font-bold text-center text-sm py-3 px-4 rounded-full shadow-md flex items-center justify-center space-x-2"
              >
                <Sparkles className="w-4 h-4 fill-[#162E25]" />
                <span>{t('joinQueueNow')}</span>
              </Link>
            </div>

          </div>
        </div>
      )}
    </>
  );
};
