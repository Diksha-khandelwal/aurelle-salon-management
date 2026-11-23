import React, { useEffect } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { Barber, Token } from '../../types/queue';
import { Bell, CheckCircle2, Clock } from 'lucide-react';
import { playSalonChime } from '../../utils/audioChime';

interface CallAlertModalProps {
  token: Token;
  assignedBarber: Barber | undefined;
  onAcknowledge: () => void;
}

export const CallAlertModal: React.FC<CallAlertModalProps> = ({
  token,
  assignedBarber,
  onAcknowledge,
}) => {
  const { t } = useLanguage();

  useEffect(() => {
    // Play chime when alert mounts
    playSalonChime();
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div className="bg-[#162E25] text-[#FBF9F5] border-2 border-[#C5A880] rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl text-center relative overflow-hidden animate-scale-up">
        
        {/* Decorative Luxury Glow */}
        <div className="absolute -top-24 -left-24 w-48 h-48 bg-[#C5A880]/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -right-24 w-48 h-48 bg-[#C5A880]/20 rounded-full blur-3xl pointer-events-none" />

        {/* Pulsing Bell Icon */}
        <div className="w-20 h-20 mx-auto rounded-full bg-[#C5A880] text-[#162E25] flex items-center justify-center mb-6 shadow-lg animate-bounce">
          <Bell className="w-10 h-10 fill-current" />
        </div>

        {/* Hero Title */}
        <h2 className="font-serif text-3xl sm:text-4xl font-bold tracking-tight text-[#FBF9F5]">
          {t('itsYourTurn')}
        </h2>

        {/* Token Badge */}
        <div className="my-6 py-4 px-6 bg-[#0F221B] border border-[#C5A880]/40 rounded-2xl">
          <p className="text-xs uppercase tracking-widest text-[#C5A880] font-sans font-medium">
            {t('yourToken')}
          </p>
          <p className="text-5xl font-mono font-bold tracking-wider text-[#C5A880] mt-1">
            {token.tokenNumber}
          </p>
          <p className="text-sm font-medium text-stone-300 mt-1">
            {token.customerName}
          </p>
        </div>

        {/* Chair & Stylist Details */}
        <div className="space-y-2 mb-6">
          <p className="text-lg font-medium text-stone-200">
            {t('proceedToChair')}{' '}
            <span className="font-bold text-[#C5A880] underline decoration-[#C5A880]">
              {assignedBarber ? `Chair ${assignedBarber.chairNumber}` : 'the Lounge Front Desk'}
            </span>
          </p>
          {assignedBarber && (
            <p className="text-sm text-stone-300">
              {t('withStylist')}: <span className="font-semibold text-white">{assignedBarber.name}</span>
            </p>
          )}
        </div>

        {/* 10-Min Grace Indicator */}
        <div className="flex items-center justify-center space-x-2 text-xs text-amber-300 bg-amber-950/40 border border-amber-500/30 py-2 px-3 rounded-full mb-6">
          <Clock className="w-3.5 h-3.5" />
          <span>{t('gracePeriodNotice')}</span>
        </div>

        {/* Acknowledge Button */}
        <button
          type="button"
          onClick={onAcknowledge}
          className="w-full bg-[#C5A880] text-[#162E25] hover:bg-[#B89758] active:scale-[0.98] transition-all font-serif font-bold text-lg py-4 px-6 rounded-full shadow-lg flex items-center justify-center space-x-2"
        >
          <CheckCircle2 className="w-5 h-5" />
          <span>{t('iAmAtChair')}</span>
        </button>

      </div>
    </div>
  );
};
