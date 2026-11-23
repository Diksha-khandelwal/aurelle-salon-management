import React, { useState, useEffect } from 'react';
import { Clock } from 'lucide-react';

interface StopwatchTimerProps {
  startTimeISO: string | null;
  targetMinutes: number;
}

export const StopwatchTimer: React.FC<StopwatchTimerProps> = ({
  startTimeISO,
  targetMinutes,
}) => {
  const [elapsedSeconds, setElapsedSeconds] = useState(0);

  useEffect(() => {
    if (!startTimeISO) {
      setElapsedSeconds(0);
      return;
    }

    const calculateElapsed = () => {
      const startMs = new Date(startTimeISO).getTime();
      const diffMs = Math.max(0, Date.now() - startMs);
      setElapsedSeconds(Math.floor(diffMs / 1000));
    };

    calculateElapsed();
    const interval = setInterval(calculateElapsed, 1000);
    return () => clearInterval(interval);
  }, [startTimeISO]);

  const mins = Math.floor(elapsedSeconds / 60);
  const secs = elapsedSeconds % 60;
  const formatted = `${String(mins).padStart(2, '0')} : ${String(secs).padStart(2, '0')}`;

  const targetSeconds = targetMinutes * 60;
  const progressPercent = Math.min(100, Math.round((elapsedSeconds / Math.max(1, targetSeconds)) * 100));
  const isOvertime = elapsedSeconds > targetSeconds;

  return (
    <div className="bg-[#0F221B] text-[#FBF9F5] p-5 rounded-2xl border border-[#2D5240] shadow-inner text-center">
      <div className="flex items-center justify-center space-x-2 text-xs uppercase tracking-widest text-[#C5A880] mb-1 font-semibold">
        <Clock className="w-3.5 h-3.5" />
        <span>Service Stopwatch</span>
      </div>

      <div className="font-mono text-4xl sm:text-5xl font-bold tracking-wider text-[#C5A880] py-2">
        {formatted}
      </div>

      <div className="mt-3">
        <div className="flex items-center justify-between text-xs text-stone-400 mb-1">
          <span>Target: {targetMinutes} mins</span>
          <span className={isOvertime ? 'text-amber-400 font-bold' : ''}>
            {progressPercent}% {isOvertime && '(Overtime)'}
          </span>
        </div>
        
        {/* Progress Bar */}
        <div className="w-full bg-stone-800 rounded-full h-2 overflow-hidden">
          <div
            className={`h-full transition-all duration-500 rounded-full ${
              isOvertime ? 'bg-amber-500' : 'bg-[#C5A880]'
            }`}
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>
    </div>
  );
};
