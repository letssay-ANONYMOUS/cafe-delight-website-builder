import { useEffect, useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { getVisitorId } from '@/hooks/useVisitorId';

const SESSION_STORAGE_KEY = 'nawa_session_id';

interface SessionInfo {
  sessionId: string;
  visitorId: string;
  deviceType: string;
  browser: string;
}

/**
 * Detect device type from user agent
 */
const getDeviceType = (): string => {
  const ua = navigator.userAgent;
  if (/tablet|ipad|playbook|silk/i.test(ua)) return 'tablet';
  if (/mobile|iphone|ipod|android|blackberry|opera mini|iemobile/i.test(ua)) return 'mobile';
  return 'desktop';
};

/**
 * Detect browser from user agent
 */
const getBrowser = (): string => {
  const ua = navigator.userAgent;
  if (ua.includes('Firefox')) return 'Firefox';
  if (ua.includes('SamsungBrowser')) return 'Samsung Browser';
  if (ua.includes('Opera') || ua.includes('OPR')) return 'Opera';
  if (ua.includes('Edge')) return 'Edge';
  if (ua.includes('Chrome')) return 'Chrome';
  if (ua.includes('Safari')) return 'Safari';
  return 'Unknown';
};

/**
 * Hook to manage anonymous visitor sessions
 */
export const useSession = () => {
  const [sessionInfo, setSessionInfo] = useState<SessionInfo | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const createSession = useCallback(async (visitorId: string): Promise<string | null> => {
    try {
      const deviceType = getDeviceType();
      const browser = getBrowser();
      const referrer = document.referrer || null;
      const landingPage = window.location.pathname;

      const { data, error } = await supabase
        .from('visitor_sessions')
        .insert({
          visitor_id: visitorId,
          device_type: deviceType,
          browser: browser,
          referrer: referrer,
          landing_page: landingPage,
          pages_viewed: 1
        })
        .select('id')
        .single();

      if (error) {
        console.error('Failed to create session:', error);
        return null;
      }

      const sessionId = data.id;
      sessionStorage.setItem(SESSION_STORAGE_KEY, sessionId);
      return sessionId;
    } catch (err) {
      console.error('Session creation error:', err);
      return null;
    }
  }, []);

  const updateSessionEnd = useCallback(async (sessionId: string) => {
    try {
      await supabase
        .from('visitor_sessions')
        .update({ session_end: new Date().toISOString() })
        .eq('id', sessionId);
    } catch (err) {
      console.error('Failed to update session end:', err);
    }
  }, []);

  const incrementPagesViewed = useCallback(async (sessionId: string) => {
    try {
      // Get current count and increment
      const { data } = await supabase
        .from('visitor_sessions')
        .select('pages_viewed')
        .eq('id', sessionId)
        .single();

      if (data) {
        await supabase
          .from('visitor_sessions')
          .update({ pages_viewed: (data.pages_viewed || 0) + 1 })
          .eq('id', sessionId);
      }
    } catch (err) {
      console.error('Failed to increment pages viewed:', err);
    }
  }, []);

  useEffect(() => {
    const initSession = async () => {
      const visitorId = getVisitorId();
      const existingSessionId = sessionStorage.getItem(SESSION_STORAGE_KEY);

      if (existingSessionId) {
        // Session already exists for this tab
        setSessionInfo({
          sessionId: existingSessionId,
          visitorId,
          deviceType: getDeviceType(),
          browser: getBrowser()
        });
        setIsLoading(false);
        return;
      }

      // Create new session
      const newSessionId = await createSession(visitorId);
      if (newSessionId) {
        setSessionInfo({
          sessionId: newSessionId,
          visitorId,
          deviceType: getDeviceType(),
          browser: getBrowser()
        });
      }
      setIsLoading(false);
    };

    initSession();

    // Update session end time when tab closes
    const handleBeforeUnload = () => {
      const sessionId = sessionStorage.getItem(SESSION_STORAGE_KEY);
      if (sessionId) {
        // Use sendBeacon for reliable delivery on page unload
        const url = `${import.meta.env.VITE_SUPABASE_URL}/rest/v1/visitor_sessions?id=eq.${sessionId}`;
        const body = JSON.stringify({ session_end: new Date().toISOString() });
        navigator.sendBeacon(url, body);
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [createSession]);

  return {
    sessionInfo,
    isLoading,
    incrementPagesViewed,
    updateSessionEnd
  };
};

export const getSessionId = (): string | null => {
  return sessionStorage.getItem(SESSION_STORAGE_KEY);
};
