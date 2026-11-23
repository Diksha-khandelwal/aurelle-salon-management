import React from 'react';
import { Token } from '../../types/queue';
import { useLanguage } from '../../context/LanguageContext';
import { Users, Clock, Timer, Banknote } from 'lucide-react';

interface AnalyticsSummaryProps {
  tokens: Token[];
}

export const AnalyticsSummary: React.FC<AnalyticsSummaryProps> = ({ tokens }) => {
  const { t } = useLanguage();

  const completedTokens = tokens.filter(t => t.status === 'COMPLETED');
  const countServed = completedTokens.length;

  // Gross Revenue in INR
  const grossRevenue = completedTokens.reduce((acc, t) => acc + (t.totalPriceINR || 0), 0);

  // Average Wait Time (Joined to Called)
  let totalWaitMinutes = 0;
  let waitCount = 0;
  for (const token of tokens) {
    if (token.calledTime && token.joinTime) {
      const waitMs = new Date(token.calledTime).getTime() - new Date(token.joinTime).getTime();
      totalWaitMinutes += Math.max(1, Math.round(waitMs / 60000));
      waitCount++;
    }
  }
  const avgWaitTime = waitCount > 0 ? Math.round(totalWaitMinutes / waitCount) : 18;

  // Average Service Duration
  let totalServiceMinutes = 0;
  let serviceCount = 0;
  for (const token of completedTokens) {
    if (token.completedTime && token.serviceStartTime) {
      const sMs = new Date(token.completedTime).getTime() - new Date(token.serviceStartTime).getTime();
      totalServiceMinutes += Math.max(1, Math.round(sMs / 60000));
      serviceCount++;
    }
  }
  const avgServiceTime = serviceCount > 0 ? Math.round(totalServiceMinutes / serviceCount) : 32;

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {/* Metric 1 */}
      <div className="p-4 rounded-2xl bg-white border border-[#E7E2D8] shadow-sm">
        <div className="flex items-center space-x-2 text-stone-500 text-xs mb-1">
          <Users className="w-4 h-4 text-[#162E25]" />
          <span>{t('clientsServedToday')}</span>
        </div>
        <p className="font-serif text-3xl font-bold text-[#162E25]">
          {countServed}
        </p>
        <span className="text-[10px] text-emerald-600 font-semibold bg-emerald-50 px-2 py-0.5 rounded-full inline-block mt-2">
          +4 from yesterday
        </span>
      </div>

      {/* Metric 2 */}
      <div className="p-4 rounded-2xl bg-white border border-[#E7E2D8] shadow-sm">
        <div className="flex items-center space-x-2 text-stone-500 text-xs mb-1">
          <Clock className="w-4 h-4 text-[#C5A880]" />
          <span>{t('avgWaitTime')}</span>
        </div>
        <p className="font-serif text-3xl font-bold text-[#162E25]">
          {avgWaitTime} <span className="text-sm font-sans font-normal text-stone-500">mins</span>
        </p>
        <span className="text-[10px] text-emerald-600 font-semibold bg-emerald-50 px-2 py-0.5 rounded-full inline-block mt-2">
          Target &lt; 25 mins
        </span>
      </div>

      {/* Metric 3 */}
      <div className="p-4 rounded-2xl bg-white border border-[#E7E2D8] shadow-sm">
        <div className="flex items-center space-x-2 text-stone-500 text-xs mb-1">
          <Timer className="w-4 h-4 text-amber-600" />
          <span>{t('avgServiceTime')}</span>
        </div>
        <p className="font-serif text-3xl font-bold text-[#162E25]">
          {avgServiceTime} <span className="text-sm font-sans font-normal text-stone-500">mins</span>
        </p>
        <span className="text-[10px] text-stone-600 font-semibold bg-stone-100 px-2 py-0.5 rounded-full inline-block mt-2">
          Optimal utilization
        </span>
      </div>

      {/* Metric 4 */}
      <div className="p-4 rounded-2xl bg-white border border-[#E7E2D8] shadow-sm">
        <div className="flex items-center space-x-2 text-stone-500 text-xs mb-1">
          <Banknote className="w-4 h-4 text-emerald-600" />
          <span>{t('grossRevenue')}</span>
        </div>
        <p className="font-serif text-3xl font-bold text-[#162E25]">
          ₹{grossRevenue.toLocaleString('en-IN')}
        </p>
        <span className="text-[10px] text-emerald-600 font-semibold bg-emerald-50 px-2 py-0.5 rounded-full inline-block mt-2">
          All payment in-salon
        </span>
      </div>
    </div>
  );
};
