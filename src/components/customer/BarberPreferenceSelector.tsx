import React from 'react';
import { Barber } from '../../types/queue';
import { useLanguage } from '../../context/LanguageContext';
import { Sparkles, Star, Zap } from 'lucide-react';

interface BarberPreferenceSelectorProps {
  barbers: Barber[];
  selectedBarberId: string;
  onSelectBarber: (barberId: string) => void;
}

export const BarberPreferenceSelector: React.FC<BarberPreferenceSelectorProps> = ({
  barbers,
  selectedBarberId,
  onSelectBarber,
}) => {
  const { t } = useLanguage();

  return (
    <div className="space-y-3">
      <label className="block text-sm font-semibold text-[#1C1917]">
        {t('step3Title')}
      </label>

      {/* Any Barber (Fastest Option) */}
      <div
        onClick={() => onSelectBarber('ANY')}
        className={`p-4 rounded-xl border transition-all cursor-pointer flex items-center justify-between ${
          selectedBarberId === 'ANY'
            ? 'border-[#162E25] bg-[#162E25]/5 ring-2 ring-[#162E25]'
            : 'border-[#E7E2D8] bg-white hover:border-[#C5A880] hover:shadow-sm'
        }`}
      >
        <div className="flex items-center space-x-3.5">
          <div className="w-11 h-11 rounded-full bg-[#162E25] text-[#C5A880] flex items-center justify-center shrink-0">
            <Zap className="w-5 h-5 fill-current" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="font-semibold text-sm text-[#1C1917]">
                {t('anyStylistOption')}
              </span>
              <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
                Fastest
              </span>
            </div>
            <p className="text-xs text-stone-500 mt-0.5">
              Assigned automatically to the first craftsman chair that becomes vacant.
            </p>
          </div>
        </div>

        <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 ${
          selectedBarberId === 'ANY' ? 'border-[#162E25] bg-[#162E25]' : 'border-stone-300 bg-white'
        }`}>
          {selectedBarberId === 'ANY' && <div className="w-2 h-2 rounded-full bg-white" />}
        </div>
      </div>

      {/* Specific Barbers Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
        {barbers.map((barber) => {
          const isSelected = selectedBarberId === barber.id;
          const isOnBreak = barber.status === 'ON_BREAK';

          return (
            <div
              key={barber.id}
              onClick={() => onSelectBarber(barber.id)}
              className={`p-3.5 rounded-xl border transition-all cursor-pointer flex items-center justify-between ${
                isSelected
                  ? 'border-[#162E25] bg-[#162E25]/5 ring-2 ring-[#162E25]'
                  : 'border-[#E7E2D8] bg-white hover:border-[#C5A880] hover:shadow-sm'
              }`}
            >
              <div className="flex items-center space-x-3">
                <img
                  src={barber.avatar}
                  alt={barber.name}
                  className="w-11 h-11 rounded-full object-cover border border-stone-200 shrink-0"
                />
                <div>
                  <div className="flex items-center space-x-1.5">
                    <span className="font-semibold text-sm text-[#1C1917]">
                      {barber.name}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2 mt-0.5">
                    <span className="text-[11px] text-stone-500 flex items-center">
                      <Star className="w-3 h-3 text-amber-500 fill-amber-500 mr-0.5" />
                      {barber.rating}
                    </span>
                    <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                      barber.status === 'AVAILABLE'
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        : barber.status === 'BUSY'
                        ? 'bg-amber-50 text-amber-700 border border-amber-200'
                        : 'bg-slate-100 text-slate-600 border border-slate-200'
                    }`}>
                      {t(`status${barber.status.charAt(0) + barber.status.slice(1).toLowerCase()}` as any) || barber.status}
                    </span>
                  </div>
                </div>
              </div>

              <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 ${
                isSelected ? 'border-[#162E25] bg-[#162E25]' : 'border-stone-300 bg-white'
              }`}>
                {isSelected && <div className="w-2 h-2 rounded-full bg-white" />}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
