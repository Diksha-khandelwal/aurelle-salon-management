import React, { useState } from 'react';
import { useQueueStore } from '../store/useQueueStore';
import { useLanguage } from '../context/LanguageContext';
import { WaitingQueueColumn } from '../components/reception/WaitingQueueColumn';
import { ActiveChairsColumn } from '../components/reception/ActiveChairsColumn';
import { WalkInModal } from '../components/reception/WalkInModal';
import { 
  UserPlus, 
  Sparkles, 
  Clock, 
  CheckCircle2, 
  ToggleLeft, 
  ToggleRight 
} from 'lucide-react';

export const ReceptionDashboardScreen: React.FC = () => {
  const { 
    tokens, 
    barbers, 
    services, 
    settings,
    joinQueue, 
    callNext, 
    startService, 
    completeService, 
    markNoShow, 
    cancelToken, 
    bumpGracePeriod,
    setBarberStatus,
    updateSettings
  } = useQueueStore();

  const { t } = useLanguage();
  const [isWalkInModalOpen, setIsWalkInModalOpen] = useState(false);

  const handleToggleBreak = (barberId: string, currentStatus: string) => {
    const nextStatus = currentStatus === 'ON_BREAK' ? 'AVAILABLE' : 'ON_BREAK';
    setBarberStatus(barberId, nextStatus);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      
      {/* Reception Action Header Strip */}
      <div className="bg-[#162E25] text-[#FBF9F5] p-5 sm:p-6 rounded-2xl shadow-elevated border border-[#2D5240] flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
            <h1 className="font-serif text-2xl font-bold tracking-tight text-[#FBF9F5]">
              {t('receptionTitle')}
            </h1>
          </div>
          <p className="text-xs text-stone-300 mt-1">
            Real-time floor coordination: walk-in intake, FIFO dispatch, and chair occupancy.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* Quick Queue Toggle */}
          <button
            type="button"
            onClick={() => updateSettings({ isQueueOpen: !settings.isQueueOpen })}
            className={`px-3.5 py-1.5 rounded-full text-xs font-bold flex items-center space-x-1.5 border transition-all ${
              settings.isQueueOpen
                ? 'bg-emerald-950 text-emerald-300 border-emerald-500'
                : 'bg-rose-950 text-rose-300 border-rose-500'
            }`}
          >
            <span>Queue: {settings.isQueueOpen ? 'OPEN' : 'PAUSED'}</span>
          </button>

          {/* Big Add Walk-In Button */}
          <button
            type="button"
            onClick={() => setIsWalkInModalOpen(true)}
            className="bg-[#C5A880] hover:bg-[#B89758] text-[#162E25] font-semibold text-xs py-2.5 px-5 rounded-full flex items-center space-x-2 shadow-sm transition-all"
          >
            <UserPlus className="w-4 h-4" />
            <span>{t('registerWalkInBtn')}</span>
          </button>
        </div>
      </div>

      {/* 2-Column Responsive Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
        
        {/* Left Column: Waiting Queue (FIFO) */}
        <WaitingQueueColumn
          tokens={tokens}
          barbers={barbers}
          services={services}
          onBumpToken={bumpGracePeriod}
          onCancelToken={cancelToken}
        />

        {/* Right Column: Active Chairs */}
        <ActiveChairsColumn
          barbers={barbers}
          tokens={tokens}
          services={services}
          onCallNext={callNext}
          onStartService={startService}
          onCompleteService={completeService}
          onMarkNoShow={markNoShow}
          onToggleBreak={handleToggleBreak}
        />

      </div>

      {/* Walk-In Registration Modal */}
      <WalkInModal
        isOpen={isWalkInModalOpen}
        onClose={() => setIsWalkInModalOpen(false)}
        services={services}
        barbers={barbers}
        existingTokens={tokens}
        onSubmitWalkIn={joinQueue}
      />

    </div>
  );
};
