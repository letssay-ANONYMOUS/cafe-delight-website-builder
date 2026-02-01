import { useRef, useCallback, useEffect, useState } from 'react';

/**
 * Custom hook for playing a continuous, pleasant chime alert
 * Used in the Kitchen Dashboard for new paid orders
 */
export const useKitchenAlert = () => {
  const audioContextRef = useRef<AudioContext | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  // Initialize AudioContext on first user interaction
  const initAudioContext = useCallback(() => {
    if (!audioContextRef.current) {
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    // Resume if suspended (browser autoplay policy)
    if (audioContextRef.current.state === 'suspended') {
      audioContextRef.current.resume();
    }
    return audioContextRef.current;
  }, []);

  // Play a single chime arpeggio (C5 -> E5 -> G5)
  const playChime = useCallback(() => {
    const ctx = initAudioContext();
    if (!ctx) return;

    const notes = [523.25, 659.25, 783.99]; // C5, E5, G5
    const noteLength = 0.15;
    const volume = 0.5;

    notes.forEach((freq, index) => {
      const startTime = ctx.currentTime + index * noteLength;
      
      const oscillator = ctx.createOscillator();
      const gainNode = ctx.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(ctx.destination);
      
      oscillator.frequency.value = freq;
      oscillator.type = 'sine';
      
      // Envelope for pleasant sound
      gainNode.gain.setValueAtTime(0, startTime);
      gainNode.gain.linearRampToValueAtTime(volume, startTime + 0.02);
      gainNode.gain.exponentialRampToValueAtTime(0.01, startTime + noteLength);
      
      oscillator.start(startTime);
      oscillator.stop(startTime + noteLength);
    });
  }, [initAudioContext]);

  // Start the continuous alert loop
  const startAlert = useCallback(() => {
    if (isPlaying) return;
    
    setIsPlaying(true);
    
    // Play immediately
    playChime();
    
    // Then repeat every 1.2 seconds
    intervalRef.current = setInterval(() => {
      playChime();
    }, 1200);
  }, [isPlaying, playChime]);

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
    initAudioContext, // Call on first user interaction to enable audio
  };
};

export default useKitchenAlert;
