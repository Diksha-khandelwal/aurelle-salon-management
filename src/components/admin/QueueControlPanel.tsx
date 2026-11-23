import React from 'react';
import { QueueSettings } from '../../types/queue';
import { useLanguage } from '../../context/LanguageContext';
import { ToggleLeft, ToggleRight, Clock } from 'lucide-react';

interface QueueControlPanelProps {
  settings: QueueSettings;
  onUpdateSettings: (partial: Partial<QueueSettings>) => void;
  onResetDefaults: () => void;
}

export const QueueControlPanel: React.FC<QueueControlPanelProps> = ({
  settings,
  onUpdateSettings,
  onResetDefaults,
}) => {
  const { t } = useLanguage();

  return (
    <div className="bg-white rounded-2xl border border-[#E7E2D8] p-5 shadow-sm space-y-5">
      <div className="pb-3 border-b border-stone-200">
        <h3 className="font-serif text-lg font-bold text-[#162E25]">
          {t('queueControls')}
        </h3>
        <p className="text-xs text-stone-500">
          Master emergency switches, operating hours, and automated closing rules.
        </p>
      </div>

      {/* Master Queue Switch */}
      <div className="p-4 bg-[#FBF9F5] rounded-xl border border-stone-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <label className="text-sm font-semibold text-[#1C1917] block">
            {t('masterStatusLabel')}
          </label>
          <p className="text-xs text-stone-500 mt-0.5">
            When paused or closed, customers cannot submit new tickets remotely.
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <button
            type="button"
            onClick={() => onUpdateSettings({ isQueueOpen: true })}
            className={`px-4 py-2 rounded-full text-xs font-bold transition-all ${
              settings.isQueueOpen
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'bg-stone-200 text-stone-600 hover:bg-stone-300'
            }`}
          >
            {t('openQueue')}
          </button>
          <button
            type="button"
            onClick={() => onUpdateSettings({ isQueueOpen: false })}
            className={`px-4 py-2 rounded-full text-xs font-bold transition-all ${
              !settings.isQueueOpen
                ? 'bg-rose-600 text-white shadow-sm'
                : 'bg-stone-200 text-stone-600 hover:bg-stone-300'
            }`}
          >
            {t('pauseQueue')}
          </button>
        </div>
      </div>

      {/* 30-Minute Auto Cutoff Rule */}
      <div className="p-4 bg-[#FBF9F5] rounded-xl border border-stone-200 space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <label className="text-sm font-semibold text-[#1C1917] block">
              {t('autoCutoffLabel')}
            </label>
            <p className="text-xs text-stone-500 max-w-md mt-0.5">
              {t('autoCutoffDesc')}
            </p>
          </div>

          <button
            type="button"
            onClick={() => onUpdateSettings({ autoCutoff30m: !settings.autoCutoff30m })}
            className="text-[#162E25] hover:text-[#0F221B]"
          >
            {settings.autoCutoff30m ? (
              <ToggleRight className="w-9 h-9 text-emerald-600 fill-current" />
            ) : (
              <ToggleLeft className="w-9 h-9 text-stone-400" />
            )}
          </button>
        </div>

        <div className="flex items-center space-x-3 pt-2 border-t border-stone-200 text-xs text-stone-600">
          <Clock className="w-4 h-4 text-[#C5A880]" />
          <span>{t('closingTimeLabel')}:</span>
          <input
            type="time"
            value={settings.salonClosingTime}
            onChange={e => onUpdateSettings({ salonClosingTime: e.target.value })}
            className="bg-white border rounded px-2 py-1 text-xs font-mono font-semibold"
          />
        </div>
      </div>

      {/* Reset State Button */}
      <div className="pt-2 flex justify-end">
        <button
          type="button"
          onClick={() => {
            if (window.confirm('Reset all queue data, active tokens, and roster to seed defaults?')) {
              onResetDefaults();
            }
          }}
          className="text-xs text-stone-500 hover:text-stone-800 underline"
        >
          Reset Simulation Data to Defaults
        </button>
      </div>
    </div>
  );
};
