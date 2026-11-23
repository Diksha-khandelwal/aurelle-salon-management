import { Token, Barber, Service } from '../types/queue';

/**
 * Mathematical Wait Time Estimation Formula
 *
 * (Total Service Minutes of Customers Ahead) / (Active On-Duty Working Barbers)
 * + Remaining Chair Overhead for currently busy barbers
 */
export function calculateEstimatedWaitTime(
  token: Token,
  allTokens: Token[],
  barbers: Barber[],
  services: Service[]
): { minutes: number; isAllOnBreak: boolean; aheadCount: number } {
  // Barbers on duty: not on break
  const activeBarbers = barbers.filter(b => b.status !== 'ON_BREAK');
  
  if (activeBarbers.length === 0) {
    return {
      minutes: 0,
      isAllOnBreak: true,
      aheadCount: 0,
    };
  }

  // Find all waiting tokens joined before this token
  const waitingTokens = allTokens
    .filter(t => t.status === 'WAITING')
    .sort((a, b) => new Date(a.joinTime).getTime() - new Date(b.joinTime).getTime());

  const tokenIndex = waitingTokens.findIndex(t => t.id === token.id);
  const aheadTokens = tokenIndex >= 0 ? waitingTokens.slice(0, tokenIndex) : waitingTokens;
  const aheadCount = aheadTokens.length;

  // Specific barber preference calculation
  if (token.preferredBarberId !== 'ANY') {
    const targetBarber = barbers.find(b => b.id === token.preferredBarberId);
    if (targetBarber && targetBarber.status === 'ON_BREAK') {
      return { minutes: 45, isAllOnBreak: false, aheadCount };
    }

    // Sum service durations of customers ahead wanting this specific barber OR 'ANY'
    let sumMinutesAhead = 0;
    for (const ahead of aheadTokens) {
      if (ahead.preferredBarberId === token.preferredBarberId || ahead.preferredBarberId === 'ANY') {
        sumMinutesAhead += ahead.totalDurationMinutes || 30;
      }
    }

    // Add remaining busy minutes if the barber is currently serving someone
    let remainingBusy = 0;
    if (targetBarber && targetBarber.status === 'BUSY') {
      const busyToken = allTokens.find(t => t.id === targetBarber.currentTokenId && t.status === 'IN_SERVICE');
      if (busyToken && busyToken.serviceStartTime) {
        const elapsedMins = (Date.now() - new Date(busyToken.serviceStartTime).getTime()) / 60000;
        remainingBusy = Math.max(3, busyToken.totalDurationMinutes - elapsedMins);
      } else {
        remainingBusy = 15;
      }
    }

    const estimatedMins = Math.round(sumMinutesAhead + remainingBusy);
    return { minutes: Math.max(5, estimatedMins), isAllOnBreak: false, aheadCount };
  }

  // General "ANY Barber" calculation
  let sumDurationMinutes = 0;
  for (const ahead of aheadTokens) {
    sumDurationMinutes += ahead.totalDurationMinutes || 30;
  }

  // Remaining overhead from currently busy barbers
  let currentChairsOverhead = 0;
  for (const barber of activeBarbers) {
    if (barber.status === 'BUSY') {
      const activeToken = allTokens.find(t => t.id === barber.currentTokenId && t.status === 'IN_SERVICE');
      if (activeToken && activeToken.serviceStartTime) {
        const elapsed = (Date.now() - new Date(activeToken.serviceStartTime).getTime()) / 60000;
        currentChairsOverhead += Math.max(3, activeToken.totalDurationMinutes - elapsed);
      } else {
        currentChairsOverhead += 12;
      }
    }
  }

  const effectiveBarberCount = Math.max(1, activeBarbers.length);
  const rawWait = (sumDurationMinutes + currentChairsOverhead) / effectiveBarberCount;
  const minutes = Math.max(aheadCount === 0 ? 5 : 10, Math.round(rawWait));

  return {
    minutes,
    isAllOnBreak: false,
    aheadCount,
  };
}

/**
 * Calculates current aggregate salon wait time for prospective visitors
 */
export function calculateLoungeWaitSummary(
  allTokens: Token[],
  barbers: Barber[]
): { waitingCount: number; estWaitMinutes: number; activeBarberCount: number; isAllOnBreak: boolean } {
  const activeBarbers = barbers.filter(b => b.status !== 'ON_BREAK');
  const waitingTokens = allTokens.filter(t => t.status === 'WAITING');

  if (activeBarbers.length === 0) {
    return {
      waitingCount: waitingTokens.length,
      estWaitMinutes: 0,
      activeBarberCount: 0,
      isAllOnBreak: true,
    };
  }

  let totalServiceMinutes = waitingTokens.reduce((acc, t) => acc + (t.totalDurationMinutes || 30), 0);
  
  // Factor in chairs currently busy
  const busyCount = activeBarbers.filter(b => b.status === 'BUSY').length;
  totalServiceMinutes += busyCount * 15;

  const estWaitMinutes = Math.max(5, Math.round(totalServiceMinutes / Math.max(1, activeBarbers.length)));

  return {
    waitingCount: waitingTokens.length,
    estWaitMinutes,
    activeBarberCount: activeBarbers.length,
    isAllOnBreak: false,
  };
}
