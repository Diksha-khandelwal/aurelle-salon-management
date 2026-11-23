/**
 * AURELLE Unisex Salon & Studio — Premium Receptionist Voice Announcement Service
 *
 * Sequence on every call:
 * STEP 1: ONE soft luxury two-note chime (880 Hz / 1318 Hz) via Web Audio API.
 * STEP 2: Short 280ms breath pause (strictly preventing chime & voice overlap).
 * STEP 3: Spoken female receptionist announcement with polite attention-getter,
 *         digit-by-digit token pronunciation, chair number, and a tasteful humorous welcoming line.
 */

import { audioService } from './audioChime';

export interface AnnouncementOptions {
  enabled: boolean;
  langMode: 'auto' | 'en' | 'gu';
  appLang: 'en' | 'gu';
  volume: number; // 0 to 1
}

export interface VoiceInfo {
  name: string;
  lang: string;
  isFemale: boolean;
  isNative: boolean;
  isGujaratiSupported: boolean;
}

const GUJARATI_DIGITS: Record<string, string> = {
  '0': 'શૂન્ય',
  '1': 'એક',
  '2': 'બે',
  '3': 'ત્રણ',
  '4': 'ચાર',
  '5': 'પાંચ',
  '6': 'છ',
  '7': 'સાત',
  '8': 'આઠ',
  '9': 'નવ',
};

const ENGLISH_DIGITS: Record<string, string> = {
  '0': 'zero',
  '1': 'one',
  '2': 'two',
  '3': 'three',
  '4': 'four',
  '5': 'five',
  '6': 'six',
  '7': 'seven',
  '8': 'eight',
  '9': 'nine',
};

const GUJARATI_NUMBERS: Record<number, string> = {
  1: 'એક',
  2: 'બે',
  3: 'ત્રણ',
  4: 'ચાર',
  5: 'પાંચ',
  6: 'છ',
  7: 'સાત',
  8: 'આઠ',
};

const ENGLISH_NUMBERS: Record<number, string> = {
  1: 'One',
  2: 'Two',
  3: 'Three',
  4: 'Four',
  5: 'Five',
  6: 'Six',
  7: 'Seven',
  8: 'Eight',
};

// Tasteful, friendly humorous lines for an upscale unisex salon
const ENGLISH_HUMOROUS_LINES: ((chair: string) => string)[] = [
  () => 'Your stylist is ready to make some magic!',
  () => 'Your fabulous transformation awaits!',
  () => 'Great hair days are just around the corner!',
  (chair) => `Chair ${chair} is ready for you. Let the pampering begin!`,
  () => 'Your moment of fabulousness has arrived!',
  () => 'Time to sit back, relax, and enjoy the salon experience!',
  () => 'Get ready to look and feel extraordinary!',
];

const GUJARATI_HUMOROUS_LINES: ((chairGu: string) => string)[] = [
  () => 'તમારી સર્વિસ માટે તૈયારીઓ થઈ ગઈ છે!',
  () => 'તમારા નવા લુક માટે તમારા સ્ટાઈલિસ્ટ તૈયાર છે!',
  () => 'આરામથી બેસો અને તમારી સુંદર પળોનો આનંદ માણો!',
  () => 'આજે તમારો દિવસ ખાસ બનાવવાનો સમય આવી ગયો છે!',
  (chairGu) => `ચેર ${chairGu} તમારા માટે તૈયાર છે. ચાલો શરૂ કરીએ!`,
];

interface QueueItem {
  id: string;
  tokenNumber: string;
  chairNumber: number;
  text: string;
  lang: 'en' | 'gu';
  volume: number;
  onStart?: () => void;
  onEnd?: () => void;
}

class TokenSpeechAnnouncementService {
  private queue: QueueItem[] = [];
  private isProcessing = false;
  private announcedEvents = new Set<string>();
  private audioUnlocked = false;
  private currentSpeakingText: string | null = null;
  private listeners: Set<(speakingText: string | null) => void> = new Set();
  private lastHumorousIndex = -1;
  private availableVoices: SpeechSynthesisVoice[] = [];

  constructor() {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      this.refreshVoices();
      window.speechSynthesis.onvoiceschanged = () => {
        this.refreshVoices();
      };
    }
  }

  private refreshVoices(): void {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      this.availableVoices = window.speechSynthesis.getVoices();
    }
  }

  public subscribe(listener: (speakingText: string | null) => void): () => void {
    this.listeners.add(listener);
    listener(this.currentSpeakingText);
    return () => {
      this.listeners.delete(listener);
    };
  }

  private notify(text: string | null): void {
    this.currentSpeakingText = text;
    this.listeners.forEach((l) => l(text));
  }

  public isAudioUnlocked(): boolean {
    return this.audioUnlocked;
  }

  public unlockAudio(): boolean {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      return false;
    }
    try {
      window.speechSynthesis.resume();
      // Unlock Web Audio Context via brief chime call
      audioService.playCallChime();
      this.audioUnlocked = true;
      return true;
    } catch (e) {
      console.warn('Unable to unlock audio:', e);
      return false;
    }
  }

  /**
   * Intelligently select a natural female voice.
   * Prioritizes high-fidelity neural/natural female voices:
   * Microsoft Jenny Online, Microsoft Neerja Online, Microsoft Heera, Google UK Female, Samantha, Zira.
   */
  public selectBestFemaleVoice(lang: 'en' | 'gu'): {
    voice: SpeechSynthesisVoice | null;
    info: VoiceInfo;
  } {
    this.refreshVoices();
    const voices = this.availableVoices;

    if (!voices || voices.length === 0) {
      return {
        voice: null,
        info: {
          name: 'System Default Voice',
          lang: 'en',
          isFemale: true,
          isNative: true,
          isGujaratiSupported: false,
        },
      };
    }

    // If Gujarati mode, check if a true native Gujarati voice exists on this machine
    if (lang === 'gu') {
      const guVoice = voices.find(
        (v) =>
          v.lang.toLowerCase().startsWith('gu') ||
          v.name.toLowerCase().includes('gujarati') ||
          v.name.toLowerCase().includes('dhwani') ||
          v.name.toLowerCase().includes('niranjan')
      );
      if (guVoice) {
        return {
          voice: guVoice,
          info: {
            name: guVoice.name,
            lang: guVoice.lang,
            isFemale: true,
            isNative: !guVoice.name.toLowerCase().includes('online'),
            isGujaratiSupported: true,
          },
        };
      }
      // No native Gujarati voice found -> we fallback to English with clear notification
    }

    // Rank candidate English female voices
    const femaleNameTokens = [
      'jenny', 'neerja', 'heera', 'aria', 'zira', 'samantha', 'victoria', 
      'karen', 'moira', 'tessa', 'fiona', 'veena', 'female', 'woman'
    ];
    const maleNameTokens = ['david', 'mark', 'george', 'ravi', 'guy', 'male', 'man', 'richard'];

    const scored = voices.map((v) => {
      let score = 0;
      const name = v.name.toLowerCase();
      const voiceLang = v.lang.toLowerCase();

      // Filter for English
      if (!voiceLang.startsWith('en')) {
        return { voice: v, score: -100 };
      }

      // High boost for Natural / Neural online voices
      if (name.includes('natural') || name.includes('online')) score += 55;

      // Match female names
      if (femaleNameTokens.some((fn) => name.includes(fn))) score += 45;

      // Disqualify known male names
      if (maleNameTokens.some((mn) => name.includes(mn))) score -= 65;

      // Geographic priority: Indian English (en-IN) has ideal local warmth for Ahmedabad salon
      if (voiceLang.includes('en-in')) score += 30;
      // British English (en-GB) has refined salon aesthetic
      if (voiceLang.includes('en-gb')) score += 20;
      // US English (en-US)
      if (voiceLang.includes('en-us')) score += 15;

      return { voice: v, score };
    });

    scored.sort((a, b) => b.score - a.score);
    const top = scored[0];
    const bestVoice = top && top.score > 0 ? top.voice : (voices.find((v) => v.lang.startsWith('en')) || voices[0]);

    const isNative =
      !bestVoice.name.toLowerCase().includes('online') &&
      !bestVoice.name.toLowerCase().includes('remote');

    return {
      voice: bestVoice,
      info: {
        name: bestVoice.name,
        lang: bestVoice.lang,
        isFemale: true,
        isNative,
        isGujaratiSupported: false,
      },
    };
  }

  /**
   * Format Token string for digit-by-digit pronunciation
   * E.g. "A-115" -> { letter: "A", digitsEn: "one one five", digitsGu: "એક એક પાંચ" }
   */
  public formatTokenPronunciation(tokenNumber: string): {
    letter: string;
    digitsEn: string;
    digitsGu: string;
  } {
    const clean = tokenNumber.replace(/\s+/g, '');
    const match = clean.match(/^([A-Za-z]+)[-_]?(\d+)$/);

    if (match) {
      const letter = match[1].toUpperCase();
      const numString = match[2];

      const digitsEn = numString
        .split('')
        .map((d) => ENGLISH_DIGITS[d] || d)
        .join(' ');

      const digitsGu = numString
        .split('')
        .map((d) => GUJARATI_DIGITS[d] || d)
        .join(' ');

      return { letter, digitsEn, digitsGu };
    }

    return {
      letter: tokenNumber,
      digitsEn: tokenNumber,
      digitsGu: tokenNumber,
    };
  }

  /**
   * Pick next humorous line without repeating the same line consecutively
   */
  private getNextHumorousLine(chairName: string, lang: 'en' | 'gu'): string {
    if (lang === 'gu') {
      const list = GUJARATI_HUMOROUS_LINES;
      let nextIndex = Math.floor(Math.random() * list.length);
      if (nextIndex === this.lastHumorousIndex) {
        nextIndex = (nextIndex + 1) % list.length;
      }
      this.lastHumorousIndex = nextIndex;
      return list[nextIndex](chairName);
    }

    const list = ENGLISH_HUMOROUS_LINES;
    let nextIndex = Math.floor(Math.random() * list.length);
    if (nextIndex === this.lastHumorousIndex) {
      nextIndex = (nextIndex + 1) % list.length;
    }
    this.lastHumorousIndex = nextIndex;
    return list[nextIndex](chairName);
  }

  /**
   * Generate polite, friendly announcement text with female receptionist phrasing
   */
  public generateSpeechText(
    tokenNumber: string,
    chairNumber: number,
    lang: 'en' | 'gu'
  ): { text: string; effectiveLang: 'en' | 'gu' } {
    const { letter, digitsEn, digitsGu } = this.formatTokenPronunciation(tokenNumber);

    // Check if machine actually has Gujarati voice
    const { info } = this.selectBestFemaleVoice(lang);

    if (lang === 'gu' && info.isGujaratiSupported) {
      const chairNameGu = GUJARATI_NUMBERS[chairNumber] || String(chairNumber);
      const humorLine = this.getNextHumorousLine(chairNameGu, 'gu');
      // Gujarati format
      return {
        text: `ધ્યાન આપો! ટોકન ${letter}, ${digitsGu}. કૃપા કરીને ચેર ${chairNameGu} પર આવો. ${humorLine}`,
        effectiveLang: 'gu',
      };
    }

    // English format with natural pause commas
    const chairNameEn = ENGLISH_NUMBERS[chairNumber] || String(chairNumber);
    const humorLine = this.getNextHumorousLine(chairNameEn, 'en');

    return {
      text: `Attention, please! Token ${letter}, ${digitsEn}. Please proceed to Chair ${chairNameEn}. ${humorLine}`,
      effectiveLang: 'en',
    };
  }

  /**
   * Queue and announce a called token
   */
  public announceCall(
    tokenId: string,
    tokenNumber: string,
    chairNumber: number,
    calledTimestamp: string | number,
    options: AnnouncementOptions
  ): boolean {
    if (!options.enabled) return false;

    // Deduplication check: strictly once per unique call event
    const eventKey = `${tokenId}_${calledTimestamp}`;
    if (this.announcedEvents.has(eventKey)) {
      return false;
    }
    this.announcedEvents.add(eventKey);

    if (this.announcedEvents.size > 100) {
      const firstKey = this.announcedEvents.values().next().value;
      if (firstKey) this.announcedEvents.delete(firstKey);
    }

    const targetLang: 'en' | 'gu' =
      options.langMode === 'auto' ? options.appLang : options.langMode;

    const { text, effectiveLang } = this.generateSpeechText(tokenNumber, chairNumber, targetLang);

    this.enqueue({
      id: eventKey,
      tokenNumber,
      chairNumber,
      text,
      lang: effectiveLang,
      volume: options.volume,
    });

    return true;
  }

  /**
   * Test announcement demonstrating full sequence: ONE chime -> pause -> female voice + humor
   */
  public playTestAnnouncement(options: AnnouncementOptions): void {
    const targetLang: 'en' | 'gu' =
      options.langMode === 'auto' ? options.appLang : options.langMode;

    const { text, effectiveLang } = this.generateSpeechText('A-115', 1, targetLang);

    this.enqueue({
      id: `test_${Date.now()}`,
      tokenNumber: 'A-115',
      chairNumber: 1,
      text,
      lang: effectiveLang,
      volume: options.volume,
    });
  }

  private enqueue(item: QueueItem): void {
    this.queue.push(item);
    if (!this.isProcessing) {
      this.processQueue();
    }
  }

  private async processQueue(): Promise<void> {
    if (this.queue.length === 0) {
      this.isProcessing = false;
      this.notify(null);
      return;
    }

    this.isProcessing = true;
    const item = this.queue.shift()!;
    this.notify(item.text);

    try {
      // =========================================================================
      // STEP 1: PLAY ONE SHORT, ELEGANT 2-NOTE MELODIC SALON CHIME
      // =========================================================================
      await audioService.playCallChime();

      // =========================================================================
      // STEP 2: BREATHING PAUSE (280ms) TO STRICTLY PREVENT OVERLAP
      // =========================================================================
      await new Promise((resolve) => setTimeout(resolve, 280));

      // =========================================================================
      // STEP 3: NATURAL FEMALE VOICE ANNOUNCEMENT
      // =========================================================================
      if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
        this.isProcessing = false;
        this.notify(null);
        return;
      }

      window.speechSynthesis.cancel(); // clear previous stuck states

      const utterance = new SpeechSynthesisUtterance(item.text);
      utterance.volume = Math.max(0, Math.min(1, item.volume));

      // Calibrated parameters for natural, warm, friendly female receptionist delivery:
      utterance.rate = 0.93; // Unhurried, hospitable pacing
      utterance.pitch = 1.06; // Warm natural feminine resonance (avoiding squeaky or robotic)

      const { voice } = this.selectBestFemaleVoice(item.lang);
      if (voice) {
        utterance.voice = voice;
        utterance.lang = voice.lang;
      }

      utterance.onstart = () => {
        this.audioUnlocked = true;
        if (item.onStart) item.onStart();
      };

      utterance.onend = () => {
        if (item.onEnd) item.onEnd();
        // Pause briefly before processing next item in queue
        setTimeout(() => {
          this.processQueue();
        }, 500);
      };

      utterance.onerror = (e) => {
        console.warn('SpeechSynthesis error:', e);
        if (item.onEnd) item.onEnd();
        setTimeout(() => {
          this.processQueue();
        }, 400);
      };

      window.speechSynthesis.speak(utterance);
    } catch (err) {
      console.warn('Announcement execution failed:', err);
      this.isProcessing = false;
      this.notify(null);
    }
  }

  public stop(): void {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    this.queue = [];
    this.isProcessing = false;
    this.notify(null);
  }
}

export const tokenSpeechService = new TokenSpeechAnnouncementService();
