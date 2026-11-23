import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useQueueStore } from '../store/useQueueStore';
import { useLanguage } from '../context/LanguageContext';
import { calculateEstimatedWaitTime } from '../utils/waitCalculator';
import { CallAlertModal } from '../components/customer/CallAlertModal';
import { 
  Clock, 
  User, 
  Scissors, 
  MapPin, 
  AlertTriangle, 
  CheckCircle2, 
  ArrowLeft,
  XCircle,
  Coffee,
  Sparkles
} from 'lucide-react';

export const StatusTrackerScreen: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { tokens, barbers, services, cancelToken } = useQueueStore();
  const { language, t } = useLanguage();
  const navigate = useNavigate();

  const [showCancelModal, setShowCancelModal] = useState(false);
  const [hasAcknowledgedCall, setHasAcknowledgedCall] = useState(false);

  // Find this active token
  const token = tokens.find(t => t.id === id);

  if (!token) {
    return (
      <div className="max-w-md mx-auto px-4 py-16 text-center space-y-4">
        <div className="w-16 h-16 mx-auto rounded-full bg-stone-100 flex items-center justify-center text-stone-400">
          <AlertTriangle className="w-8 h-8" />
        </div>
        <h2 className="font-serif text-2xl font-bold text-[#162E25]">
          {t('tokenNotFound')}
        </h2>
        <p className="text-xs text-stone-500 max-w-sm mx-auto">
          {t('tokenNotFoundDesc')}
        </p>
        <Link
          to="/"
          className="inline-block bg-[#162E25] text-[#C5A880] text-xs font-bold py-2.5 px-6 rounded-full mt-4"
        >
          {t('backToHome')}
        </Link>
      </div>
    );
  }

  const assignedBarber = barbers.find(b => b.id === token.assignedBarberId);
  const preferredBarber = barbers.find(b => b.id === token.preferredBarberId);
  const tokenServices = services.filter(s => token.serviceIds.includes(s.id));

  // Dynamic wait time
  const { minutes: waitMinutes, isAllOnBreak, aheadCount } = 
    calculateEstimatedWaitTime(token, tokens, barbers, services);

  // Is called state
  const isCalled = token.status === 'CALLED';

  const handleConfirmCancel = () => {
    cancelToken(token.id);
    setShowCancelModal(false);
  };

  return (
    <div className="max-w-xl mx-auto px-4 py-8 space-y-6">
      
      {/* Approach / Turn Alert Modal */}
      {isCalled && !hasAcknowledgedCall && (
        <CallAlertModal
          token={token}
          assignedBarber={assignedBarber}
          onAcknowledge={() => setHasAcknowledgedCall(true)}
        />
      )}

      {/* Top Bar */}
      <div className="flex items-center justify-between">
        <Link
          to="/"
          className="inline-flex items-center text-xs font-semibold text-stone-600 hover:text-[#162E25]"
        >
          <ArrowLeft className="w-4 h-4 mr-1" />
          <span>Salon Home</span>
        </Link>

        <span className="text-[11px] font-mono text-stone-500">
          Syncing Live Bus
        </span>
      </div>

      {/* Main Status Ticket Card */}
      <div className="bg-white rounded-3xl border border-[#E7E2D8] p-6 sm:p-8 shadow-elevated relative overflow-hidden">
        
        {/* Token Number Display */}
        <div className="text-center pb-6 border-b border-stone-100">
          <p className="text-xs uppercase tracking-widest text-[#A88B65] font-semibold">
            {t('yourToken')}
          </p>
          <div className="font-mono text-6xl font-bold tracking-wider text-[#162E25] my-2">
            {token.tokenNumber}
          </div>
          <p className="text-sm font-semibold text-[#1C1917]">
            {token.customerName}
          </p>
        </div>

        {/* Dynamic Status Banner */}
        <div className="py-6">
          {token.status === 'WAITING' && (
            <div className="space-y-4">
              <div className="p-4 bg-[#FBF9F5] rounded-2xl border border-[#E7E2D8] text-center">
                <span className="text-xs text-stone-500 uppercase tracking-wider font-semibold">
                  Queue Position
                </span>
                <p className="font-serif text-3xl font-bold text-[#162E25] mt-1">
                  {aheadCount === 0 ? (
                    <span className="text-emerald-700">Next in Line!</span>
                  ) : (
                    <span>{aheadCount} {t('aheadOfYou')}</span>
                  )}
                </p>
                <div className="flex items-center justify-center space-x-2 text-stone-600 text-xs mt-2 font-medium">
                  <Clock className="w-4 h-4 text-[#C5A880]" />
                  <span>
                    {isAllOnBreak
                      ? 'Stylists on break - Queue paused'
                      : `~${waitMinutes} ${t('minsUnit')} ${t('estWaitCountdown')}`}
                  </span>
                </div>
              </div>

              {isAllOnBreak && (
                <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-700 flex items-center space-x-2">
                  <Coffee className="w-4 h-4 text-slate-500 shrink-0" />
                  <span>{t('stylistsOnBreakNotice')}</span>
                </div>
              )}
            </div>
          )}

          {token.status === 'CALLED' && (
            <div className="p-5 bg-orange-50 border-2 border-orange-300 rounded-2xl text-center space-y-2 animate-luxury-glow">
              <span className="inline-block bg-orange-600 text-white text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                Action Required
              </span>
              <h3 className="font-serif text-2xl font-bold text-orange-950">
                {t('itsYourTurn')}
              </h3>
              <p className="text-xs text-orange-800">
                Please make your way immediately to {assignedBarber ? `Chair ${assignedBarber.chairNumber} (${assignedBarber.name})` : 'the chair'}.
              </p>
            </div>
          )}

          {token.status === 'IN_SERVICE' && (
            <div className="p-5 bg-amber-50 border border-amber-300 rounded-2xl text-center space-y-2">
              <Scissors className="w-8 h-8 mx-auto text-amber-700" />
              <h3 className="font-serif text-2xl font-bold text-amber-950">
                Currently In Service
              </h3>
              <p className="text-xs text-amber-800">
                Enjoy your grooming experience with {assignedBarber?.name || 'your stylist'}.
              </p>
            </div>
          )}

          {token.status === 'COMPLETED' && (
            <div className="p-5 bg-emerald-50 border border-emerald-300 rounded-2xl text-center space-y-2">
              <CheckCircle2 className="w-10 h-10 mx-auto text-emerald-700" />
              <h3 className="font-serif text-2xl font-bold text-emerald-950">
                Service Completed
              </h3>
              <p className="text-xs text-emerald-800">
                Thank you for visiting AURELLE Unisex Salon & Studio. We look forward to your next visit.
              </p>
            </div>
          )}

          {(token.status === 'CANCELLED' || token.status === 'NO_SHOW') && (
            <div className="p-5 bg-rose-50 border border-rose-300 rounded-2xl text-center space-y-2">
              <XCircle className="w-10 h-10 mx-auto text-rose-700" />
              <h3 className="font-serif text-2xl font-bold text-rose-950">
                Ticket Inactive ({token.status})
              </h3>
              <p className="text-xs text-rose-800">
                This token is no longer in the active queue. You may join again from the home page.
              </p>
            </div>
          )}
        </div>

        {/* Journey Stepper */}
        <div className="py-4 border-t border-b border-stone-100">
          <p className="text-[11px] font-semibold uppercase tracking-wider text-stone-400 mb-3">
            Service Stages
          </p>
          <div className="grid grid-cols-4 gap-1 text-center text-[11px]">
            <div className={`p-2 rounded-lg ${token.status ? 'bg-emerald-50 text-emerald-900 font-bold' : ''}`}>
              [✓] Joined
            </div>
            <div className={`p-2 rounded-lg ${aheadCount <= 2 && token.status === 'WAITING' ? 'bg-[#C5A880]/20 text-[#162E25] font-bold' : 'text-stone-400'}`}>
              Near Front
            </div>
            <div className={`p-2 rounded-lg ${token.status === 'CALLED' ? 'bg-orange-100 text-orange-900 font-bold' : 'text-stone-400'}`}>
              Called
            </div>
            <div className={`p-2 rounded-lg ${token.status === 'IN_SERVICE' || token.status === 'COMPLETED' ? 'bg-emerald-100 text-emerald-900 font-bold' : 'text-stone-400'}`}>
              In Chair
            </div>
          </div>
        </div>

        {/* Selected Services & Barber Details */}
        <div className="py-4 space-y-3 text-xs">
          <div>
            <span className="text-stone-500 font-medium">{t('requestedServices')}:</span>
            <div className="flex flex-wrap gap-1.5 mt-1.5">
              {tokenServices.map(s => (
                <span key={s.id} className="bg-[#F5F2EB] text-[#162E25] font-semibold px-2.5 py-1 rounded-full border border-stone-200">
                  {language === 'gu' ? s.nameGu : s.nameEn} (₹{s.priceINR})
                </span>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-between pt-2 text-stone-600">
            <span>{t('preferredStylist')}:</span>
            <span className="font-semibold text-[#162E25]">
              {preferredBarber ? preferredBarber.name : t('anyStylistOption')}
            </span>
          </div>

          <div className="flex items-center justify-between text-stone-600">
            <span>Estimated Fee:</span>
            <span className="font-serif font-bold text-base text-[#162E25]">
              ₹{token.totalPriceINR}
            </span>
          </div>
        </div>

        {/* Cancel Button (Only if WAITING or CALLED) */}
        {(token.status === 'WAITING' || token.status === 'CALLED') && (
          <div className="pt-4 border-t border-stone-100 flex justify-center">
            <button
              type="button"
              onClick={() => setShowCancelModal(true)}
              className="text-xs text-stone-500 hover:text-rose-700 underline"
            >
              {t('cancelSpotBtn')}
            </button>
          </div>
        )}

      </div>

      {/* Cancel Confirmation Modal */}
      {showCancelModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 text-center space-y-4 border border-stone-200 shadow-xl">
            <h3 className="font-serif text-xl font-bold text-[#162E25]">
              {t('cancelModalTitle')}
            </h3>
            <p className="text-xs text-stone-600 leading-relaxed">
              {t('cancelModalText')}
            </p>
            <div className="flex items-center justify-center space-x-3 pt-2">
              <button
                type="button"
                onClick={() => setShowCancelModal(false)}
                className="px-4 py-2 rounded-full border border-stone-300 text-xs font-semibold text-stone-700"
              >
                {t('keepSpot')}
              </button>
              <button
                type="button"
                onClick={handleConfirmCancel}
                className="px-4 py-2 rounded-full bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold shadow-sm"
              >
                {t('confirmCancel')}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
