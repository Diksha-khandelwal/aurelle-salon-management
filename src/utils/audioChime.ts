/**
 * Web Audio API Synthesizer for Salon Chime
 * Synthesizes a luxury 2-tone pleasant melodic chime:
 * Tone 1: 880 Hz (A5), Tone 2: 1318.5 Hz (E6)
 * Returns a Promise that resolves when the chime completes (~750ms)
 * to guarantee zero overlap with subsequent voice announcements.
 */
class SalonAudioService {
  private ctx: AudioContext | null = null;

  private getAudioContext(): AudioContext | null {
    if (typeof window === 'undefined') return null;
    if (!this.ctx) {
      const AudioContextClass =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioContextClass) {
        this.ctx = new AudioContextClass();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
    return this.ctx;
  }

  public playCallChime(): Promise<void> {
    return new Promise((resolve) => {
      try {
        const audioCtx = this.getAudioContext();
        if (!audioCtx) {
          resolve();
          return;
        }

        const now = audioCtx.currentTime;

        // Note 1: A5 (880 Hz) — gentle chime attack
        const osc1 = audioCtx.createOscillator();
        const gain1 = audioCtx.createGain();
        osc1.type = 'sine';
        osc1.frequency.setValueAtTime(880, now);
        gain1.gain.setValueAtTime(0.001, now);
        gain1.gain.exponentialRampToValueAtTime(0.20, now + 0.04);
        gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.35);

        osc1.connect(gain1);
        gain1.connect(audioCtx.destination);
        osc1.start(now);
        osc1.stop(now + 0.35);

        // Note 2: E6 (1318.51 Hz) — soft second bell note
        const osc2 = audioCtx.createOscillator();
        const gain2 = audioCtx.createGain();
        osc2.type = 'sine';
        osc2.frequency.setValueAtTime(1318.51, now + 0.20);
        gain2.gain.setValueAtTime(0.001, now + 0.20);
        gain2.gain.exponentialRampToValueAtTime(0.18, now + 0.24);
        gain2.gain.exponentialRampToValueAtTime(0.0001, now + 0.72);

        osc2.connect(gain2);
        gain2.connect(audioCtx.destination);
        osc2.start(now + 0.20);
        osc2.stop(now + 0.72);

        // Trigger subtle mobile vibration if supported
        if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
          navigator.vibrate([150, 80, 150]);
        }

        // Resolves when chime sound envelope finishes to prevent speech overlap
        setTimeout(() => {
          resolve();
        }, 750);
      } catch (e) {
        console.warn('Audio chime playback was intercepted or unsupported:', e);
        resolve();
      }
    });
  }
}

export const audioService = new SalonAudioService();
export const playSalonChime = () => audioService.playCallChime();
