import { useState, useEffect, useCallback } from 'react';

const FINGERPRINT_KEY = 'nawa_device_fp';

/**
 * Generate a simple hash from a string
 */
const simpleHash = async (str: string): Promise<string> => {
  const encoder = new TextEncoder();
  const data = encoder.encode(str);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
};

/**
 * Get canvas fingerprint
 */
const getCanvasFingerprint = (): string => {
  try {
    const canvas = document.createElement('canvas');
    canvas.width = 200;
    canvas.height = 50;
    const ctx = canvas.getContext('2d');
    if (!ctx) return '';
    
    // Draw text with specific styles
    ctx.textBaseline = 'top';
    ctx.font = '14px Arial';
    ctx.fillStyle = '#f60';
    ctx.fillRect(125, 1, 62, 20);
    ctx.fillStyle = '#069';
    ctx.fillText('Nawa Fingerprint', 2, 15);
    ctx.fillStyle = 'rgba(102, 204, 0, 0.7)';
    ctx.fillText('Canvas Test', 4, 17);
    
    return canvas.toDataURL();
  } catch {
    return '';
  }
};

/**
 * Get WebGL fingerprint
 */
const getWebGLFingerprint = (): string => {
  try {
    const canvas = document.createElement('canvas');
    const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
    if (!gl) return '';
    
    const debugInfo = (gl as WebGLRenderingContext).getExtension('WEBGL_debug_renderer_info');
    if (!debugInfo) return '';
    
    const vendor = (gl as WebGLRenderingContext).getParameter(debugInfo.UNMASKED_VENDOR_WEBGL);
    const renderer = (gl as WebGLRenderingContext).getParameter(debugInfo.UNMASKED_RENDERER_WEBGL);
    
    return `${vendor}~${renderer}`;
  } catch {
    return '';
  }
};

/**
 * Get audio context fingerprint
 */
const getAudioFingerprint = (): Promise<string> => {
  return new Promise((resolve) => {
    try {
      const AudioContext = window.AudioContext || (window as unknown as { webkitAudioContext: typeof window.AudioContext }).webkitAudioContext;
      if (!AudioContext) {
        resolve('');
        return;
      }
      
      const context = new AudioContext();
      const oscillator = context.createOscillator();
      const analyser = context.createAnalyser();
      const gain = context.createGain();
      const script = context.createScriptProcessor(4096, 1, 1);
      
      oscillator.type = 'triangle';
      oscillator.frequency.setValueAtTime(10000, context.currentTime);
      
      gain.gain.setValueAtTime(0, context.currentTime);
      
      oscillator.connect(analyser);
      analyser.connect(script);
      script.connect(gain);
      gain.connect(context.destination);
      
      oscillator.start(0);
      
      // Cleanup after brief sampling
      setTimeout(() => {
        oscillator.stop();
        context.close();
        resolve(context.sampleRate.toString());
      }, 50);
    } catch {
      resolve('');
    }
  });
};

/**
 * Get browser info
 */
export const getBrowserInfo = (): { browser: string; version: string; os: string } => {
  const ua = navigator.userAgent;
  let browser = 'Unknown';
  let version = '';
  let os = 'Unknown';
  
  // Detect browser
  if (ua.includes('Firefox/')) {
    browser = 'Firefox';
    version = ua.match(/Firefox\/(\d+(\.\d+)?)/)?.[1] || '';
  } else if (ua.includes('Edg/')) {
    browser = 'Edge';
    version = ua.match(/Edg\/(\d+(\.\d+)?)/)?.[1] || '';
  } else if (ua.includes('Chrome/')) {
    browser = 'Chrome';
    version = ua.match(/Chrome\/(\d+(\.\d+)?)/)?.[1] || '';
  } else if (ua.includes('Safari/') && !ua.includes('Chrome')) {
    browser = 'Safari';
    version = ua.match(/Version\/(\d+(\.\d+)?)/)?.[1] || '';
  }
  
  // Detect OS
  if (ua.includes('Windows')) os = 'Windows';
  else if (ua.includes('Mac OS')) os = 'macOS';
  else if (ua.includes('Linux')) os = 'Linux';
  else if (ua.includes('Android')) os = 'Android';
  else if (ua.includes('iPhone') || ua.includes('iPad')) os = 'iOS';
  
  return { browser, version, os };
};

/**
 * Get device type
 */
export const getDeviceType = (): string => {
  const ua = navigator.userAgent;
  if (/tablet|ipad|playbook|silk/i.test(ua)) return 'tablet';
  if (/mobile|iphone|ipod|android|blackberry|mini|windows\sce|palm/i.test(ua)) return 'mobile';
  return 'desktop';
};

/**
 * Generate device fingerprint
 */
export const generateFingerprint = async (): Promise<string> => {
  const components: string[] = [];
  
  // Screen info
  components.push(`${screen.width}x${screen.height}x${screen.colorDepth}`);
  
  // Timezone
  components.push(Intl.DateTimeFormat().resolvedOptions().timeZone);
  
  // Language
  components.push(navigator.language);
  
  // Platform
  components.push(navigator.platform);
  
  // Canvas
  components.push(getCanvasFingerprint());
  
  // WebGL
  components.push(getWebGLFingerprint());
  
  // Audio
  const audioFp = await getAudioFingerprint();
  components.push(audioFp);
  
  // Hardware concurrency
  components.push(String(navigator.hardwareConcurrency || 0));
  
  // Device memory (if available)
  const nav = navigator as unknown as { deviceMemory?: number };
  components.push(String(nav.deviceMemory || 0));
  
  // Touch support
  components.push(String('ontouchstart' in window));
  
  // Create hash
  const combined = components.join('|');
  return simpleHash(combined);
};

/**
 * Hook to get or generate device fingerprint
 */
export const useFingerprint = () => {
  const [fingerprint, setFingerprint] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);

  const getFingerprint = useCallback(async () => {
    // Check cache first
    const cached = localStorage.getItem(FINGERPRINT_KEY);
    if (cached) {
      setFingerprint(cached);
      setIsLoading(false);
      return cached;
    }

    // Generate new fingerprint
    try {
      const fp = await generateFingerprint();
      localStorage.setItem(FINGERPRINT_KEY, fp);
      setFingerprint(fp);
      setIsLoading(false);
      return fp;
    } catch (error) {
      console.error('Failed to generate fingerprint:', error);
      setIsLoading(false);
      return '';
    }
  }, []);

  useEffect(() => {
    getFingerprint();
  }, [getFingerprint]);

  return { fingerprint, isLoading, getFingerprint };
};

/**
 * Get fingerprint synchronously from cache
 */
export const getCachedFingerprint = (): string | null => {
  return localStorage.getItem(FINGERPRINT_KEY);
};

export default useFingerprint;
