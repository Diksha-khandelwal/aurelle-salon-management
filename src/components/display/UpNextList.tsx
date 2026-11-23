import React from 'react';
import { Token, Barber } from '../../types/queue';
import { useLanguage } from '../../context/LanguageContext';
import { Clock, User } from 'lucide-react';

interface UpNextListProps {
  tokens: Token[];
  barbers: Barber[];
}

export const UpNextList: React.FC<UpNextListProps> = ({
  tokens,
  barbers,
}) => {
  const { t } = useLanguage();

  const waitingTokens = tokens
    .filter(t => t.status === 'WAITING')
    .sort((a, b) => new Date(a.joinTime).getTime() - new Date(b.joinTime).getTime())
    .slice(0, 5);

  return (
    <div className="bg-[#162E25]/80 border border-[#2D5240] rounded-2xl p-4 sm:p-5">
      <div className="flex items-center justify-between mb-3 pb-2 border-b border-[#2D5240]">
        <div className="flex items-center space-x-2">
          <Clock className="w-4 h-4 text-[#C5A880]" />
          <h3 className="font-serif text-base sm:text-lg font-bold tracking-wider text-[#FBF9F5] uppercase">
            {t('upNext')}
          </h3>
        </div>
        <span className="text-xs font-mono text-stone-400">
          Showing next {waitingTokens.length} guests in FIFO line
        </span>
      </div>

      {waitingTokens.length === 0 ? (
        <p className="text-xs text-stone-400 py-3 text-center">
          No waiting guests in line. Stations ready for immediate seating.
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-3">
          {waitingTokens.map((token, idx) => {
            const prefBarber = barbers.find(b => b.id === token.preferredBarberId);

            return (
              <div
                key={token.id}
                className="bg-[#0F221B] border border-[#2D5240] rounded-xl p-3 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between text-xs text-stone-400 mb-1">
                    <span className="font-mono text-[#C5A880] font-bold">#{idx + 1}</span>
                    <span>{token.totalDurationMinutes}m</span>
                  </div>
                  <p className="font-mono text-xl font-bold text-white">
                    {token.tokenNumber}
                  </p>
                  <p className="font-semibold text-xs text-stone-200 truncate mt-0.5">
                    {token.customerName}
                  </p>
                </div>

                <div className="mt-2 pt-2 border-t border-[#2D5240] text-[10px] text-[#C5A880] truncate">
                  {prefBarber ? prefBarber.name : 'Any Stylist'}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
