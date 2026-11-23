export type TokenStatus = 
  | 'WAITING' 
  | 'CALLED' 
  | 'IN_SERVICE' 
  | 'COMPLETED' 
  | 'NO_SHOW' 
  | 'CANCELLED';

export type BarberStatus = 
  | 'AVAILABLE' 
  | 'BUSY' 
  | 'ON_BREAK';

export interface Barber {
  id: string;
  name: string;
  slug: string;
  title: string;
  avatar: string;
  status: BarberStatus;
  rating: number;
  specialties: string[];
  chairNumber: number;
  currentTokenId: string | null;
}

export interface Service {
  id: string;
  nameEn: string;
  nameGu: string;
  durationMinutes: number;
  priceINR: number;
  category: 'Hair' | 'Beard' | 'Combo' | 'Skin' | 'Wellness' | 'Color';
  description: string;
  enabled: boolean;
}

export interface Token {
  id: string;
  tokenNumber: string;
  customerName: string;
  customerPhone: string;
  serviceIds: string[];
  preferredBarberId: string; // 'ANY' or barber id
  assignedBarberId: string | null;
  status: TokenStatus;
  joinTime: string; // ISO 8601 string
  calledTime: string | null;
  serviceStartTime: string | null;
  completedTime: string | null;
  totalDurationMinutes: number;
  totalPriceINR: number;
}

export interface QueueSettings {
  isQueueOpen: boolean;
  autoCutoff30m: boolean;
  salonClosingTime: string; // "20:00" format
  maxServicesPerClient: number;
  gracePeriodMinutes: number;
}

export interface QueueState {
  tokens: Token[];
  barbers: Barber[];
  services: Service[];
  settings: QueueSettings;
  activeCallingTokenId: string | null;
  lastChimeTimestamp: number;
}
