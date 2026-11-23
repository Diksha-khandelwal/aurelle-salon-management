import React, { useState, useEffect, useRef } from 'react';
import { useQueueStore } from '../store/useQueueStore';
import { useLanguage } from '../context/LanguageContext';
import { ChairDisplayCard } from '../components/display/ChairDisplayCard';
import { UpNextList } from '../components/display/UpNextList';
import { AurelleLogo } from '../components/common/AurelleLogo';
import { 
  Tv, 
  Sparkles, 
  Clock, 
  Wifi, 
  Volume2, 
  VolumeX, 
  Play, 
  Sliders, 
  Check, 
  Radio 
} from 'lucide-react';
import { tokenSpeechService, AnnouncementOptions } from '../utils/speechAnnouncement';

export const WallDisplayScreen: React.FC = () => {
  const { barbers, tokens, activeCallingTokenId, lastChimeTimestamp } = useQueueStore();
  const { language, setLanguage, t } = useLanguage();
  const [currentTime, setCurrentTime] = useState('');

  // Voice Announcement Preferences
  const [voiceEnabled, setVoiceEnabled] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('aurelle_tv_voice_enabled');
      return stored !== null ? stored === 'true' : true;
    }
    return true;
  });

  const [langMode, setLangMode] = useState<'auto' | 'en' | 'gu'>(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('aurelle_tv_voice_lang');
      if (stored === 'en' || stored === 'gu' || stored === 'auto') return stored;
    }
    return 'auto';
  });

  const [volume, setVolume] = useState<number>(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('aurelle_tv_voice_volume');
      return stored ? parseFloat(stored) : 1.0;
    }
    return 1.0;
  });

  const [showSettings, setShowSettings] = useState(false);
  const [speakingText, setSpeakingText] = useState<string | null>(null);
  const [audioUnlocked, setAudioUnlocked] = useState(false);

  // Track already-announced token calls to strictly prevent duplicate utterances
  const announcedCallsRef = useRef<Set<string>>(new Set());

  // Subscribe to speech announcement active state for live visual audio wave
  useEffect(() => {
    const unsubscribe = tokenSpeechService.subscribe((text) => {
      setSpeakingText(text);
    });
    return () => unsubscribe();
  }, []);

  // Digital clock update
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(
        now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })
      );
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  // Save voice settings to localStorage
  useEffect(() => {
    localStorage.setItem('aurelle_tv_voice_enabled', String(voiceEnabled));
    localStorage.setItem('aurelle_tv_voice_lang', langMode);
    localStorage.setItem('aurelle_tv_voice_volume', String(volume));
  }, [voiceEnabled, langMode, volume]);

  // Unlock audio on any initial interaction
  const handleUnlockAudio = () => {
    const ok = tokenSpeechService.unlockAudio();
    if (ok) {
      setAudioUnlocked(true);
    }
  };

  // Test voice button handler
  const handleTestVoice = () => {
    tokenSpeechService.unlockAudio();
    setAudioUnlocked(true);
    const options: AnnouncementOptions = {
      enabled: true,
      langMode,
      appLang: language,
      volume,
    };
    tokenSpeechService.playTestAnnouncement(options);
  };

  /**
   * Watch for newly CALLED tokens and trigger spoken voice announcement
   * Rules:
   * 1. Only triggers when status === 'CALLED'.
   * 2. Uses unique combination of tokenId + calledTime to prevent duplicates.
   * 3. Ignores re-renders, WAITING, IN_SERVICE, and COMPLETED states.
   */
  useEffect(() => {
    if (!voiceEnabled) return;

    const callingTokens = tokens.filter(
      (t) => t.status === 'CALLED' && t.calledTime
    );

    callingTokens.forEach((token) => {
      const eventKey = `${token.id}_${token.calledTime}`;

      if (!announcedCallsRef.current.has(eventKey)) {
        announcedCallsRef.current.add(eventKey);

        // Find the chair number for this token
        const assignedBarber = barbers.find(
          (b) => b.id === token.assignedBarberId || b.currentTokenId === token.id
        );
        const chairNumber = assignedBarber ? assignedBarber.chairNumber : 1;

        const options: AnnouncementOptions = {
          enabled: voiceEnabled,
          langMode,
          appLang: language,
          volume,
        };

        tokenSpeechService.announceCall(
          token.id,
          token.tokenNumber,
          chairNumber,
          token.calledTime || Date.now(),
          options
        );
      }
    });
  }, [tokens, barbers, voiceEnabled, langMode, language, volume]);

  // Secondary cross-tab sync via BroadcastChannel for instantaneous dispatch
  useEffect(() => {
    if (typeof window === 'undefined' || !('BroadcastChannel' in window) || !voiceEnabled) return;
    const channel = new BroadcastChannel('aurelle_queue_bus');
    channel.onmessage = (event) => {
      if (event.data?.type === 'CHIME_EVENT') {
        const { tokenId, calledTime, chairNumber } = event.data;
        const currentTokens = useQueueStore.getState().tokens;
        const target = currentTokens.find((t) => t.id === tokenId);
        if (target) {
          const options: AnnouncementOptions = {
            enabled: voiceEnabled,
            langMode,
            appLang: language,
            volume,
          };
          tokenSpeechService.announceCall(
            target.id,
            target.tokenNumber,
            chairNumber || 1,
            calledTime || target.calledTime || Date.now(),
            options
          );
        }
      }
    };
    return () => channel.close();
  }, [voiceEnabled, langMode, language, volume]);

  return (
    <div 
      onClick={handleUnlockAudio}
      className="min-h-screen bg-[#0D1512] text-[#FBF9F5] p-6 lg:p-8 flex flex-col justify-between selection:bg-[#C5A880] selection:text-[#162E25]"
    >
      
      {/* Autoplay Audio Unlock Notice (If not yet clicked) */}
      {!audioUnlocked && (
        <div className="mb-4 bg-[#C5A880] text-[#162E25] px-4 py-2.5 rounded-2xl flex items-center justify-between shadow-lg text-xs font-semibold animate-pulse">
          <div className="flex items-center space-x-2">
            <Volume2 className="w-4 h-4 shrink-0 text-[#162E25]" />
            <span>Click anywhere or press "Activate Audio" to enable spoken token announcements.</span>
          </div>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              handleUnlockAudio();
            }}
            className="bg-[#162E25] hover:bg-[#0F221B] text-[#C5A880] px-3.5 py-1 rounded-full text-xs font-bold transition-all"
          >
            Activate Audio
          </button>
        </div>
      )}

      {/* Live Speech Announcement Active Banner */}
      {speakingText && (
        <div className="mb-4 bg-[#162E25] border-2 border-[#C5A880] text-[#FBF9F5] px-4 py-2.5 rounded-2xl flex items-center space-x-3 shadow-2xl animate-luxury-glow">
          <Radio className="w-4 h-4 text-[#C5A880] animate-pulse" />
          <span className="text-[11px] font-mono uppercase tracking-wider text-[#C5A880] font-bold">
            Live Announcement:
          </span>
          <span className="text-sm font-serif font-bold text-white tracking-wide">
            {speakingText}
          </span>
        </div>
      )}

      {/* TV Header Strip */}
      <div className="flex flex-col md:flex-row md:items-center justify-between pb-6 border-b border-[#2D5240] gap-4">
        
        {/* Brand: AURELLE Monogram & Wordmark */}
        <div className="flex items-center space-x-4">
          <AurelleLogo size="lg" variant="gold" showSubtitle={true} />
        </div>

        {/* Audio Controls, Language & Live Clock */}
        <div className="flex flex-wrap items-center gap-4 sm:gap-6">
          
          {/* Voice Announcement Controls */}
          <div className="flex items-center space-x-2 bg-[#162E25] p-1.5 rounded-full border border-[#2D5240] text-xs">
            {/* Toggle Voice ON/OFF */}
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setVoiceEnabled(!voiceEnabled);
                if (!audioUnlocked) handleUnlockAudio();
              }}
              title={voiceEnabled ? 'Disable Voice Announcements' : 'Enable Voice Announcements'}
              className={`flex items-center space-x-1.5 px-3 py-1 rounded-full transition-all font-semibold ${
                voiceEnabled
                  ? 'bg-[#C5A880] text-[#162E25] font-bold shadow-sm'
                  : 'bg-stone-800 text-stone-400 hover:text-white'
              }`}
            >
              {voiceEnabled ? (
                <>
                  <Volume2 className="w-3.5 h-3.5" />
                  <span>Voice ON</span>
                </>
              ) : (
                <>
                  <VolumeX className="w-3.5 h-3.5" />
                  <span>Voice OFF</span>
                </>
              )}
            </button>

            {/* Test Voice Button */}
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                handleTestVoice();
              }}
              className="px-2.5 py-1 rounded-full text-stone-300 hover:text-[#C5A880] font-medium flex items-center space-x-1"
              title="Test Voice Announcement"
            >
              <Play className="w-3 h-3 fill-current" />
              <span className="hidden sm:inline">Test</span>
            </button>

            {/* Audio Settings Dropdown Toggle */}
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setShowSettings(!showSettings);
              }}
              className={`p-1.5 rounded-full transition-colors ${
                showSettings ? 'bg-[#2D5240] text-[#C5A880]' : 'text-stone-300 hover:text-white'
              }`}
              title="Speech Settings"
            >
              <Sliders className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Language Switch */}
          <div className="flex items-center bg-[#162E25] p-1 rounded-full border border-[#2D5240] text-xs font-semibold">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setLanguage('en');
              }}
              className={`px-3 py-1 rounded-full transition-all ${
                language === 'en' ? 'bg-[#C5A880] text-[#162E25] font-bold' : 'text-stone-300 hover:text-white'
              }`}
            >
              EN
            </button>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setLanguage('gu');
              }}
              className={`px-3 py-1 rounded-full transition-all ${
                language === 'gu' ? 'bg-[#C5A880] text-[#162E25] font-bold' : 'text-stone-300 hover:text-white'
              }`}
            >
              ગુજરાતી
            </button>
          </div>

          {/* Synchronized Salon Clock */}
          <div className="text-right">
            <div className="font-mono text-2xl sm:text-3xl font-bold text-[#C5A880]">
              {currentTime || '12:00:00'}
            </div>
            <p className="text-[10px] text-stone-400 uppercase tracking-wider">
              Salon Time
            </p>
          </div>
        </div>
      </div>

      {/* Pop-Down Voice Settings Panel */}
      {showSettings && (
        <div 
          onClick={(e) => e.stopPropagation()}
          className="my-3 p-4 bg-[#162E25] border border-[#2D5240] rounded-2xl shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4 text-xs animate-fadeIn"
        >
          <div className="flex flex-wrap items-center gap-6">
            {/* Announcement Language Mode */}
            <div>
              <span className="text-stone-400 block mb-1.5 font-medium">Announcement Language:</span>
              <div className="flex items-center space-x-1.5 bg-[#0D1512] p-1 rounded-lg border border-[#2D5240]">
                {(['auto', 'en', 'gu'] as const).map((m) => (
                  <button
                    key={m}
                    type="button"
                    onClick={() => setLangMode(m)}
                    className={`px-2.5 py-1 rounded font-medium transition-all ${
                      langMode === m
                        ? 'bg-[#C5A880] text-[#162E25] font-bold'
                        : 'text-stone-400 hover:text-white'
                    }`}
                  >
                    {m === 'auto' ? 'Follow App' : m === 'en' ? 'English' : 'ગુજરાતી'}
                  </button>
                ))}
              </div>
            </div>

            {/* Volume Slider */}
            <div>
              <span className="text-stone-400 block mb-1.5 font-medium">
                Volume: {Math.round(volume * 100)}%
              </span>
              <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={volume}
                onChange={(e) => setVolume(parseFloat(e.target.value))}
                className="w-28 sm:w-36 accent-[#C5A880] cursor-pointer"
              />
            </div>

            {/* Voice Identification Badge */}
            <div className="bg-[#0D1512] px-3 py-1.5 rounded-lg border border-[#2D5240]">
              <span className="text-stone-400 block text-[10px] uppercase tracking-wider">Female Receptionist Voice:</span>
              <span className="font-semibold text-[#C5A880]">
                {tokenSpeechService.selectBestFemaleVoice(langMode === 'auto' ? language : langMode).info.name}
              </span>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button
              type="button"
              onClick={handleTestVoice}
              className="px-3.5 py-2 rounded-full bg-[#C5A880] text-[#162E25] font-bold text-xs hover:bg-[#B89758] transition-all flex items-center space-x-1.5 shadow-md"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>Test Chime + Announcement</span>
            </button>

            <button
              type="button"
              onClick={() => setShowSettings(false)}
              className="px-3.5 py-2 rounded-full bg-stone-800 text-stone-300 hover:text-white text-xs"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Main Section: 8 Stylist Chair Columns (4x2 Grid) */}
      <div className="my-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
            <h2 className="font-serif text-lg font-bold tracking-wider text-[#C5A880] uppercase">
              {t('nowServing')}
            </h2>
          </div>
          <span className="text-xs text-stone-400">
            {t('nowServingSub')}
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {barbers.map((barber) => {
            const activeToken = tokens.find((t) => t.id === barber.currentTokenId);
            const isCallingThisChair =
              activeCallingTokenId === activeToken?.id &&
              Date.now() - lastChimeTimestamp < 15000;

            return (
              <ChairDisplayCard
                key={barber.id}
                barber={barber}
                activeToken={activeToken}
                isCallingThisChair={isCallingThisChair}
              />
            );
          })}
        </div>
      </div>

      {/* Up Next FIFO Queue List */}
      <div className="my-2">
        <UpNextList tokens={tokens} barbers={barbers} />
      </div>

      {/* TV Bottom Information Bar */}
      <div className="pt-4 border-t border-[#2D5240] flex flex-col sm:flex-row items-center justify-between text-xs text-stone-400 gap-2">
        <div className="flex items-center space-x-2">
          <Sparkles className="w-3.5 h-3.5 text-[#C5A880]" />
          <span>Navrangpura, Ahmedabad • {t('remoteJoinNotice')}</span>
        </div>

        <div className="flex items-center space-x-4 text-stone-400">
          <div className="flex items-center space-x-1.5">
            <span className={`w-2 h-2 rounded-full ${voiceEnabled ? 'bg-emerald-400' : 'bg-stone-500'}`} />
            <span>Voice: {voiceEnabled ? 'Enabled' : 'Muted'}</span>
          </div>

          <div className="flex items-center space-x-1.5">
            <Wifi className="w-3.5 h-3.5 text-[#C5A880]" />
            <span>{t('freeWifiNotice')}</span>
          </div>
        </div>
      </div>

    </div>
  );
};
