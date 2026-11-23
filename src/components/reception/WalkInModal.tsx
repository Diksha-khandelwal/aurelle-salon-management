import React, { useState } from 'react';
import { Service, Barber } from '../../types/queue';
import { useLanguage } from '../../context/LanguageContext';
import { ServiceSelector } from '../customer/ServiceSelector';
import { BarberPreferenceSelector } from '../customer/BarberPreferenceSelector';
import { X, UserPlus, AlertCircle } from 'lucide-react';
import { checkDuplicateActivePhone, validatePhone } from '../../utils/guards';

interface WalkInModalProps {
  isOpen: boolean;
  onClose: () => void;
  services: Service[];
  barbers: Barber[];
  existingTokens: any[];
  onSubmitWalkIn: (data: {
    customerName: string;
    customerPhone: string;
    serviceIds: string[];
    preferredBarberId: string;
  }) => void;
}

export const WalkInModal: React.FC<WalkInModalProps> = ({
  isOpen,
  onClose,
  services,
  barbers,
  existingTokens,
  onSubmitWalkIn,
}) => {
  const { t } = useLanguage();
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [selectedServiceIds, setSelectedServiceIds] = useState<string[]>(['srv-1']);
  const [preferredBarberId, setPreferredBarberId] = useState('ANY');
  const [hasPrintedCard, setHasPrintedCard] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');

  if (!isOpen) return null;

  const handleToggleService = (serviceId: string) => {
    setSelectedServiceIds(prev => 
      prev.includes(serviceId)
        ? prev.filter(id => id !== serviceId)
        : prev.length < 3 ? [...prev, serviceId] : prev
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!customerName.trim()) {
      setErrorMessage(t('nameRequired'));
      return;
    }

    const { valid } = validatePhone(customerPhone);
    if (!valid) {
      setErrorMessage(t('phoneInvalid'));
      return;
    }

    const duplicate = checkDuplicateActivePhone(customerPhone, existingTokens);
    if (duplicate) {
      setErrorMessage(t('duplicatePhoneError') + ` (Token ${duplicate.tokenNumber})`);
      return;
    }

    if (selectedServiceIds.length === 0) {
      setErrorMessage(t('serviceRequired'));
      return;
    }

    onSubmitWalkIn({
      customerName: customerName.trim(),
      customerPhone,
      serviceIds: selectedServiceIds,
      preferredBarberId,
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-2xl max-w-xl w-full p-6 shadow-2xl border border-[#E7E2D8] max-h-[90vh] overflow-y-auto">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between pb-4 border-b border-stone-200">
          <div className="flex items-center space-x-2.5">
            <div className="w-9 h-9 rounded-full bg-[#162E25] text-[#C5A880] flex items-center justify-center">
              <UserPlus className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-serif text-xl font-bold text-[#162E25]">
                {t('walkInModalTitle')}
              </h3>
              <p className="text-xs text-stone-500">
                {t('walkInSubtitle')}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-stone-400 hover:text-stone-600 p-1 rounded-full"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Error Alert */}
        {errorMessage && (
          <div className="mt-4 p-3 bg-rose-50 border border-rose-200 rounded-xl flex items-center space-x-2 text-rose-700 text-xs font-medium">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5 pt-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-[#1C1917] mb-1">
                {t('fullNameLabel')}
              </label>
              <input
                type="text"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                placeholder="e.g. Ramesh Shah"
                className="w-full bg-[#FBF9F5] border border-stone-300 rounded-lg px-3 py-2 text-sm text-[#1C1917] focus:ring-1 focus:ring-[#162E25] outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#1C1917] mb-1">
                {t('phoneLabel')}
              </label>
              <input
                type="tel"
                value={customerPhone}
                onChange={(e) => setCustomerPhone(e.target.value)}
                placeholder="9824012345"
                className="w-full bg-[#FBF9F5] border border-stone-300 rounded-lg px-3 py-2 text-sm text-[#1C1917] focus:ring-1 focus:ring-[#162E25] outline-none"
              />
            </div>
          </div>

          {/* Service Selector */}
          <ServiceSelector
            services={services}
            selectedServiceIds={selectedServiceIds}
            onToggleService={handleToggleService}
          />

          {/* Barber Selector */}
          <BarberPreferenceSelector
            barbers={barbers}
            selectedBarberId={preferredBarberId}
            onSelectBarber={setPreferredBarberId}
          />

          {/* Printed Receipt Checkbox */}
          <div className="flex items-center space-x-2.5 p-3 bg-stone-50 rounded-xl border border-stone-200">
            <input
              type="checkbox"
              id="printedCard"
              checked={hasPrintedCard}
              onChange={(e) => setHasPrintedCard(e.target.checked)}
              className="rounded text-[#162E25] focus:ring-[#162E25] w-4 h-4"
            />
            <label htmlFor="printedCard" className="text-xs text-stone-600 font-medium">
              {t('walkInPrintedNotice')}
            </label>
          </div>

          {/* Submit Action */}
          <div className="flex items-center justify-end space-x-3 pt-3 border-t border-stone-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-full border border-stone-300 text-xs font-semibold text-stone-600 hover:bg-stone-50"
            >
              {t('close')}
            </button>
            <button
              type="submit"
              className="bg-[#162E25] hover:bg-[#0F221B] text-[#C5A880] text-xs font-bold py-2.5 px-6 rounded-full shadow-sm transition-all"
            >
              {t('registerWalkInConfirm')}
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};
