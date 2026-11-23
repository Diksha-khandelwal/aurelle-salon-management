import React from 'react';
import { Service } from '../../types/queue';
import { useLanguage } from '../../context/LanguageContext';
import { Clock, Check } from 'lucide-react';

interface ServiceSelectorProps {
  services: Service[];
  selectedServiceIds: string[];
  onToggleService: (serviceId: string) => void;
  maxAllowed?: number;
}

export const ServiceSelector: React.FC<ServiceSelectorProps> = ({
  services,
  selectedServiceIds,
  onToggleService,
  maxAllowed = 3,
}) => {
  const { language, t } = useLanguage();

  const isSelected = (id: string) => selectedServiceIds.includes(id);
  const isCapReached = selectedServiceIds.length >= maxAllowed;

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <label className="block text-sm font-semibold text-[#1C1917]">
          {t('step2Title')}
        </label>
        <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full ${
          isCapReached ? 'bg-amber-100 text-amber-800' : 'bg-emerald-100 text-emerald-800'
        }`}>
          {selectedServiceIds.length} / {maxAllowed} {t('selectedServices')}
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {services.filter(s => s.enabled).map((service) => {
          const selected = isSelected(service.id);
          const disabled = !selected && isCapReached;
          const serviceName = language === 'gu' ? service.nameGu : service.nameEn;

          return (
            <div
              key={service.id}
              onClick={() => {
                if (!disabled) {
                  onToggleService(service.id);
                }
              }}
              className={`relative p-4 rounded-xl border transition-all cursor-pointer flex flex-col justify-between ${
                selected
                  ? 'border-[#162E25] bg-[#162E25]/5 ring-2 ring-[#162E25]'
                  : disabled
                  ? 'border-stone-200 bg-stone-50 opacity-50 cursor-not-allowed'
                  : 'border-[#E7E2D8] bg-white hover:border-[#C5A880] hover:shadow-sm'
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="pr-4">
                  <h4 className="font-semibold text-sm text-[#1C1917] leading-tight">
                    {serviceName}
                  </h4>
                  <p className="text-xs text-stone-500 mt-1 line-clamp-2">
                    {service.description}
                  </p>
                </div>
                <div
                  className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 transition-colors ${
                    selected
                      ? 'bg-[#162E25] text-[#FBF9F5]'
                      : 'border border-stone-300 bg-white'
                  }`}
                >
                  {selected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                </div>
              </div>

              <div className="flex items-center justify-between mt-3 pt-2.5 border-t border-stone-100 text-xs">
                <span className="flex items-center text-stone-600 font-medium">
                  <Clock className="w-3.5 h-3.5 mr-1 text-[#C5A880]" />
                  {service.durationMinutes} {t('minsUnit')}
                </span>
                <span className="font-serif font-bold text-base text-[#162E25]">
                  ₹{service.priceINR}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
