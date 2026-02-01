import { useRef, useCallback, useEffect, useState } from 'react';

// Sound definitions
const soundLibrary: Record<string, (ctx: AudioContext) => void> = {
  chime: (ctx) => {
    const notes = [523.25, 659.25, 783.99];
    notes.forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.frequency.value = freq;
      osc.type = 'sine';
      const start = ctx.currentTime + i * 0.15;
      gain.gain.setValueAtTime(0, start);
      gain.gain.linearRampToValueAtTime(0.5, start + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.01, start + 0.15);
      osc.start(start);
      osc.stop(start + 0.15);
    });
  },
  bell: (ctx) => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.frequency.value = 880;
    osc.type = 'sine';
    gain.gain.setValueAtTime(0.6, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 1);
    osc.start();
    osc.stop(ctx.currentTime + 1);
  },
  doorbell: (ctx) => {
    [523.25, 392].forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.frequency.value = freq;
      osc.type = 'sine';
      const start = ctx.currentTime + i * 0.3;
      gain.gain.setValueAtTime(0.5, start);
      gain.gain.exponentialRampToValueAtTime(0.01, start + 0.3);
      osc.start(start);
      osc.stop(start + 0.3);
    });
  },
  alarm: (ctx) => {
    [0, 0.15, 0.3].forEach((delay) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.frequency.value = 1000;
      osc.type = 'square';
      const start = ctx.currentTime + delay;
      gain.gain.setValueAtTime(0.3, start);
      gain.gain.setValueAtTime(0, start + 0.1);
      osc.start(start);
      osc.stop(start + 0.1);
    });
  },
  notification: (ctx) => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.frequency.value = 1318.51;
    osc.type = 'sine';
    gain.gain.setValueAtTime(0.4, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.5);
    osc.start();
    osc.stop(ctx.currentTime + 0.5);
  },
  success: (ctx) => {
    [523.25, 659.25, 783.99, 1046.5].forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.frequency.value = freq;
      osc.type = 'triangle';
      const start = ctx.currentTime + i * 0.1;
      gain.gain.setValueAtTime(0.4, start);
      gain.gain.exponentialRampToValueAtTime(0.01, start + 0.2);
      osc.start(start);
      osc.stop(start + 0.2);
    });
  },
  cash: (ctx) => {
    [1500, 2000, 2500].forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.frequency.value = freq;
      osc.type = 'sine';
      const start = ctx.currentTime + i * 0.05;
      gain.gain.setValueAtTime(0.3, start);
      gain.gain.exponentialRampToValueAtTime(0.01, start + 0.15);
      osc.start(start);
      osc.stop(start + 0.15);
    });
  },
  xylophone: (ctx) => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.frequency.value = 1174.66;
    osc.type = 'triangle';
    gain.gain.setValueAtTime(0.5, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.3);
    osc.start();
    osc.stop(ctx.currentTime + 0.3);
  },
  gong: (ctx) => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.frequency.value = 130.81;
    osc.type = 'sine';
    gain.gain.setValueAtTime(0.6, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 1.5);
    osc.start();
    osc.stop(ctx.currentTime + 1.5);
  },
  triple: (ctx) => {
    [0, 0.2, 0.4].forEach((delay) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.frequency.value = 800;
      osc.type = 'sine';
      const start = ctx.currentTime + delay;
      gain.gain.setValueAtTime(0.4, start);
      gain.gain.exponentialRampToValueAtTime(0.01, start + 0.12);
      osc.start(start);
      osc.stop(start + 0.12);
    });
  }
};

/**
 * Custom hook for playing a continuous alert sound
 * Now supports multiple sound types
 */
export const useKitchenAlert = (soundId: string = 'chime') => {
  const audioContextRef = useRef<AudioContext | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const currentSoundRef = useRef(soundId);

  // Update sound when it changes
  useEffect(() => {
    currentSoundRef.current = soundId;
  }, [soundId]);

  // Initialize AudioContext on first user interaction
  const initAudioContext = useCallback(() => {
    if (!audioContextRef.current) {
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    if (audioContextRef.current.state === 'suspended') {
      audioContextRef.current.resume();
    }
    return audioContextRef.current;
  }, []);

  // Play the selected sound
  const playSound = useCallback(() => {
    const ctx = initAudioContext();
    if (!ctx) return;

    const soundFn = soundLibrary[currentSoundRef.current] || soundLibrary.chime;
    soundFn(ctx);
  }, [initAudioContext]);

  // Start the continuous alert loop
  const startAlert = useCallback(() => {
    if (isPlaying) return;
    
    setIsPlaying(true);
    
    // Play immediately
    playSound();
    
    // Then repeat every 1.2 seconds
    intervalRef.current = setInterval(() => {
      playSound();
    }, 1200);
  }, [isPlaying, playSound]);

  // Stop the alert
  const stopAlert = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    setIsPlaying(false);
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
    };
  }, []);

  return {
    isPlaying,
    startAlert,
    stopAlert,
    initAudioContext,
  };
};

export default useKitchenAlert;
