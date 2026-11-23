import { create } from 'zustand';
import { 
  Barber, 
  Service, 
  Token, 
  QueueSettings, 
  BarberStatus 
} from '../types/queue';
import { 
  INITIAL_BARBERS, 
  INITIAL_SERVICES, 
  INITIAL_TOKENS, 
  INITIAL_SETTINGS 
} from '../data/seedData';
import { isValidTransition, checkDuplicateActivePhone, validatePhone } from '../utils/guards';
import { playSalonChime } from '../utils/audioChime';

interface QueueStoreState {
  tokens: Token[];
  barbers: Barber[];
  services: Service[];
  settings: QueueSettings;
  activeCallingTokenId: string | null;
  lastChimeTimestamp: number;

  // Actions
  joinQueue: (data: {
    customerName: string;
    customerPhone: string;
    serviceIds: string[];
    preferredBarberId: string;
  }) => { success: boolean; token?: Token; error?: string; existingTokenId?: string };

  callNext: (barberId: string) => { success: boolean; token?: Token; message?: string };
  startService: (barberId: string) => { success: boolean; error?: string };
  completeService: (barberId: string) => { success: boolean; error?: string };
  markNoShow: (tokenId: string) => { success: boolean };
  cancelToken: (tokenId: string) => { success: boolean };
  bumpGracePeriod: (tokenId: string) => { success: boolean; newToken?: Token };
  
  setBarberStatus: (barberId: string, status: BarberStatus) => void;
  updateSettings: (partial: Partial<QueueSettings>) => void;
  updateService: (serviceId: string, partial: Partial<Service>) => void;
  addService: (newService: Omit<Service, 'id'>) => void;
  addBarber: (newBarber: Omit<Barber, 'id' | 'chairNumber' | 'currentTokenId'>) => void;
  
  // Diagnostic reset
  resetToDefaults: () => void;
}

const STORAGE_KEY = 'aurelle_salon_queue_state_v2';
const LEGACY_STORAGE_KEY = 'salon_queue_state_v1';
const BUS_CHANNEL = 'aurelle_queue_bus';

// Cross-tab Broadcast Channel
let broadcastChannel: BroadcastChannel | null = null;
if (typeof window !== 'undefined' && 'BroadcastChannel' in window) {
  broadcastChannel = new BroadcastChannel(BUS_CHANNEL);
}

/**
 * Safe Migration Loader
 * Ensures previously saved state is migrated to AURELLE unisex services and team,
 * while preserving custom tokens or owner changes.
 */
function loadPersistedState(): {
  tokens: Token[];
  barbers: Barber[];
  services: Service[];
  settings: QueueSettings;
} {
  if (typeof window === 'undefined') {
    return {
      tokens: INITIAL_TOKENS,
      barbers: INITIAL_BARBERS,
      services: INITIAL_SERVICES,
      settings: INITIAL_SETTINGS,
    };
  }

  try {
    // Check v2 storage first
    let raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      // Check legacy v1 storage
      const legacyRaw = localStorage.getItem(LEGACY_STORAGE_KEY);
      if (legacyRaw) {
        raw = legacyRaw;
      }
    }

    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed.tokens && parsed.barbers && parsed.services) {
        // Migration check: If services contain legacy "Royal Beard" or barbers contain "Peter Moodley" or less than 8 stylists,
        // smoothly migrate to AURELLE unisex catalog and full 8-stylist team
        const isLegacy = parsed.services.some((s: Service) => s.nameEn?.includes('Beard') || s.nameEn?.includes('Peter'));
        const barbersLegacy = parsed.barbers.some((b: Barber) => b.name?.includes('Peter Moodley')) || parsed.barbers.length < 8;

        const servicesToUse = isLegacy ? INITIAL_SERVICES : parsed.services;
        const barbersToUse = barbersLegacy ? INITIAL_BARBERS : parsed.barbers;

        return {
          tokens: parsed.tokens || INITIAL_TOKENS,
          barbers: barbersToUse,
          services: servicesToUse,
          settings: parsed.settings || INITIAL_SETTINGS,
        };
      }
    }
  } catch (e) {
    console.warn('Failed to parse persisted queue state:', e);
  }

  return {
    tokens: INITIAL_TOKENS,
    barbers: INITIAL_BARBERS,
    services: INITIAL_SERVICES,
    settings: INITIAL_SETTINGS,
  };
}

function persistState(state: {
  tokens: Token[];
  barbers: Barber[];
  services: Service[];
  settings: QueueSettings;
}) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({
      tokens: state.tokens,
      barbers: state.barbers,
      services: state.services,
      settings: state.settings,
    }));

    if (broadcastChannel) {
      broadcastChannel.postMessage({
        type: 'QUEUE_MUTATION',
        payload: {
          tokens: state.tokens,
          barbers: state.barbers,
          services: state.services,
          settings: state.settings,
        },
      });
    }
  } catch (e) {
    console.error('Error persisting queue state:', e);
  }
}

const initialLoaded = loadPersistedState();

export const useQueueStore = create<QueueStoreState>((set, get) => {
  // Listen for broadcast messages from other tabs
  if (typeof window !== 'undefined' && broadcastChannel) {
    broadcastChannel.onmessage = (event) => {
      if (event.data?.type === 'QUEUE_MUTATION') {
        const { tokens, barbers, services, settings } = event.data.payload;
        set({ tokens, barbers, services, settings });
      } else if (event.data?.type === 'CHIME_EVENT') {
        playSalonChime();
        set({ activeCallingTokenId: event.data.tokenId, lastChimeTimestamp: Date.now() });
      }
    };
  }

  return {
    tokens: initialLoaded.tokens,
    barbers: initialLoaded.barbers,
    services: initialLoaded.services,
    settings: initialLoaded.settings,
    activeCallingTokenId: null,
    lastChimeTimestamp: 0,

    joinQueue: ({ customerName, customerPhone, serviceIds, preferredBarberId }) => {
      const state = get();

      // Guard 1: Queue Open Check
      if (!state.settings.isQueueOpen) {
        return { success: false, error: 'Queue is currently closed or paused by management.' };
      }

      // Guard 2: Duplicate Active Phone Check
      const existing = checkDuplicateActivePhone(customerPhone, state.tokens);
      if (existing) {
        return {
          success: false,
          error: 'An active ticket already exists for this phone number.',
          existingTokenId: existing.id,
          token: existing,
        };
      }

      // Guard 3: Phone number format
      const { valid, cleaned } = validatePhone(customerPhone);
      if (!valid) {
        return { success: false, error: 'Please enter a valid 10-digit Indian phone number.' };
      }

      // Guard 4: Service selection limits
      if (serviceIds.length === 0) {
        return { success: false, error: 'Please choose at least 1 service.' };
      }
      if (serviceIds.length > state.settings.maxServicesPerClient) {
        return { success: false, error: `Maximum ${state.settings.maxServicesPerClient} services allowed per client.` };
      }

      // Calculate totals
      const selectedServices = state.services.filter(s => serviceIds.includes(s.id));
      const totalDurationMinutes = selectedServices.reduce((sum, s) => sum + s.durationMinutes, 0);
      const totalPriceINR = selectedServices.reduce((sum, s) => sum + s.priceINR, 0);

      // Generate incremental token number (e.g. A-106)
      const tokenNumInt = 100 + state.tokens.length + 1;
      const tokenNumber = `A-${tokenNumInt}`;
      const id = `token-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

      const newToken: Token = {
        id,
        tokenNumber,
        customerName: customerName.trim(),
        customerPhone: cleaned,
        serviceIds,
        preferredBarberId,
        assignedBarberId: null,
        status: 'WAITING',
        joinTime: new Date().toISOString(),
        calledTime: null,
        serviceStartTime: null,
        completedTime: null,
        totalDurationMinutes,
        totalPriceINR,
      };

      const nextTokens = [...state.tokens, newToken];
      set({ tokens: nextTokens });
      persistState({ ...state, tokens: nextTokens });

      return { success: true, token: newToken };
    },

    callNext: (barberId: string) => {
      const state = get();
      const barber = state.barbers.find(b => b.id === barberId);
      if (!barber) return { success: false, message: 'Stylist not found' };

      // Concurrency lock: barber must be AVAILABLE
      if (barber.status === 'BUSY') {
        return { success: false, message: 'Stylist is currently in service.' };
      }
      if (barber.status === 'ON_BREAK') {
        return { success: false, message: 'Stylist is currently on break.' };
      }

      // Smart FIFO Dispatch Algorithm:
      // Scan waiting queue in chronological order for preferredBarberId === barberId OR 'ANY'
      const waitingTokens = state.tokens
        .filter(t => t.status === 'WAITING')
        .sort((a, b) => new Date(a.joinTime).getTime() - new Date(b.joinTime).getTime());

      const matchedToken = waitingTokens.find(
        t => t.preferredBarberId === 'ANY' || t.preferredBarberId === barberId
      );

      if (!matchedToken) {
        return { success: false, message: 'No matching clients waiting for this stylist.' };
      }

      if (!isValidTransition(matchedToken.status, 'CALLED')) {
        return { success: false, message: 'Invalid state transition.' };
      }

      const now = new Date().toISOString();
      const nextTokens = state.tokens.map(t => {
        if (t.id === matchedToken.id) {
          return {
            ...t,
            status: 'CALLED' as const,
            calledTime: now,
            assignedBarberId: barberId,
          };
        }
        return t;
      });

      const nextBarbers = state.barbers.map(b => {
        if (b.id === barberId) {
          return {
            ...b,
            status: 'BUSY' as const,
            currentTokenId: matchedToken.id,
          };
        }
        return b;
      });

      playSalonChime();
      if (broadcastChannel) {
        broadcastChannel.postMessage({ 
          type: 'CHIME_EVENT', 
          tokenId: matchedToken.id,
          calledTime: now,
          chairNumber: barber.chairNumber,
        });
      }

      set({
        tokens: nextTokens,
        barbers: nextBarbers,
        activeCallingTokenId: matchedToken.id,
        lastChimeTimestamp: Date.now(),
      });

      persistState({ ...state, tokens: nextTokens, barbers: nextBarbers });
      return { success: true, token: matchedToken };
    },

    startService: (barberId: string) => {
      const state = get();
      const barber = state.barbers.find(b => b.id === barberId);
      if (!barber || !barber.currentTokenId) {
        return { success: false, error: 'No client currently called to this chair.' };
      }

      const token = state.tokens.find(t => t.id === barber.currentTokenId);
      if (!token || !isValidTransition(token.status, 'IN_SERVICE')) {
        return { success: false, error: 'Illegal state transition to IN_SERVICE.' };
      }

      const now = new Date().toISOString();
      const nextTokens = state.tokens.map(t => {
        if (t.id === token.id) {
          return {
            ...t,
            status: 'IN_SERVICE' as const,
            serviceStartTime: now,
          };
        }
        return t;
      });

      set({ tokens: nextTokens });
      persistState({ ...state, tokens: nextTokens });
      return { success: true };
    },

    completeService: (barberId: string) => {
      const state = get();
      const barber = state.barbers.find(b => b.id === barberId);
      if (!barber || !barber.currentTokenId) {
        return { success: false, error: 'No active client to complete.' };
      }

      const token = state.tokens.find(t => t.id === barber.currentTokenId);
      if (!token || !isValidTransition(token.status, 'COMPLETED')) {
        return { success: false, error: 'Illegal transition to COMPLETED.' };
      }

      const now = new Date().toISOString();
      const nextTokens = state.tokens.map(t => {
        if (t.id === token.id) {
          return {
            ...t,
            status: 'COMPLETED' as const,
            completedTime: now,
          };
        }
        return t;
      });

      const nextBarbers = state.barbers.map(b => {
        if (b.id === barberId) {
          return {
            ...b,
            status: 'AVAILABLE' as const,
            currentTokenId: null,
          };
        }
        return b;
      });

      set({ tokens: nextTokens, barbers: nextBarbers });
      persistState({ ...state, tokens: nextTokens, barbers: nextBarbers });
      return { success: true };
    },

    markNoShow: (tokenId: string) => {
      const state = get();
      const token = state.tokens.find(t => t.id === tokenId);
      if (!token || !isValidTransition(token.status, 'NO_SHOW')) {
        return { success: false };
      }

      const nextTokens = state.tokens.map(t => {
        if (t.id === tokenId) {
          return { ...t, status: 'NO_SHOW' as const };
        }
        return t;
      });

      // Free the assigned barber if any
      const nextBarbers = state.barbers.map(b => {
        if (b.currentTokenId === tokenId) {
          return { ...b, status: 'AVAILABLE' as const, currentTokenId: null };
        }
        return b;
      });

      set({ tokens: nextTokens, barbers: nextBarbers });
      persistState({ ...state, tokens: nextTokens, barbers: nextBarbers });
      return { success: true };
    },

    cancelToken: (tokenId: string) => {
      const state = get();
      const token = state.tokens.find(t => t.id === tokenId);
      if (!token || !isValidTransition(token.status, 'CANCELLED')) {
        return { success: false };
      }

      const nextTokens = state.tokens.map(t => {
        if (t.id === tokenId) {
          return { ...t, status: 'CANCELLED' as const };
        }
        return t;
      });

      const nextBarbers = state.barbers.map(b => {
        if (b.currentTokenId === tokenId) {
          return { ...b, status: 'AVAILABLE' as const, currentTokenId: null };
        }
        return b;
      });

      set({ tokens: nextTokens, barbers: nextBarbers });
      persistState({ ...state, tokens: nextTokens, barbers: nextBarbers });
      return { success: true };
    },

    bumpGracePeriod: (tokenId: string) => {
      const state = get();
      const oldToken = state.tokens.find(t => t.id === tokenId);
      if (!oldToken) return { success: false };

      // Archive old token as NO_SHOW or CANCELLED
      const nextTokens = state.tokens.map(t => {
        if (t.id === tokenId) {
          return { ...t, status: 'NO_SHOW' as const };
        }
        return t;
      });

      // Liberate barber chair
      const nextBarbers = state.barbers.map(b => {
        if (b.currentTokenId === tokenId) {
          return { ...b, status: 'AVAILABLE' as const, currentTokenId: null };
        }
        return b;
      });

      // Re-add client at the bottom of queue with fresh token
      const newTokenNumInt = 100 + nextTokens.length + 1;
      const newToken: Token = {
        id: `token-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
        tokenNumber: `A-${newTokenNumInt}`,
        customerName: oldToken.customerName,
        customerPhone: oldToken.customerPhone,
        serviceIds: oldToken.serviceIds,
        preferredBarberId: oldToken.preferredBarberId,
        assignedBarberId: null,
        status: 'WAITING',
        joinTime: new Date().toISOString(),
        calledTime: null,
        serviceStartTime: null,
        completedTime: null,
        totalDurationMinutes: oldToken.totalDurationMinutes,
        totalPriceINR: oldToken.totalPriceINR,
      };

      const finalTokens = [...nextTokens, newToken];
      set({ tokens: finalTokens, barbers: nextBarbers });
      persistState({ ...state, tokens: finalTokens, barbers: nextBarbers });

      return { success: true, newToken };
    },

    setBarberStatus: (barberId: string, status: BarberStatus) => {
      const state = get();
      const nextBarbers = state.barbers.map(b => {
        if (b.id === barberId) {
          return { ...b, status };
        }
        return b;
      });

      set({ barbers: nextBarbers });
      persistState({ ...state, barbers: nextBarbers });
    },

    updateSettings: (partial) => {
      const state = get();
      const nextSettings = { ...state.settings, ...partial };
      set({ settings: nextSettings });
      persistState({ ...state, settings: nextSettings });
    },

    updateService: (serviceId: string, partial: Partial<Service>) => {
      const state = get();
      const nextServices = state.services.map(s => {
        if (s.id === serviceId) {
          return { ...s, ...partial };
        }
        return s;
      });
      set({ services: nextServices });
      persistState({ ...state, services: nextServices });
    },

    addService: (newServiceData) => {
      const state = get();
      const newService: Service = {
        ...newServiceData,
        id: `srv-${Date.now()}`,
      };
      const nextServices = [...state.services, newService];
      set({ services: nextServices });
      persistState({ ...state, services: nextServices });
    },

    addBarber: (newBarberData) => {
      const state = get();
      const chairNumber = state.barbers.length + 1;
      const newBarber: Barber = {
        ...newBarberData,
        id: `barber-${Date.now()}`,
        chairNumber,
        currentTokenId: null,
      };
      const nextBarbers = [...state.barbers, newBarber];
      set({ barbers: nextBarbers });
      persistState({ ...state, barbers: nextBarbers });
    },

    resetToDefaults: () => {
      const defaults = {
        tokens: INITIAL_TOKENS,
        barbers: INITIAL_BARBERS,
        services: INITIAL_SERVICES,
        settings: INITIAL_SETTINGS,
        activeCallingTokenId: null,
        lastChimeTimestamp: 0,
      };
      set(defaults);
      persistState(defaults);
    },
  };
});
