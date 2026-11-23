import React from 'react';
import { Barber, Token } from '../../types/queue';
import { useLanguage } from '../../context/LanguageContext';
import { Bell, Clock, Coffee, Scissors, Check } from 'lucide-react';

interface ChairDisplayCardProps {
  barber: Barber;
  activeToken: Token | undefined;
  isCallingThisChair: boolean;
}

export const ChairDisplayCard: React.FC<ChairDisplayCardProps> = ({
  barber,
  activeToken,
  isCallingThisChair,
}) => {
  const { t } = useLanguage();

  const isCalling = activeToken && activeToken.status === 'CALLED';
  const isInService = activeToken && activeToken.status === 'IN_SERVICE';
  const isAvailable = barber.status === 'AVAILABLE' && !activeToken;
  const isOnBreak = barber.status === 'ON_BREAK';

  return (
    <div
      className={`relative p-4 sm:p-5 rounded-2xl transition-all duration-500 flex flex-col justify-between overflow-hidden ${
        isCallingThisChair || isCalling
          ? 'bg-[#162E25] border-3 border-[#C5A880] shadow-2xl scale-[1.02] animate-luxury-glow'
          : isInService
          ? 'bg-[#162E25]/90 border border-[#2D5240] shadow-lg'
          : isOnBreak
          ? 'bg-stone-900/60 border border-stone-800 opacity-60'
          : 'bg-[#162E25]/70 border border-[#2D5240]'
      }`}
    >
      {/* Top Banner */}
      <div>
        <div className="flex items-center justify-between pb-3 border-b border-[#2D5240]/80">
          <div className="flex items-center space-x-2">
            <span className="font-serif text-base sm:text-lg font-bold text-[#C5A880]">
              CHAIR {barber.chairNumber}
            </span>
          </div>

          <span className={`text-[11px] font-mono font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider ${
            isCalling
              ? 'bg-[#C5A880] text-[#162E25] animate-pulse font-bold'
              : isInService
              ? 'bg-amber-600/30 text-amber-300 border border-amber-500/40'
              : isOnBreak
              ? 'bg-stone-800 text-stone-400'
              : 'bg-emerald-950/60 text-emerald-400 border border-emerald-500/40'
          }`}>
            {isCalling ? '🔔 CALLED' : isInService ? 'IN CHAIR' : isOnBreak ? 'ON BREAK' : 'READY'}
          </span>
        </div>

        {/* Barber Info */}
        <div className="flex items-center space-x-3 my-3">
          <img
            src={barber.avatar}
            alt={barber.name}
            className="w-11 h-11 sm:w-12 sm:h-12 rounded-full object-cover border-2 border-[#C5A880]"
          />
          <div className="min-w-0">
            <h3 className="font-serif text-base sm:text-lg font-bold text-[#FBF9F5] truncate">
              {barber.name}
            </h3>
            <p className="text-[11px] text-stone-400 font-medium truncate">
              {barber.title}
            </p>
          </div>
        </div>

        {/* Dynamic Chair State Visual */}
        <div className="mt-3 pt-3 border-t border-[#2D5240]/60 min-h-[105px] sm:min-h-[120px] flex flex-col justify-center">
          {isCalling && activeToken ? (
            <div className="text-center py-1 space-y-1">
              <span className="text-[10px] uppercase tracking-widest text-[#C5A880] font-semibold">
                NOW CALLING / હવે પધારો
              </span>
              <p className="font-mono text-4xl sm:text-5xl font-extrabold text-[#C5A880] tracking-wider animate-bounce">
                {activeToken.tokenNumber}
              </p>
              <p className="font-serif text-xl sm:text-2xl font-bold text-white truncate">
                {activeToken.customerName}
              </p>
            </div>
          ) : isInService && activeToken ? (
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-[11px] text-stone-400">
                <span>ACTIVE TOKEN:</span>
                <span>TARGET: {activeToken.totalDurationMinutes}m</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="font-mono text-3xl sm:text-4xl font-bold text-[#C5A880]">
                  {activeToken.tokenNumber}
                </span>
                <span className="font-serif text-lg font-semibold text-stone-200 truncate">
                  {activeToken.customerName}
                </span>
              </div>
              <p className="text-[11px] text-stone-400 flex items-center pt-0.5">
                <Clock className="w-3 h-3 mr-1 text-[#C5A880]" />
                <span>Service In Progress</span>
              </p>
            </div>
          ) : isAvailable ? (
            <div className="text-center py-2 space-y-1">
              <Scissors className="w-6 h-6 mx-auto text-emerald-400/80 mb-1" />
              <p className="font-serif text-lg font-bold text-emerald-400">
                {t('readyForGuest')}
              </p>
              <p className="text-xs text-stone-400">
                Next matching token will be called here
              </p>
            </div>
          ) : (
            <div className="text-center py-4 space-y-1 text-stone-500">
              <Coffee className="w-8 h-8 mx-auto text-stone-600 mb-2" />
              <p className="font-medium text-stone-400 text-sm">
                Stylist on scheduled intermission
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Footer Pill */}
      <div className="pt-3 border-t border-[#2D5240]/40 flex items-center justify-between text-[11px] text-stone-400">
        <span>Station #{barber.chairNumber}</span>
        <span className="font-mono text-[#C5A880]">AURELLE Luxury Studio</span>
      </div>
    </div>
  );
};
