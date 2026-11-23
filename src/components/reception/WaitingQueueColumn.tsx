import React, { useState } from 'react';
import { Token, Barber, Service } from '../../types/queue';
import { useLanguage } from '../../context/LanguageContext';
import { Search, Clock, Phone, Scissors, RefreshCw, Ban } from 'lucide-react';
import { calculateEstimatedWaitTime } from '../../utils/waitCalculator';

interface WaitingQueueColumnProps {
  tokens: Token[];
  barbers: Barber[];
  services: Service[];
  onCallToken?: (barberId: string) => void;
  onBumpToken: (tokenId: string) => void;
  onCancelToken: (tokenId: string) => void;
}

export const WaitingQueueColumn: React.FC<WaitingQueueColumnProps> = ({
  tokens,
  barbers,
  services,
  onBumpToken,
  onCancelToken,
}) => {
  const { language, t } = useLanguage();
  const [searchTerm, setSearchTerm] = useState('');

  // Waiting tokens in FIFO order
  const waitingTokens = tokens
    .filter(t => t.status === 'WAITING')
    .sort((a, b) => new Date(a.joinTime).getTime() - new Date(b.joinTime).getTime());

  const filteredTokens = waitingTokens.filter(t => 
    t.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    t.tokenNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
    t.customerPhone.includes(searchTerm)
  );

  return (
    <div className="bg-white rounded-2xl border border-[#E7E2D8] p-5 shadow-sm flex flex-col h-full">
      
      {/* Header & Search */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-stone-100 gap-3">
        <div>
          <div className="flex items-center space-x-2">
            <h3 className="font-serif text-xl font-bold text-[#162E25]">
              {t('waitingQueueHeader')}
            </h3>
            <span className="bg-[#162E25] text-[#C5A880] text-xs font-mono font-bold px-2.5 py-0.5 rounded-full">
              {waitingTokens.length}
            </span>
          </div>
          <p className="text-xs text-stone-500 mt-0.5">
            Strict FIFO queue ordered by original check-in timestamp.
          </p>
        </div>

        {/* Search Input */}
        <div className="relative w-full sm:w-60">
          <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder={t('searchPlaceholder')}
            className="w-full bg-[#F5F2EB] border border-stone-200 rounded-full pl-9 pr-3 py-1.5 text-xs text-[#1C1917] placeholder-stone-400 focus:outline-none focus:ring-1 focus:ring-[#162E25]"
          />
        </div>
      </div>

      {/* Queue Items List */}
      <div className="flex-1 overflow-y-auto space-y-3 pt-4 pr-1 max-h-[680px]">
        {filteredTokens.length === 0 ? (
          <div className="text-center py-12 text-stone-400">
            <Clock className="w-10 h-10 mx-auto text-stone-300 mb-2 stroke-1" />
            <p className="text-sm font-medium">No customers currently waiting.</p>
            <p className="text-xs text-stone-400 mt-1">Walk-ins and remote registrations will appear here.</p>
          </div>
        ) : (
          filteredTokens.map((token, index) => {
            const { minutes } = calculateEstimatedWaitTime(token, tokens, barbers, services);
            const prefBarber = barbers.find(b => b.id === token.preferredBarberId);
            const tokenServices = services.filter(s => token.serviceIds.includes(s.id));

            return (
              <div
                key={token.id}
                className="p-4 rounded-xl border border-[#E7E2D8] bg-[#FBF9F5] hover:bg-white hover:border-[#C5A880] transition-all shadow-sm"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-3">
                    <span className="font-mono text-xl font-bold text-[#162E25] bg-white px-2.5 py-1 rounded-lg border border-stone-200 shadow-inner">
                      {token.tokenNumber}
                    </span>
                    <div>
                      <div className="flex items-center space-x-2">
                        <h4 className="font-semibold text-sm text-[#1C1917]">
                          {token.customerName}
                        </h4>
                        <span className="text-[10px] text-stone-500 font-mono flex items-center">
                          <Phone className="w-2.5 h-2.5 mr-0.5" />
                          {token.customerPhone}
                        </span>
                      </div>
                      <p className="text-xs text-stone-500 flex items-center space-x-2 mt-0.5">
                        <span className="flex items-center text-[#162E25] font-medium">
                          <Scissors className="w-3 h-3 mr-1 text-[#C5A880]" />
                          {prefBarber ? prefBarber.name : 'Any Stylist (Fastest)'}
                        </span>
                        <span>•</span>
                        <span>{token.totalDurationMinutes} mins</span>
                        <span>•</span>
                        <span className="font-semibold text-stone-700">₹{token.totalPriceINR}</span>
                      </p>
                    </div>
                  </div>

                  {/* Position & Wait Badge */}
                  <div className="text-right">
                    <span className="inline-block bg-[#162E25]/10 text-[#162E25] text-xs font-semibold px-2 py-0.5 rounded-full">
                      #{index + 1} in line
                    </span>
                    <p className="text-[11px] text-stone-500 font-medium mt-1">
                      ~{minutes}m est. wait
                    </p>
                  </div>
                </div>

                {/* Service Pills */}
                <div className="flex flex-wrap gap-1.5 mt-3 pt-2.5 border-t border-stone-200/70">
                  {tokenServices.map(s => (
                    <span
                      key={s.id}
                      className="bg-white border border-stone-200 text-stone-600 text-[10px] font-medium px-2 py-0.5 rounded-full"
                    >
                      {language === 'gu' ? s.nameGu : s.nameEn}
                    </span>
                  ))}
                </div>

                {/* Queue Actions */}
                <div className="flex items-center justify-end space-x-2 mt-3 pt-2">
                  <button
                    type="button"
                    onClick={() => onBumpToken(token.id)}
                    className="text-xs text-stone-600 hover:text-stone-900 bg-white hover:bg-stone-100 border border-stone-200 px-2.5 py-1 rounded-full flex items-center space-x-1 transition-colors"
                    title="Grace Bump: Move to bottom of queue with fresh token"
                  >
                    <RefreshCw className="w-3 h-3 text-stone-500" />
                    <span>{t('graceBumpBtn')}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      if (window.confirm(`Are you sure you want to cancel token ${token.tokenNumber}?`)) {
                        onCancelToken(token.id);
                      }
                    }}
                    className="text-xs text-rose-600 hover:text-rose-800 bg-rose-50 hover:bg-rose-100 border border-rose-200 px-2.5 py-1 rounded-full flex items-center space-x-1 transition-colors"
                  >
                    <Ban className="w-3 h-3" />
                    <span>{t('cancelSpotBtn')}</span>
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

    </div>
  );
};
