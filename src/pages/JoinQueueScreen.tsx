import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useQueueStore } from '../store/useQueueStore';
import { useLanguage } from '../context/LanguageContext';
import { ServiceSelector } from '../components/customer/ServiceSelector';
import { BarberPreferenceSelector } from '../components/customer/BarberPreferenceSelector';
import { 
  ArrowLeft, 
  Sparkles, 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  ShieldCheck, 
  IndianRupee 
} from 'lucide-react';
import { validatePhone, checkDuplicateActivePhone } from '../utils/guards';

export const JoinQueueScreen: React.FC = () => {
  const { services, barbers, tokens, settings, joinQueue } = useQueueStore();
  const { t } = useLanguage();
  const navigate = useNavigate();

  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [selectedServiceIds, setSelectedServiceIds] = useState<string[]>(['srv-1']);
  const [preferredBarberId, setPreferredBarberId] = useState('ANY');
  
  const [errorAlert, setErrorAlert] = useState<{ message: string; existingTokenId?: string } | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Check 30-min auto cutoff rule
  const isCutoffActive = () => {
    if (!settings.isQueueOpen) return true;
    if (!settings.autoCutoff30m) return false;

    // Check if remaining queue duration approaches closing
    const [closeH, closeM] = settings.salonClosingTime.split(':').map(Number);
    const now = new Date();
    const closeDate = new Date();
    closeDate.setHours(closeH, closeM, 0, 0);

    const diffMins = (closeDate.getTime() - now.getTime()) / 60000;
    return diffMins <= 30;
  };

  const cutoffBlocked = isCutoffActive();

  const handleToggleService = (serviceId: string) => {
    setSelectedServiceIds(prev =>
      prev.includes(serviceId)
        ? prev.filter(id => id !== serviceId)
        : prev.length < settings.maxServicesPerClient ? [...prev, serviceId] : prev
    );
  };

  // Live calculation of duration and total amount
  const selectedServices = services.filter(s => selectedServiceIds.includes(s.id));
  const totalDuration = selectedServices.reduce((sum, s) => sum + s.durationMinutes, 0);
  const totalPrice = selectedServices.reduce((sum, s) => sum + s.priceINR, 0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorAlert(null);

    if (!customerName.trim()) {
      setErrorAlert({ message: t('nameRequired') });
      return;
    }

    const { valid } = validatePhone(customerPhone);
    if (!valid) {
      setErrorAlert({ message: t('phoneInvalid') });
      return;
    }

    if (selectedServiceIds.length === 0) {
      setErrorAlert({ message: t('serviceRequired') });
      return;
    }

    // Duplicate Phone Guard
    const duplicate = checkDuplicateActivePhone(customerPhone, tokens);
    if (duplicate) {
      setErrorAlert({
        message: t('duplicatePhoneError') + ` (Token ${duplicate.tokenNumber})`,
        existingTokenId: duplicate.id,
      });
      return;
    }

    setIsSubmitting(true);

    const result = joinQueue({
      customerName: customerName.trim(),
      customerPhone,
      serviceIds: selectedServiceIds,
      preferredBarberId,
    });

    if (result.success && result.token) {
      // Save token to localStorage for easy restoration
      try {
        localStorage.setItem('my_active_token_id', result.token.id);
      } catch (err) {}

      navigate(`/status/${result.token.id}`);
    } else {
      setErrorAlert({
        message: result.error || 'Failed to generate token. Please try again.',
        existingTokenId: result.existingTokenId,
      });
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      {/* Back button */}
      <div className="mb-6">
        <Link
          to="/"
          className="inline-flex items-center text-xs font-semibold text-stone-600 hover:text-[#162E25]"
        >
          <ArrowLeft className="w-4 h-4 mr-1.5" />
          <span>Back to Salon Home</span>
        </Link>
      </div>

      {/* Main Container Card */}
      <div className="bg-white rounded-3xl border border-[#E7E2D8] p-6 sm:p-8 shadow-elevated">
        
        {/* Header */}
        <div className="text-center pb-6 border-b border-stone-100">
          <div className="w-10 h-10 mx-auto rounded-full bg-[#162E25] text-[#C5A880] flex items-center justify-center mb-3">
            <Sparkles className="w-5 h-5" />
          </div>
          <h1 className="font-serif text-3xl font-bold text-[#162E25]">
            {t('joinQueue')}
          </h1>
          <p className="text-xs text-stone-500 mt-1 max-w-sm mx-auto">
            Reserve your chair spot in our live salon queue. Relax remotely until your turn is called.
          </p>
        </div>

        {/* Closing Cutoff Alert */}
        {cutoffBlocked && (
          <div className="my-6 p-4 bg-amber-50 border border-amber-200 rounded-2xl flex items-center space-x-3 text-amber-800 text-xs">
            <AlertCircle className="w-5 h-5 text-amber-600 shrink-0" />
            <div>
              <p className="font-bold">Queue Registration Paused</p>
              <p className="mt-0.5">
                Online registration has paused for today to guarantee service completion prior to salon closing time ({settings.salonClosingTime}). Please visit reception for walk-in availability.
              </p>
            </div>
          </div>
        )}

        {/* Error Alert with View Spot action */}
        {errorAlert && (
          <div className="my-6 p-4 bg-rose-50 border border-rose-200 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-rose-800 text-xs">
            <div className="flex items-center space-x-2">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
              <span className="font-medium">{errorAlert.message}</span>
            </div>
            {errorAlert.existingTokenId && (
              <Link
                to={`/status/${errorAlert.existingTokenId}`}
                className="bg-rose-700 text-white font-bold px-3 py-1 rounded-full text-center hover:bg-rose-800"
              >
                {t('viewExistingToken')} &rarr;
              </Link>
            )}
          </div>
        )}

        {/* Registration Form */}
        <form onSubmit={handleSubmit} className="space-y-8 pt-6">
          
          {/* Step 1: Personal Details */}
          <div className="space-y-4">
            <h3 className="font-serif text-lg font-bold text-[#162E25]">
              {t('step1Title')}
            </h3>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-[#1C1917] mb-1">
                  {t('fullNameLabel')}
                </label>
                <input
                  type="text"
                  value={customerName}
                  onChange={e => setCustomerName(e.target.value)}
                  placeholder={t('namePlaceholder')}
                  className="w-full bg-[#FBF9F5] border border-stone-300 rounded-xl px-4 py-3 text-sm text-[#1C1917] focus:ring-2 focus:ring-[#162E25] outline-none"
                  disabled={cutoffBlocked}
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#1C1917] mb-1">
                  {t('phoneLabel')}
                </label>
                <input
                  type="tel"
                  value={customerPhone}
                  onChange={e => setCustomerPhone(e.target.value)}
                  placeholder="9876543210"
                  className="w-full bg-[#FBF9F5] border border-stone-300 rounded-xl px-4 py-3 text-sm text-[#1C1917] focus:ring-2 focus:ring-[#162E25] outline-none"
                  disabled={cutoffBlocked}
                  required
                />
                <p className="text-[11px] text-stone-500 mt-1">
                  {t('phoneHint')}
                </p>
              </div>
            </div>
          </div>

          {/* Step 2: Service Selection */}
          <div className="pt-2">
            <ServiceSelector
              services={services}
              selectedServiceIds={selectedServiceIds}
              onToggleService={handleToggleService}
              maxAllowed={settings.maxServicesPerClient}
            />
          </div>

          {/* Step 3: Barber Preference */}
          <div className="pt-2">
            <BarberPreferenceSelector
              barbers={barbers}
              selectedBarberId={preferredBarberId}
              onSelectBarber={setPreferredBarberId}
            />
          </div>

          {/* Live Order Summary Box */}
          <div className="p-4 bg-[#F5F2EB] rounded-2xl border border-stone-200 space-y-2">
            <div className="flex items-center justify-between text-xs text-stone-600">
              <span className="flex items-center">
                <Clock className="w-3.5 h-3.5 mr-1 text-[#C5A880]" />
                {t('totalDuration')}:
              </span>
              <span className="font-semibold text-[#1C1917]">
                {totalDuration} {t('minsUnit')}
              </span>
            </div>

            <div className="flex items-center justify-between text-xs text-stone-600 pt-1 border-t border-stone-200">
              <span>{t('totalPrice')}:</span>
              <span className="font-serif text-lg font-bold text-[#162E25]">
                ₹{totalPrice}
              </span>
            </div>
            <p className="text-[10px] text-stone-500 text-right">
              Pay at counter after service completion.
            </p>
          </div>

          {/* Confirm Button */}
          <button
            type="submit"
            disabled={cutoffBlocked || isSubmitting}
            className={`w-full py-4 px-6 rounded-full font-serif font-bold text-lg transition-all shadow-md flex items-center justify-center space-x-2 ${
              cutoffBlocked || isSubmitting
                ? 'bg-stone-300 text-stone-500 cursor-not-allowed'
                : 'bg-[#162E25] hover:bg-[#0F221B] text-[#C5A880] hover:scale-[1.01] active:scale-[0.99]'
            }`}
          >
            <span>{isSubmitting ? 'Reserving Spot...' : t('confirmJoinBtn')}</span>
          </button>

        </form>
      </div>
    </div>
  );
};
