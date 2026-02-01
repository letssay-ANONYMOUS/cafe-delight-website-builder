import { useEffect, useRef, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { getVisitorId } from '@/hooks/useVisitorId';
import { generateFingerprint, getBrowserInfo, getDeviceType } from '@/hooks/useFingerprint';

const TRACKING_DONE_KEY = 'nawa_essential_tracked';
const TRACK_INTERVAL = 1000 * 60 * 5; // 5 minutes

/**
 * Hook for essential tracking that runs without consent
 * Tracks: fingerprint, browser, device, IP (via edge function)
 */
export const useEssentialTracking = () => {
  const hasTracked = useRef(false);

  const trackVisitor = useCallback(async () => {
    const visitorId = getVisitorId();
    if (!visitorId) return;

    // Check if we've tracked recently
    const lastTracked = localStorage.getItem(TRACKING_DONE_KEY);
    if (lastTracked) {
      const elapsed = Date.now() - parseInt(lastTracked, 10);
      if (elapsed < TRACK_INTERVAL) {
        console.log('Essential tracking: skipped (tracked recently)');
        return;
      }
    }

    try {
      // Generate fingerprint
      const fingerprint = await generateFingerprint();
      
      // Get browser info
      const { browser, version, os } = getBrowserInfo();
      
      // Get device type
      const deviceType = getDeviceType();
      
      // Get screen resolution
      const screenResolution = `${screen.width}x${screen.height}`;
      
      // Get timezone
      const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

      console.log('Essential tracking: sending data to edge function');

      // Call edge function to capture IP and store data
      const { data, error } = await supabase.functions.invoke('track-visitor', {
        body: {
          visitor_id: visitorId,
          fingerprint,
          browser,
          browser_version: version,
          os,
          device_type: deviceType,
          screen_resolution: screenResolution,
          timezone
        }
      });

      if (error) {
        console.error('Essential tracking error:', error);
        return;
      }

      console.log('Essential tracking: success', data);
      
      // Mark as tracked
      localStorage.setItem(TRACKING_DONE_KEY, String(Date.now()));
    } catch (error) {
      console.error('Essential tracking failed:', error);
    }
  }, []);

  useEffect(() => {
    if (hasTracked.current) return;
    hasTracked.current = true;
    
    // Small delay to not block initial render
    const timeout = setTimeout(() => {
      trackVisitor();
    }, 1000);

    return () => clearTimeout(timeout);
  }, [trackVisitor]);

  return { trackVisitor };
};

export default useEssentialTracking;
