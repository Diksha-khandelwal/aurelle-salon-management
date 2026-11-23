import React from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../../context/LanguageContext';
import { AurelleLogo } from './AurelleLogo';
import { MapPin, Phone, Clock, Award, Shield, Sparkles, ArrowRight } from 'lucide-react';

export const Footer: React.FC = () => {
  const { t } = useLanguage();

  return (
    <footer className="bg-[#162E25] text-[#FBF9F5] border-t border-[#2D5240] pt-16 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Top Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 pb-12 border-b border-[#2D5240]">
          
          {/* Brand Info */}
          <div className="md:col-span-2 space-y-4">
            <AurelleLogo size="lg" variant="light" showSubtitle={true} />
            <p className="text-stone-300 text-sm max-w-md leading-relaxed pt-2">
              A serene unisex salon sanctuary in Navrangpura, Ahmedabad. Dedicated to architectural precision hair craftsmanship, bespoke balayage, and restorative skin rituals—backed by live, transparent queue dispatch.
            </p>
            <div className="flex flex-wrap items-center gap-4 text-xs text-[#C5A880] pt-2">
              <span className="flex items-center space-x-1.5">
                <Award className="w-4 h-4" />
                <span>Certified Master Stylists</span>
              </span>
              <span className="flex items-center space-x-1.5">
                <Shield className="w-4 h-4" />
                <span>Strict FIFO Queue Discipline</span>
              </span>
              <span className="flex items-center space-x-1.5">
                <Sparkles className="w-4 h-4" />
                <span>Complete Unisex Care</span>
              </span>
            </div>
          </div>

          {/* Location & Sanctuary Hours */}
          <div className="space-y-3">
            <h4 className="text-xs font-serif font-bold tracking-[0.2em] uppercase text-[#C5A880]">
              Sanctuary Hours &amp; Location
            </h4>
            <div className="space-y-2 text-xs text-stone-300 leading-relaxed">
              <div className="flex items-start space-x-2">
                <Clock className="w-4 h-4 text-[#C5A880] mt-0.5 shrink-0" />
                <span>{t('salonHours')}</span>
              </div>
              <div className="flex items-start space-x-2 pt-1">
                <MapPin className="w-4 h-4 text-[#C5A880] mt-0.5 shrink-0" />
                <span className="whitespace-pre-line">
                  Opp. Commerce College Road, Navrangpura, Ahmedabad, Gujarat 380009
                </span>
              </div>
            </div>
          </div>

          {/* Quick Concierge & Staff Portals */}
          <div className="space-y-3">
            <h4 className="text-xs font-serif font-bold tracking-[0.2em] uppercase text-[#C5A880]">
              Concierge &amp; Operations
            </h4>
            <div className="space-y-2 text-xs text-stone-300">
              <div className="flex items-center space-x-2">
                <Phone className="w-4 h-4 text-[#C5A880] shrink-0" />
                <span>{t('salonPhone')}</span>
              </div>
              <p className="text-[11px] text-stone-400">
                Online remote queue check-in active during salon hours.
              </p>
            </div>

            <div className="pt-3">
              <p className="text-[10px] font-mono uppercase tracking-widest text-[#C5A880] mb-1.5">
                Staff Operations
              </p>
              <div className="flex flex-wrap gap-2 text-[11px] text-stone-400">
                <Link to="/reception" className="hover:text-[#C5A880] underline">Reception</Link>
                <span>•</span>
                <Link to="/barber/vikram" className="hover:text-[#C5A880] underline">Stylist Station</Link>
                <span>•</span>
                <Link to="/display" className="hover:text-[#C5A880] underline">Wall TV</Link>
                <span>•</span>
                <Link to="/admin" className="hover:text-[#C5A880] underline">Admin</Link>
                <span>•</span>
                <Link to="/test-suite" className="hover:text-amber-300 font-mono">15-Tests</Link>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-stone-400 gap-3">
          <p>© {new Date().getFullYear()} AURELLE — Unisex Salon &amp; Studio. All rights reserved.</p>
          <p className="font-mono text-[#C5A880] text-[11px]">
            The Art of Looking Your Best • Navrangpura, Ahmedabad
          </p>
        </div>

      </div>
    </footer>
  );
};
