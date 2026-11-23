import React, { useState, useEffect } from 'react';
import { Barber, Token, Service } from '../../types/queue';
import { useLanguage } from '../../context/LanguageContext';
import { 
  Play, 
  CheckCircle2, 
  AlertTriangle, 
  Clock, 
  Coffee, 
  Scissors, 
  Sparkles,
  PhoneCall
} from 'lucide-react';

interface ActiveChairsColumnProps {
  barbers: Barber[];
  tokens: Token[];
  services: Service[];
  onCallNext: (barberId: string) => void;
  onStartService: (barberId: string) => void;
  onCompleteService: (barberId: string) => void;
  onMarkNoShow: (tokenId: string) => void;
  onToggleBreak: (barberId: string, currentStatus: string) => void;
}

export const ActiveChairsColumn: React.FC<ActiveChairsColumnProps> = ({
  barbers,
  tokens,
  services,
  onCallNext,
  onStartService,
  onCompleteService,
  onMarkNoShow,
  onToggleBreak,
}) => {
  const { t } = useLanguage();
  const [, setTick] = useState(0);

  // Re-render every second for real-time timers
  useEffect(() => {
    const timer = setInterval(() => setTick(t => t + 1), 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="bg-white rounded-2xl border border-[#E7E2D8] p-5 shadow-sm flex flex-col h-full">
      <div className="flex items-center justify-between pb-4 border-b border-stone-100">
        <div>
          <div className="flex items-center space-x-2">
            <h3 className="font-serif text-xl font-bold text-[#162E25]">
              {t('activeChairsHeader')}
            </h3>
            <span className="bg-[#162E25] text-[#C5A880] text-xs font-mono font-bold px-2.5 py-0.5 rounded-full">
              {barbers.length} Chairs
            </span>
          </div>
          <p className="text-xs text-stone-500 mt-0.5">
            Single-chair concurrency enforcement & real-time workstation status.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 overflow-y-auto max-h-[680px]">
        {barbers.map((barber) => {
          const activeToken = tokens.find(t => t.id === barber.currentTokenId);
          const isCalling = activeToken && activeToken.status === 'CALLED';
          const isInService = activeToken && activeToken.status === 'IN_SERVICE';
          const isAvailable = barber.status === 'AVAILABLE' && !activeToken;
          const isOnBreak = barber.status === 'ON_BREAK';

          // Elapsed timer calculation
          let elapsedFormatted = '00:00';
          let timeSinceCallSeconds = 0;

          if (isInService && activeToken.serviceStartTime) {
            const elapsedMs = Math.max(0, Date.now() - new Date(activeToken.serviceStartTime).getTime());
            const mins = Math.floor(elapsedMs / 60000);
            const secs = Math.floor((elapsedMs % 60000) / 1000);
            elapsedFormatted = `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
          }

          if (isCalling && activeToken.calledTime) {
            timeSinceCallSeconds = Math.floor((Date.now() - new Date(activeToken.calledTime).getTime()) / 1000);
          }

          return (
            <div
              key={barber.id}
              className={`p-4 rounded-xl border transition-all flex flex-col justify-between ${
                isCalling
                  ? 'border-orange-400 bg-orange-50/60 ring-2 ring-orange-300'
                  : isInService
                  ? 'border-amber-300 bg-amber-50/40'
                  : isOnBreak
                  ? 'border-slate-300 bg-slate-50 opacity-80'
                  : 'border-[#E7E2D8] bg-[#FBF9F5]'
              }`}
            >
              <div>
                {/* Station Header */}
                <div className="flex items-center justify-between pb-3 border-b border-stone-200/60">
                  <div className="flex items-center space-x-2.5">
                    <img
                      src={barber.avatar}
                      alt={barber.name}
                      className="w-10 h-10 rounded-full object-cover border border-stone-300"
                    />
                    <div>
                      <div className="flex items-center space-x-1.5">
                        <span className="font-mono text-xs font-bold text-stone-500">
                          Chair {barber.chairNumber}:
                        </span>
                        <h4 className="font-semibold text-sm text-[#1C1917]">
                          {barber.name}
                        </h4>
                      </div>
                      <p className="text-[11px] text-stone-500">
                        {barber.title}
                      </p>
                    </div>
                  </div>

                  {/* Status Tag */}
                  <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                    isCalling
                      ? 'bg-orange-500 text-white animate-pulse'
                      : isInService
                      ? 'bg-amber-600 text-white'
                      : isOnBreak
                      ? 'bg-slate-500 text-white'
                      : 'bg-emerald-600 text-white'
                  }`}>
                    {isCalling ? 'CALLING' : isInService ? 'IN CHAIR' : isOnBreak ? 'ON BREAK' : 'AVAILABLE'}
                  </span>
                </div>

                {/* Chair Content Body */}
                <div className="py-3">
                  {isCalling && activeToken && (
                    <div className="space-y-2">
                      <div className="flex items-center justify-between bg-white p-2.5 rounded-lg border border-orange-200">
                        <div>
                          <p className="font-mono text-xl font-bold text-orange-700">
                            {activeToken.tokenNumber}
                          </p>
                          <p className="text-xs font-semibold text-stone-800">
                            {activeToken.customerName}
                          </p>
                        </div>
                        <div className="text-right text-xs">
                          <span className="text-stone-500">{t('timeSinceCall')}:</span>
                          <p className="font-mono font-bold text-orange-600">
                            {Math.floor(timeSinceCallSeconds / 60)}:
                            {String(timeSinceCallSeconds % 60).padStart(2, '0')}
                          </p>
                        </div>
                      </div>

                      {/* Action buttons during CALLING */}
                      <div className="grid grid-cols-2 gap-2 pt-1">
                        <button
                          type="button"
                          onClick={() => onStartService(barber.id)}
                          className="bg-[#162E25] hover:bg-[#0F221B] text-white text-xs font-semibold py-2 px-3 rounded-lg flex items-center justify-center space-x-1 shadow-sm"
                        >
                          <Play className="w-3.5 h-3.5 fill-current" />
                          <span>{t('seatClientBtn')}</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => onMarkNoShow(activeToken.id)}
                          className="bg-rose-100 hover:bg-rose-200 text-rose-800 text-xs font-semibold py-2 px-3 rounded-lg flex items-center justify-center space-x-1 border border-rose-200"
                        >
                          <AlertTriangle className="w-3.5 h-3.5" />
                          <span>{t('markNoShowBtn')}</span>
                        </button>
                      </div>
                    </div>
                  )}

                  {isInService && activeToken && (
                    <div className="space-y-2">
                      <div className="bg-white p-2.5 rounded-lg border border-amber-200">
                        <div className="flex items-center justify-between">
                          <span className="font-mono text-lg font-bold text-[#162E25]">
                            {activeToken.tokenNumber}
                          </span>
                          <span className="text-xs font-medium text-stone-500">
                            Target: {activeToken.totalDurationMinutes}m
                          </span>
                        </div>
                        <p className="text-xs font-semibold text-stone-800">
                          {activeToken.customerName}
                        </p>
                        <div className="mt-2 flex items-center justify-between text-xs pt-1.5 border-t border-stone-100">
                          <span className="text-stone-500 flex items-center">
                            <Clock className="w-3 h-3 mr-1 text-amber-600" />
                            {t('elapsedService')}:
                          </span>
                          <span className="font-mono text-base font-bold text-amber-700">
                            {elapsedFormatted}
                          </span>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => onCompleteService(barber.id)}
                        className="w-full bg-[#162E25] hover:bg-[#0F221B] text-[#C5A880] text-xs font-bold py-2.5 px-3 rounded-lg flex items-center justify-center space-x-1.5 shadow-sm"
                      >
                        <CheckCircle2 className="w-4 h-4" />
                        <span>{t('finishServiceBtn')}</span>
                      </button>
                    </div>
                  )}

                  {isAvailable && (
                    <div className="text-center py-4 space-y-3">
                      <p className="text-xs text-stone-500 font-medium">
                        Chair is vacant and ready for next client.
                      </p>
                      <button
                        type="button"
                        onClick={() => onCallNext(barber.id)}
                        className="w-full bg-[#C5A880] hover:bg-[#B89758] text-[#162E25] text-xs font-bold py-2.5 px-4 rounded-full flex items-center justify-center space-x-1.5 shadow-sm transition-all"
                      >
                        <PhoneCall className="w-3.5 h-3.5" />
                        <span>{t('callNextBtn')}</span>
                      </button>
                    </div>
                  )}

                  {isOnBreak && (
                    <div className="text-center py-4 space-y-2 text-stone-500">
                      <Coffee className="w-6 h-6 mx-auto text-slate-400 stroke-1" />
                      <p className="text-xs font-medium">
                        Stylist is currently taking a rest break.
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Station Footer / Break Switch */}
              <div className="pt-2 border-t border-stone-200/50 flex items-center justify-between text-[11px] text-stone-500">
                <span>Specialty: {barber.specialties[0]}</span>
                <button
                  type="button"
                  onClick={() => onToggleBreak(barber.id, barber.status)}
                  className="text-stone-600 hover:text-[#162E25] underline"
                >
                  {isOnBreak ? t('endBreak') : t('takeBreak')}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
