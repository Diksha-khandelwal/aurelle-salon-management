import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQueueStore } from '../store/useQueueStore';
import { useLanguage } from '../context/LanguageContext';
import { StopwatchTimer } from '../components/barber/StopwatchTimer';
import { 
  Scissors, 
  PhoneCall, 
  Play, 
  CheckCircle2, 
  Coffee, 
  Clock, 
  AlertCircle, 
  User,
  Star 
} from 'lucide-react';

export const BarberWorkstationScreen: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const { 
    barbers, 
    tokens, 
    services, 
    callNext, 
    startService, 
    completeService, 
    setBarberStatus 
  } = useQueueStore();
  const { language, t } = useLanguage();

  // Find barber matching slug
  const barber = barbers.find(b => b.slug === slug) || barbers[0];
  const activeToken = tokens.find(t => t.id === barber?.currentTokenId);

  const isCalling = activeToken && activeToken.status === 'CALLED';
  const isInService = activeToken && activeToken.status === 'IN_SERVICE';
  const isAvailable = barber.status === 'AVAILABLE' && !activeToken;
  const isOnBreak = barber.status === 'ON_BREAK';

  // Next eligible customers in FIFO queue matching this barber or 'ANY'
  const upcomingQueue = tokens
    .filter(t => t.status === 'WAITING' && (t.preferredBarberId === 'ANY' || t.preferredBarberId === barber.id))
    .sort((a, b) => new Date(a.joinTime).getTime() - new Date(b.joinTime).getTime())
    .slice(0, 3);

  const activeServices = services.filter(s => activeToken?.serviceIds.includes(s.id));

  return (
    <div className="max-w-2xl mx-auto px-4 py-6 space-y-6">
      
      {/* Workstation Header */}
      <div className="bg-white rounded-3xl border border-[#E7E2D8] p-6 shadow-sm flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <img
            src={barber.avatar}
            alt={barber.name}
            className="w-16 h-16 rounded-full object-cover border-2 border-[#C5A880]"
          />
          <div>
            <div className="flex items-center space-x-2">
              <span className="font-mono text-xs font-bold text-[#C5A880] uppercase tracking-wider">
                Chair {barber.chairNumber}
              </span>
              <span className="text-stone-300">•</span>
              <span className="text-xs text-stone-500 font-medium">
                {barber.title}
              </span>
            </div>
            <h1 className="font-serif text-2xl font-bold text-[#162E25]">
              {barber.name}
            </h1>
          </div>
        </div>

        {/* Break Toggle Switch */}
        <button
          type="button"
          onClick={() => {
            const next = isOnBreak ? 'AVAILABLE' : 'ON_BREAK';
            setBarberStatus(barber.id, next);
          }}
          className={`px-3.5 py-1.5 rounded-full text-xs font-bold flex items-center space-x-1.5 border transition-all ${
            isOnBreak
              ? 'bg-slate-200 text-slate-800 border-slate-300'
              : 'bg-stone-100 text-stone-600 hover:bg-stone-200 border-stone-200'
          }`}
        >
          <Coffee className="w-3.5 h-3.5" />
          <span>{isOnBreak ? t('endBreak') : t('takeBreak')}</span>
        </button>
      </div>

      {/* Station Selector Bar (Quick Switch between barbers) */}
      <div className="flex items-center space-x-2 overflow-x-auto pb-1 text-xs">
        <span className="text-stone-400 font-medium shrink-0">Switch Station:</span>
        {barbers.map(b => (
          <Link
            key={b.id}
            to={`/barber/${b.slug}`}
            className={`px-3 py-1 rounded-full font-semibold shrink-0 transition-colors ${
              b.slug === barber.slug
                ? 'bg-[#162E25] text-[#C5A880]'
                : 'bg-white border border-stone-200 text-stone-600 hover:bg-stone-50'
            }`}
          >
            Chair {b.chairNumber} ({b.name.split(' ')[0]})
          </Link>
        ))}
      </div>

      {/* Main Chair Status & Action Center */}
      <div className="bg-white rounded-3xl border border-[#E7E2D8] p-6 sm:p-8 shadow-elevated space-y-6">
        
        {/* When Vacant */}
        {isAvailable && (
          <div className="text-center py-8 space-y-4">
            <div className="w-16 h-16 mx-auto rounded-full bg-emerald-50 text-emerald-700 flex items-center justify-center">
              <Scissors className="w-8 h-8" />
            </div>
            <div>
              <h2 className="font-serif text-2xl font-bold text-[#162E25]">
                {t('stationVacant')}
              </h2>
              <p className="text-xs text-stone-500 mt-1">
                Dispatch next eligible client via smart FIFO queue query.
              </p>
            </div>

            <button
              type="button"
              onClick={() => callNext(barber.id)}
              className="w-full bg-[#C5A880] hover:bg-[#B89758] text-[#162E25] font-serif font-bold text-lg py-4 px-6 rounded-full shadow-md transition-all flex items-center justify-center space-x-2"
            >
              <PhoneCall className="w-5 h-5" />
              <span>{t('callNextBtn')} (Smart FIFO)</span>
            </button>
          </div>
        )}

        {/* When Client Called */}
        {isCalling && activeToken && (
          <div className="space-y-6 text-center">
            <div className="p-4 bg-orange-50 border border-orange-200 rounded-2xl">
              <span className="text-xs font-bold uppercase tracking-wider text-orange-800">
                Calling Guest to Chair {barber.chairNumber}
              </span>
              <p className="font-mono text-5xl font-bold text-orange-700 my-2">
                {activeToken.tokenNumber}
              </p>
              <p className="font-serif text-2xl font-bold text-[#162E25]">
                {activeToken.customerName}
              </p>
              <p className="text-xs text-stone-500 mt-1">
                Services: {activeServices.map(s => language === 'gu' ? s.nameGu : s.nameEn).join(', ')}
              </p>
            </div>

            <button
              type="button"
              onClick={() => startService(barber.id)}
              className="w-full bg-[#162E25] hover:bg-[#0F221B] text-[#C5A880] font-serif font-bold text-lg py-4 px-6 rounded-full shadow-md flex items-center justify-center space-x-2"
            >
              <Play className="w-5 h-5 fill-current" />
              <span>{t('seatClientBtn')}</span>
            </button>
          </div>
        )}

        {/* When In Service (Stopwatch Active) */}
        {isInService && activeToken && (
          <div className="space-y-6">
            <div className="flex items-center justify-between pb-3 border-b border-stone-100">
              <div>
                <span className="text-xs text-stone-400 uppercase tracking-widest font-semibold">
                  {t('currentGuest')}
                </span>
                <div className="flex items-center space-x-2 mt-0.5">
                  <span className="font-mono text-xl font-bold text-[#162E25]">
                    {activeToken.tokenNumber}
                  </span>
                  <h3 className="font-serif text-xl font-bold text-[#162E25]">
                    {activeToken.customerName}
                  </h3>
                </div>
              </div>
              <span className="font-serif font-bold text-lg text-emerald-800">
                ₹{activeToken.totalPriceINR}
              </span>
            </div>

            {/* Live Stopwatch */}
            <StopwatchTimer
              startTimeISO={activeToken.serviceStartTime}
              targetMinutes={activeToken.totalDurationMinutes}
            />

            {/* Complete Service Button */}
            <button
              type="button"
              onClick={() => completeService(barber.id)}
              className="w-full bg-[#162E25] hover:bg-[#0F221B] text-[#C5A880] font-serif font-bold text-lg py-4 px-6 rounded-full shadow-md flex items-center justify-center space-x-2"
            >
              <CheckCircle2 className="w-5 h-5" />
              <span>{t('finishServiceBtn')}</span>
            </button>

            {/* Concurrency Lock notice */}
            <div className="p-3 bg-stone-50 border border-stone-200 rounded-xl text-center text-xs text-stone-500">
              {t('concurrencyLockedNotice')}
            </div>
          </div>
        )}

        {/* When On Break */}
        {isOnBreak && (
          <div className="text-center py-8 space-y-3">
            <Coffee className="w-12 h-12 mx-auto text-slate-400" />
            <h3 className="font-serif text-xl font-bold text-slate-700">
              Station is On Break
            </h3>
            <p className="text-xs text-slate-500">
              Toggle your availability switch above when you return.
            </p>
          </div>
        )}

      </div>

      {/* Upcoming Clients Preview for this Barber */}
      <div className="bg-white rounded-3xl border border-[#E7E2D8] p-5 shadow-sm space-y-3">
        <h4 className="font-serif text-sm font-bold text-[#162E25] uppercase tracking-wider">
          {t('nextUpYourQueue')}
        </h4>

        {upcomingQueue.length === 0 ? (
          <p className="text-xs text-stone-400 py-2">
            {t('noEligibleClients')}
          </p>
        ) : (
          <div className="divide-y divide-stone-100">
            {upcomingQueue.map(token => (
              <div key={token.id} className="py-2.5 flex items-center justify-between text-xs">
                <div className="flex items-center space-x-2.5">
                  <span className="font-mono font-bold text-[#162E25] bg-[#F5F2EB] px-2 py-0.5 rounded">
                    {token.tokenNumber}
                  </span>
                  <div>
                    <span className="font-semibold text-[#1C1917]">{token.customerName}</span>
                    <span className="text-stone-400 ml-2">
                      ({token.preferredBarberId === 'ANY' ? 'Any' : barber.name.split(' ')[0]})
                    </span>
                  </div>
                </div>
                <span className="text-stone-500 font-medium">
                  {token.totalDurationMinutes} mins • ₹{token.totalPriceINR}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
};
