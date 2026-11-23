import { Token, TokenStatus, Barber } from '../types/queue';

/**
 * Validates State Machine transitions and prevents illegal jumps.
 */
export function isValidTransition(from: TokenStatus, to: TokenStatus): boolean {
  const allowedTransitions: Record<TokenStatus, TokenStatus[]> = {
    WAITING: ['CALLED', 'CANCELLED'],
    CALLED: ['IN_SERVICE', 'NO_SHOW', 'CANCELLED'],
    IN_SERVICE: ['COMPLETED'],
    COMPLETED: [],
    NO_SHOW: [],
    CANCELLED: [],
  };

  return allowedTransitions[from]?.includes(to) ?? false;
}

/**
 * Asserts that phone is valid 10-digit Indian mobile number
 */
export function validatePhone(phone: string): { valid: boolean; cleaned: string } {
  const cleaned = phone.replace(/\D/g, '');
  const tenDigit = cleaned.length >= 10 ? cleaned.slice(-10) : cleaned;
  const valid = /^[6-9]\d{9}$/.test(tenDigit);
  return { valid, cleaned: tenDigit };
}

/**
 * Anti-Duplicate Active Ticket Guard
 * Checks whether this phone number already possesses an active ticket (WAITING or CALLED)
 */
export function checkDuplicateActivePhone(
  phone: string,
  tokens: Token[]
): Token | undefined {
  const { cleaned } = validatePhone(phone);
  return tokens.find(
    t => t.customerPhone === cleaned && (t.status === 'WAITING' || t.status === 'CALLED')
  );
}

/**
 * Checks whether chair can call a customer (Concurrency Lock)
 */
export function canBarberCallNext(barber: Barber): boolean {
  return barber.status === 'AVAILABLE';
}
