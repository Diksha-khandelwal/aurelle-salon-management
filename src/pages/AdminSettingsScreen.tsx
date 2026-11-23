import React from 'react';
import { useQueueStore } from '../store/useQueueStore';
import { useLanguage } from '../context/LanguageContext';
import { AnalyticsSummary } from '../components/admin/AnalyticsSummary';
import { QueueControlPanel } from '../components/admin/QueueControlPanel';
import { ServiceManager } from '../components/admin/ServiceManager';
import { RosterManager } from '../components/admin/RosterManager';
import { ShieldCheck, BarChart3, Settings, Scissors } from 'lucide-react';

export const AdminSettingsScreen: React.FC = () => {
  const { 
    tokens, 
    barbers, 
    services, 
    settings, 
    setBarberStatus, 
    updateSettings, 
    updateService, 
    addService, 
    addBarber, 
    resetToDefaults 
  } = useQueueStore();
  const { t } = useLanguage();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Admin Title Header */}
      <div className="flex items-center justify-between pb-6 border-b border-stone-200">
        <div>
          <div className="flex items-center space-x-2">
            <ShieldCheck className="w-6 h-6 text-[#162E25]" />
            <h1 className="font-serif text-3xl font-bold text-[#162E25]">
              {t('adminTitle')}
            </h1>
          </div>
          <p className="text-xs text-stone-500 mt-1">
            Master salon operational parameters, automated 30-min closing cutoffs, service rates, and daily KPIs.
          </p>
        </div>
      </div>

      {/* KPI Metrics Bar */}
      <div className="space-y-3">
        <h3 className="font-serif text-lg font-bold text-[#162E25] flex items-center space-x-2">
          <BarChart3 className="w-4 h-4 text-[#C5A880]" />
          <span>{t('metricsTitle')}</span>
        </h3>
        <AnalyticsSummary tokens={tokens} />
      </div>

      {/* Master Queue Controls */}
      <QueueControlPanel
        settings={settings}
        onUpdateSettings={updateSettings}
        onResetDefaults={resetToDefaults}
      />

      {/* Service Catalogue Manager */}
      <ServiceManager
        services={services}
        onUpdateService={updateService}
        onAddService={addService}
      />

      {/* Barber Roster Manager */}
      <RosterManager
        barbers={barbers}
        onSetBarberStatus={setBarberStatus}
        onAddBarber={addBarber}
      />

    </div>
  );
};
