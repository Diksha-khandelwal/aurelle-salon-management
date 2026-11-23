import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useQueueStore } from '../store/useQueueStore';
import { useLanguage } from '../context/LanguageContext';
import { calculateLoungeWaitSummary } from '../utils/waitCalculator';
import { 
  Sparkles, 
  Clock, 
  Users, 
  Scissors, 
  ArrowRight, 
  Search, 
  Star,
  Coffee,
  CheckCircle2,
  AlertCircle,
  MapPin,
  Phone,
  Compass,
  Award,
  Shield,
  HeartHandshake
} from 'lucide-react';

export const HomeScreen: React.FC = () => {
  const { tokens, barbers, settings } = useQueueStore();
  const { language, t } = useLanguage();
  const navigate = useNavigate();

  const [lookupPhone, setLookupPhone] = useState('');
  const [lookupError, setLookupError] = useState('');

  const { waitingCount, estWaitMinutes, activeBarberCount, isAllOnBreak } = 
    calculateLoungeWaitSummary(tokens, barbers);

  const handleTrackPhone = (e: React.FormEvent) => {
    e.preventDefault();
    setLookupError('');

    const clean = lookupPhone.replace(/\D/g, '').slice(-10);
    if (clean.length < 10) {
      setLookupError('Please enter a valid 10-digit phone number.');
      return;
    }

    const activeToken = tokens.find(
      t => t.customerPhone === clean && (t.status === 'WAITING' || t.status === 'CALLED' || t.status === 'IN_SERVICE')
    );

    if (activeToken) {
      navigate(`/status/${activeToken.id}`);
    } else {
      setLookupError('No active queue token found for this phone number today.');
    }
  };

  const scrollToServices = () => {
    const el = document.getElementById('services');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  // 6 Editorial Service Categories for the Image Grid
  const serviceCategories = [
    {
      id: 'cat-1',
      title: t('catHaircuts'),
      desc: t('catHaircutsDesc'),
      image: 'https://images.unsplash.com/photo-1560066984-138dadb4c035?w=700&auto=format&fit=crop&q=80',
      tag: 'CRAFT & PRECISION',
    },
    {
      id: 'cat-2',
      title: t('catColor'),
      desc: t('catColorDesc'),
      image: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=700&auto=format&fit=crop&q=80',
      tag: 'BESPOKE SHADES',
    },
    {
      id: 'cat-3',
      title: t('catTreatments'),
      desc: t('catTreatmentsDesc'),
      image: 'https://images.unsplash.com/photo-1519699047748-de8e457a634e?w=700&auto=format&fit=crop&q=80',
      tag: 'DEEP THERAPY',
    },
    {
      id: 'cat-4',
      title: t('catSkin'),
      desc: t('catSkinDesc'),
      image: 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=700&auto=format&fit=crop&q=80',
      tag: 'GLOW & RENEWAL',
    },
    {
      id: 'cat-5',
      title: t('catNails'),
      desc: t('catNailsDesc'),
      image: 'https://images.unsplash.com/photo-1604654894610-df63bc536371?w=700&auto=format&fit=crop&q=80',
      tag: 'PAMPERING',
    },
    {
      id: 'cat-6',
      title: t('catBridal'),
      desc: t('catBridalDesc'),
      image: 'https://images.unsplash.com/photo-1595476108010-b4d1f102b1b1?w=700&auto=format&fit=crop&q=80',
      tag: 'OCCASION GLAMOUR',
    },
  ];

  return (
    <div className="min-h-screen bg-[#FBF9F5] text-[#1C1917] selection:bg-[#C5A880]/30 selection:text-[#162E25]">
      
      {/* =========================================================================
          SECTION 1 — EDITORIAL HERO
          ========================================================================= */}
      <section className="relative min-h-[92vh] flex items-center justify-center overflow-hidden bg-[#0F221B]">
        {/* Background Salon Atmosphere Photography — Clearly Visible with Translucent Tint (~50% Opacity) */}
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1521590832167-7bcbfaa6381f?w=1920&auto=format&fit=crop&q=85"
            alt="AURELLE Salon Studio Interior"
            className="w-full h-full object-cover object-center scale-105 transition-transform duration-1000"
          />
          {/* Translucent Botanical Green Overlay (~48-52%) allowing the salon chairs & mirrors to be clearly visible */}
          <div className="absolute inset-0 bg-[#0F221B]/45" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0F221B]/80 via-[#162E25]/45 to-[#0F221B]/60" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#0F221B]/50 via-transparent to-[#0F221B]/50" />
        </div>

        {/* Hero Content Container with enhanced text shadow for crisp readability */}
        <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-24 sm:py-32 text-center space-y-7 drop-shadow-sm">
          
          {/* Eyebrow */}
          <div className="inline-flex items-center space-x-2 bg-[#C5A880]/15 border border-[#C5A880]/40 text-[#E5D5B8] px-4 py-1.5 rounded-full text-xs font-serif tracking-[0.25em] uppercase shadow-sm">
            <Sparkles className="w-3.5 h-3.5 text-[#C5A880]" />
            <span>{t('heroEyebrow')}</span>
          </div>

          {/* Headline */}
          <h1 className="font-serif text-4xl sm:text-6xl md:text-7xl font-bold tracking-tight text-[#FBF9F5] leading-[1.1] max-w-4xl mx-auto">
            {t('heroTitle')}
          </h1>

          {/* Supporting Copy */}
          <p className="font-sans text-sm sm:text-lg text-stone-200 max-w-2xl mx-auto leading-relaxed font-light">
            {t('heroSubtitle')}
          </p>

          {/* Dual Action Buttons */}
          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/join"
              className="w-full sm:w-auto bg-[#C5A880] hover:bg-[#D4AF37] active:scale-[0.98] text-[#162E25] font-serif font-bold text-sm tracking-[0.14em] uppercase py-4 px-8 rounded-full shadow-lg transition-all flex items-center justify-center space-x-2.5 group"
            >
              <span>{t('joinQueueNow')}</span>
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </Link>

            <button
              type="button"
              onClick={scrollToServices}
              className="w-full sm:w-auto bg-transparent hover:bg-white/10 active:scale-[0.98] text-[#FBF9F5] border border-stone-300/40 font-serif font-medium text-sm tracking-[0.14em] uppercase py-3.5 px-7 rounded-full transition-all"
            >
              {t('exploreServices')}
            </button>
          </div>

          {/* Location Badge */}
          <div className="pt-6 flex items-center justify-center space-x-2 text-xs font-medium text-[#C5A880]/90 tracking-wider">
            <MapPin className="w-3.5 h-3.5 text-[#C5A880]" />
            <span>Navrangpura, Ahmedabad • Unisex Hair &amp; Beauty Studio</span>
          </div>

        </div>

        {/* Subtle Bottom Fade to Content */}
        <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-[#FBF9F5] to-transparent pointer-events-none" />
      </section>

      {/* =========================================================================
          SECTION 2 — EDITORIAL INTRODUCTION
          ========================================================================= */}
      <section className="py-20 sm:py-28 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Asymmetrical Image Arrangement */}
          <div className="lg:col-span-5 relative">
            <div className="relative rounded-3xl overflow-hidden shadow-2xl border-4 border-white aspect-[4/5]">
              <img
                src="https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=800&auto=format&fit=crop&q=80"
                alt="AURELLE Salon Aesthetic"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#162E25]/60 via-transparent to-transparent" />
              <div className="absolute bottom-6 left-6 right-6 text-white text-xs font-serif tracking-widest uppercase">
                AURELLE SANCTUARY • AHMEDABAD
              </div>
            </div>

            {/* Overlapping Floating Monogram Seal */}
            <div className="absolute -bottom-6 -right-6 bg-[#162E25] text-[#C5A880] p-4 rounded-2xl border-2 border-[#C5A880] shadow-xl hidden sm:block">
              <span className="block font-serif font-bold text-2xl tracking-wider text-center">AU</span>
              <span className="block text-[8px] tracking-[0.2em] uppercase font-sans mt-0.5">EST. 2026</span>
            </div>
          </div>

          {/* Editorial Text Composition */}
          <div className="lg:col-span-7 space-y-6 lg:pl-6">
            <span className="text-xs font-serif font-bold tracking-[0.25em] uppercase text-[#A88B65] block">
              {t('introSubheading')}
            </span>

            <h2 className="font-serif text-3xl sm:text-5xl font-bold tracking-tight text-[#162E25] leading-tight">
              {t('introHeadline')}
            </h2>

            <div className="w-16 h-[2px] bg-[#C5A880]" />

            <div className="space-y-4 text-stone-600 text-sm sm:text-base leading-relaxed font-light">
              <p>{t('introText1')}</p>
              <p>{t('introText2')}</p>
            </div>

            <div className="pt-2 flex flex-wrap gap-4 text-xs font-semibold text-[#162E25]">
              <span className="bg-[#F5F2EB] border border-[#E7E2D8] px-3.5 py-1.5 rounded-full">
                ✓ Bespoke Unisex Styling
              </span>
              <span className="bg-[#F5F2EB] border border-[#E7E2D8] px-3.5 py-1.5 rounded-full">
                ✓ Ammonia-Free Formulations
              </span>
              <span className="bg-[#F5F2EB] border border-[#E7E2D8] px-3.5 py-1.5 rounded-full">
                ✓ Zero Physical Queue Waiting
              </span>
            </div>
          </div>

        </div>
      </section>

      {/* =========================================================================
          SECTION 3 — LIVE QUEUE INFORMATION PANEL
          ========================================================================= */}
      <section className="py-12 bg-[#F5F2EB] border-y border-[#E7E2D8]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="bg-white rounded-3xl border border-[#E7E2D8] p-6 sm:p-8 shadow-elevated">
            
            {/* Top Bar of Queue Panel */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-stone-100 gap-3">
              <div>
                <div className="flex items-center space-x-2.5">
                  <span className={`w-3 h-3 rounded-full ${
                    !settings.isQueueOpen
                      ? 'bg-rose-500'
                      : isAllOnBreak
                      ? 'bg-slate-400'
                      : 'bg-emerald-500 animate-pulse'
                  }`} />
                  <h3 className="font-serif text-xl sm:text-2xl font-bold text-[#162E25]">
                    {t('liveQueueStatus')}
                  </h3>
                </div>
                <p className="text-xs text-stone-500 mt-1">
                  Synchronized live status from our Navrangpura floor.
                </p>
              </div>

              <div className="flex items-center space-x-2">
                <span className={`text-xs font-bold px-3.5 py-1 rounded-full ${
                  !settings.isQueueOpen
                    ? 'bg-rose-50 text-rose-700 border border-rose-200'
                    : isAllOnBreak
                    ? 'bg-slate-100 text-slate-700'
                    : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                }`}>
                  {!settings.isQueueOpen ? t('queuePaused') : isAllOnBreak ? 'Stylists on Break' : t('queueOpen')}
                </span>
              </div>
            </div>

            {/* Zero Barber Break Notice */}
            {isAllOnBreak && (
              <div className="my-4 p-3.5 bg-slate-50 border border-slate-200 rounded-2xl flex items-center space-x-2 text-slate-700 text-xs">
                <Coffee className="w-4 h-4 text-slate-500 shrink-0" />
                <span>{t('stylistsOnBreakNotice')}</span>
              </div>
            )}

            {/* 3 Metrics Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 py-6 text-center">
              <div className="p-4 bg-[#FBF9F5] rounded-2xl border border-stone-100">
                <Users className="w-5 h-5 mx-auto text-[#162E25] mb-1.5" />
                <p className="font-serif text-3xl font-bold text-[#162E25]">
                  {waitingCount}
                </p>
                <p className="text-xs text-stone-500 font-medium mt-0.5">
                  {t('clientsWaiting')}
                </p>
              </div>

              <div className="p-4 bg-[#FBF9F5] rounded-2xl border border-stone-100">
                <Clock className="w-5 h-5 mx-auto text-[#C5A880] mb-1.5" />
                <p className="font-serif text-3xl font-bold text-[#162E25]">
                  ~{isAllOnBreak ? '--' : estWaitMinutes}
                </p>
                <p className="text-xs text-stone-500 font-medium mt-0.5">
                  {t('minsUnit')} {t('estWaitTime')}
                </p>
              </div>

              <div className="p-4 bg-[#FBF9F5] rounded-2xl border border-stone-100">
                <Scissors className="w-5 h-5 mx-auto text-emerald-700 mb-1.5" />
                <p className="font-serif text-3xl font-bold text-[#162E25]">
                  {activeBarberCount}
                </p>
                <p className="text-xs text-stone-500 font-medium mt-0.5">
                  {t('activeStylists')}
                </p>
              </div>
            </div>

            {/* Action Row */}
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-4">
              <Link
                to="/join"
                className={`w-full sm:w-auto flex-1 bg-[#162E25] hover:bg-[#0F221B] text-[#C5A880] font-serif font-bold text-sm tracking-wider uppercase py-3.5 px-6 rounded-full shadow-md text-center transition-all ${
                  !settings.isQueueOpen ? 'opacity-50 pointer-events-none' : ''
                }`}
              >
                {t('joinQueueNow')} &rarr;
              </Link>

              {/* Spot Lookup */}
              <form onSubmit={handleTrackPhone} className="w-full sm:w-auto flex gap-2">
                <input
                  type="tel"
                  value={lookupPhone}
                  onChange={e => setLookupPhone(e.target.value)}
                  placeholder={t('phonePlaceholder')}
                  className="bg-[#FBF9F5] border border-stone-200 rounded-full px-4 py-2.5 text-xs text-[#1C1917] focus:ring-1 focus:ring-[#162E25] outline-none w-56 sm:w-64"
                />
                <button
                  type="submit"
                  className="bg-[#C5A880] hover:bg-[#B89758] text-[#162E25] text-xs font-bold px-4 py-2.5 rounded-full shrink-0 shadow-sm"
                >
                  {t('checkStatusBtn')}
                </button>
              </form>
            </div>

            {lookupError && (
              <p className="text-rose-600 text-xs mt-3 flex items-center justify-center">
                <AlertCircle className="w-3.5 h-3.5 mr-1 shrink-0" />
                {lookupError}
              </p>
            )}

          </div>

        </div>
      </section>

      {/* =========================================================================
          SECTION 4 — SERVICE OFFERINGS (IMAGE GRID FROM VIDEO REFERENCE)
          ========================================================================= */}
      <section id="services" className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 scroll-mt-20">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto space-y-3 mb-16">
          <span className="text-xs font-serif font-bold tracking-[0.25em] uppercase text-[#A88B65]">
            {t('serviceOfferingsSubtitle')}
          </span>
          <h2 className="font-serif text-3xl sm:text-5xl font-bold tracking-tight text-[#162E25]">
            {t('serviceOfferingsTitle')}
          </h2>
          <p className="text-stone-600 text-sm font-light">
            Each ritual begins with an in-depth consultation tailored to your facial architecture, lifestyle, and hair texture.
          </p>
        </div>

        {/* 3-Column x 2-Row Photographic Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {serviceCategories.map((cat) => (
            <div
              key={cat.id}
              className="group relative rounded-3xl overflow-hidden aspect-[4/5] bg-stone-900 shadow-elevated cursor-pointer"
              onClick={() => navigate('/join')}
            >
              {/* Background Photo with Hover Scale */}
              <img
                src={cat.image}
                alt={cat.title}
                className="w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-108 group-hover:brightness-95"
              />

              {/* Gradient Scrim */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-transparent transition-opacity duration-300" />

              {/* Category Tag */}
              <div className="absolute top-5 left-5">
                <span className="text-[10px] font-mono tracking-[0.2em] uppercase text-[#C5A880] bg-black/40 backdrop-blur-md px-3 py-1 rounded-full border border-[#C5A880]/30">
                  {cat.tag}
                </span>
              </div>

              {/* Content Overlay */}
              <div className="absolute bottom-6 left-6 right-6 space-y-2">
                <h3 className="font-serif text-2xl font-bold text-white tracking-wide group-hover:text-[#C5A880] transition-colors">
                  {cat.title}
                </h3>
                <p className="text-xs text-stone-300 line-clamp-2 font-light leading-relaxed">
                  {cat.desc}
                </p>
                <div className="pt-2 flex items-center space-x-1.5 text-xs font-serif font-semibold text-[#C5A880] group-hover:translate-x-1 transition-transform">
                  <span>Reserve Treatment</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </div>
              </div>
            </div>
          ))}
        </div>

      </section>

      {/* =========================================================================
          SECTION 5 — FEATURED STYLISTS (UNISEX TEAM)
          ========================================================================= */}
      <section id="stylists" className="py-24 bg-[#F5F2EB] border-t border-[#E7E2D8] scroll-mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-2xl mx-auto space-y-3 mb-16">
            <span className="text-xs font-serif font-bold tracking-[0.25em] uppercase text-[#A88B65]">
              CRAFTSMANSHIP &amp; PASSION
            </span>
            <h2 className="font-serif text-3xl sm:text-5xl font-bold tracking-tight text-[#162E25]">
              {t('todayStylists')}
            </h2>
            <p className="text-stone-600 text-sm font-light">
              Meet our team of master stylists, creative colorists, and wellness aestheticians.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {barbers.map((stylist) => (
              <div
                key={stylist.id}
                className="bg-white rounded-3xl border border-[#E7E2D8] overflow-hidden shadow-sm hover:shadow-elevated transition-all flex flex-col justify-between group"
              >
                <div>
                  {/* Portrait Photo */}
                  <div className="relative aspect-[3/4] overflow-hidden bg-stone-100">
                    <img
                      src={stylist.avatar}
                      alt={stylist.name}
                      className="w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-md px-2.5 py-1 rounded-full text-[10px] font-bold text-[#162E25] flex items-center space-x-1 shadow-sm">
                      <Star className="w-3 h-3 fill-amber-500 text-amber-500" />
                      <span>{stylist.rating}</span>
                    </div>

                    <div className="absolute bottom-3 left-3 bg-[#162E25]/80 backdrop-blur-md px-2.5 py-1 rounded-full text-[10px] font-mono text-[#C5A880]">
                      Station #{stylist.chairNumber}
                    </div>
                  </div>

                  {/* Details */}
                  <div className="p-5 space-y-2">
                    <h3 className="font-serif text-xl font-bold text-[#162E25]">
                      {stylist.name}
                    </h3>
                    <p className="text-xs text-[#A88B65] font-medium">
                      {stylist.title}
                    </p>
                    <div className="pt-2 flex flex-wrap gap-1 text-[11px] text-stone-600">
                      {stylist.specialties.map((spec, i) => (
                        <span key={i} className="bg-[#F5F2EB] px-2 py-0.5 rounded-full border border-stone-200">
                          {spec}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Footer Link */}
                <div className="p-5 pt-0">
                  <div className="pt-3 border-t border-stone-100 flex items-center justify-between">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      stylist.status === 'AVAILABLE'
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        : stylist.status === 'BUSY'
                        ? 'bg-amber-50 text-amber-700 border border-amber-200'
                        : 'bg-slate-100 text-slate-600 border border-slate-200'
                    }`}>
                      {stylist.status}
                    </span>

                    <Link
                      to={`/barber/${stylist.slug}`}
                      className="text-xs font-semibold text-[#162E25] hover:text-[#C5A880] flex items-center space-x-1"
                    >
                      <span>Workstation</span>
                      <ArrowRight className="w-3 h-3" />
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* =========================================================================
          SECTION 6 — FULL-WIDTH SALON EXPERIENCE
          ========================================================================= */}
      <section id="salon-experience" className="relative py-32 bg-[#0F221B] overflow-hidden scroll-mt-20">
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1562322140-8baeececf3df?w=1920&auto=format&fit=crop&q=85"
            alt="Aurelle Studio Atmosphere"
            className="w-full h-full object-cover object-center"
          />
          <div className="absolute inset-0 bg-[#0F221B]/90 backdrop-blur-[2px]" />
        </div>

        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6 text-white">
          <span className="text-xs font-serif font-bold tracking-[0.3em] uppercase text-[#C5A880]">
            TIMELESS COMFORT
          </span>
          <h2 className="font-serif text-3xl sm:text-6xl font-bold tracking-tight text-[#FBF9F5]">
            {t('experienceHeadline')}
          </h2>
          <p className="text-stone-300 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed font-light">
            {t('experienceDescription')}
          </p>
          <div className="pt-4">
            <Link
              to="/join"
              className="inline-flex items-center space-x-2 bg-[#C5A880] hover:bg-[#D4AF37] text-[#162E25] font-serif font-bold text-sm tracking-widest uppercase py-4 px-8 rounded-full shadow-2xl transition-all"
            >
              <span>{t('joinQueueNow')}</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 7 — WHY AURELLE
          ========================================================================= */}
      <section className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center max-w-2xl mx-auto space-y-3 mb-16">
          <span className="text-xs font-serif font-bold tracking-[0.25em] uppercase text-[#A88B65]">
            {t('whyAurelleSubtitle')}
          </span>
          <h2 className="font-serif text-3xl sm:text-5xl font-bold tracking-tight text-[#162E25]">
            {t('whyAurelleTitle')}
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          
          <div className="p-6 bg-white rounded-3xl border border-[#E7E2D8] shadow-sm space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-[#162E25] text-[#C5A880] flex items-center justify-center font-serif font-bold text-xl">
              01
            </div>
            <h3 className="font-serif text-lg font-bold text-[#162E25]">
              {t('why1Title')}
            </h3>
            <p className="text-xs text-stone-600 leading-relaxed font-light">
              {t('why1Desc')}
            </p>
          </div>

          <div className="p-6 bg-white rounded-3xl border border-[#E7E2D8] shadow-sm space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-[#162E25] text-[#C5A880] flex items-center justify-center font-serif font-bold text-xl">
              02
            </div>
            <h3 className="font-serif text-lg font-bold text-[#162E25]">
              {t('why2Title')}
            </h3>
            <p className="text-xs text-stone-600 leading-relaxed font-light">
              {t('why2Desc')}
            </p>
          </div>

          <div className="p-6 bg-white rounded-3xl border border-[#E7E2D8] shadow-sm space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-[#162E25] text-[#C5A880] flex items-center justify-center font-serif font-bold text-xl">
              03
            </div>
            <h3 className="font-serif text-lg font-bold text-[#162E25]">
              {t('why3Title')}
            </h3>
            <p className="text-xs text-stone-600 leading-relaxed font-light">
              {t('why3Desc')}
            </p>
          </div>

          <div className="p-6 bg-white rounded-3xl border border-[#E7E2D8] shadow-sm space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-[#162E25] text-[#C5A880] flex items-center justify-center font-serif font-bold text-xl">
              04
            </div>
            <h3 className="font-serif text-lg font-bold text-[#162E25]">
              {t('why4Title')}
            </h3>
            <p className="text-xs text-stone-600 leading-relaxed font-light">
              {t('why4Desc')}
            </p>
          </div>

        </div>

      </section>

      {/* =========================================================================
          SECTION 8 — VISIT OUR SALON
          ========================================================================= */}
      <section id="visit" className="py-20 bg-[#F5F2EB] border-t border-[#E7E2D8] scroll-mt-20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="bg-white rounded-3xl border border-[#E7E2D8] p-8 sm:p-12 shadow-elevated grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            
            <div className="space-y-4">
              <span className="text-xs font-serif font-bold tracking-[0.25em] uppercase text-[#A88B65]">
                {t('visitSubtitle')}
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#162E25]">
                {t('visitTitle')}
              </h2>
              <div className="space-y-3 text-stone-600 text-xs sm:text-sm pt-2">
                <div className="flex items-start space-x-3">
                  <MapPin className="w-5 h-5 text-[#C5A880] shrink-0 mt-0.5" />
                  <p className="whitespace-pre-line leading-relaxed">
                    {t('sanctuaryAddress')}
                  </p>
                </div>
                <div className="flex items-center space-x-3 pt-1">
                  <Clock className="w-5 h-5 text-[#C5A880] shrink-0" />
                  <p>{t('salonHours')}</p>
                </div>
                <div className="flex items-center space-x-3 pt-1">
                  <Phone className="w-5 h-5 text-[#C5A880] shrink-0" />
                  <p>{t('salonPhone')}</p>
                </div>
              </div>

              <div className="pt-4 flex flex-wrap gap-3">
                <a
                  href="https://maps.google.com/?q=Navrangpura,Ahmedabad"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-[#162E25] hover:bg-[#0F221B] text-[#C5A880] text-xs font-bold py-3 px-6 rounded-full flex items-center space-x-2 transition-all shadow-sm"
                >
                  <Compass className="w-4 h-4" />
                  <span>{t('getDirections')}</span>
                </a>

                <a
                  href="tel:+917926304455"
                  className="border border-[#162E25] text-[#162E25] hover:bg-[#162E25]/5 text-xs font-semibold py-3 px-6 rounded-full transition-all"
                >
                  {t('callReception')}
                </a>
              </div>
            </div>

            {/* Studio Map Graphic Card */}
            <div className="rounded-2xl overflow-hidden border border-stone-200 aspect-[4/3] bg-stone-100 relative group">
              <img
                src="https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=800&auto=format&fit=crop&q=80"
                alt="Navrangpura Studio Map"
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-[#162E25]/40 backdrop-blur-[1px] flex flex-col items-center justify-center text-white text-center p-4">
                <MapPin className="w-8 h-8 text-[#C5A880] mb-2 animate-bounce" />
                <p className="font-serif font-bold text-lg">AURELLE Flagship</p>
                <p className="text-xs text-stone-200">Navrangpura, Ahmedabad</p>
              </div>
            </div>

          </div>

        </div>
      </section>

    </div>
  );
};
