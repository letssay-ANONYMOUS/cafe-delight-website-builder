import { useEffect, useRef, useCallback } from 'react';
import { useLocation } from 'react-router-dom';
import { useAnalytics } from '@/hooks/useAnalytics';
import { useSession } from '@/hooks/useSession';
import { useEssentialTracking } from '@/hooks/useEssentialTracking';
import { useCookieConsent } from '@/components/CookieConsent';
import { supabase } from '@/integrations/supabase/client';
import { getVisitorId } from '@/hooks/useVisitorId';
import { getSessionId } from '@/hooks/useSession';

/**
 * Component that automatically tracks page views on route changes
 * Essential tracking runs for all visitors
 * Enhanced analytics only tracks if user has consented to analytics cookies
 */
const PageViewTracker = () => {
  const location = useLocation();
  const { trackPageView } = useAnalytics();
  const { sessionInfo, incrementPagesViewed } = useSession();
  const consent = useCookieConsent();
  
  // Initialize essential tracking (no consent needed)
  useEssentialTracking();

  // Refs for engagement tracking
  const scrollDepthRef = useRef(0);
  const engagementStartRef = useRef(Date.now());
  const isVisibleRef = useRef(true);
  const totalEngagementTimeRef = useRef(0);

  // Track scroll depth
  const updateScrollDepth = useCallback(() => {
    if (!consent?.analytics) return;
    
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const scrollPercent = docHeight > 0 ? Math.round((scrollTop / docHeight) * 100) : 0;
    
    if (scrollPercent > scrollDepthRef.current) {
      scrollDepthRef.current = scrollPercent;
    }
  }, [consent?.analytics]);

  // Handle visibility change for accurate engagement time
  const handleVisibilityChange = useCallback(() => {
    if (!consent?.analytics) return;
    
    if (document.hidden) {
      // Page became hidden - add elapsed time
      totalEngagementTimeRef.current += Date.now() - engagementStartRef.current;
      isVisibleRef.current = false;
    } else {
      // Page became visible - reset start time
      engagementStartRef.current = Date.now();
      isVisibleRef.current = true;
    }
  }, [consent?.analytics]);

  // Save engagement data before page unload or navigation
  const saveEngagementData = useCallback(async (pagePath: string) => {
    if (!consent?.analytics) return;
    
    // Calculate final engagement time
    if (isVisibleRef.current) {
      totalEngagementTimeRef.current += Date.now() - engagementStartRef.current;
    }
    
    const visitorId = getVisitorId();
    const engagementTime = Math.floor(totalEngagementTimeRef.current / 1000);
    const scrollDepth = scrollDepthRef.current;

    if (engagementTime > 0 || scrollDepth > 0) {
      try {
        // Update the most recent page view with engagement data
        await supabase
          .from('page_views')
          .update({ 
            engagement_time: engagementTime,
            scroll_depth: scrollDepth
          })
          .eq('visitor_id', visitorId)
          .eq('page_path', pagePath)
          .order('viewed_at', { ascending: false })
          .limit(1);
      } catch (err) {
        console.error('Failed to save engagement data:', err);
      }
    }
  }, [consent?.analytics]);

  // Track clicks (for consented users)
  const handleClick = useCallback(async (e: MouseEvent) => {
    if (!consent?.analytics) return;
    
    const target = e.target as HTMLElement;
    const selector = target.tagName.toLowerCase() + 
      (target.id ? `#${target.id}` : '') +
      (target.className ? `.${target.className.split(' ').join('.')}` : '');
    
    const elementText = target.textContent?.slice(0, 50) || '';
    const visitorId = getVisitorId();
    const sessionId = getSessionId();
    
    try {
      await supabase
        .from('page_interactions')
        .insert({
          visitor_id: visitorId,
          session_id: sessionId,
          page_path: location.pathname,
          interaction_type: 'click',
          element_selector: selector.slice(0, 100),
          element_text: elementText,
          x_position: e.clientX,
          y_position: e.clientY
        });
    } catch (err) {
      // Silently fail - don't disrupt user experience
    }
  }, [consent?.analytics, location.pathname]);

  // Setup scroll tracking
  useEffect(() => {
    if (!consent?.analytics) return;

    let scrollTimeout: NodeJS.Timeout;
    const throttledScroll = () => {
      clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(updateScrollDepth, 100);
    };

    window.addEventListener('scroll', throttledScroll, { passive: true });
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      window.removeEventListener('scroll', throttledScroll);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      clearTimeout(scrollTimeout);
    };
  }, [consent?.analytics, updateScrollDepth, handleVisibilityChange]);

  // Setup click tracking
  useEffect(() => {
    if (!consent?.analytics) return;

    // Only track clicks on interactive elements
    const handleInteractiveClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const interactive = target.closest('a, button, [role="button"], input, select, textarea');
      if (interactive) {
        handleClick(e);
      }
    };

    document.addEventListener('click', handleInteractiveClick);
    return () => document.removeEventListener('click', handleInteractiveClick);
  }, [consent?.analytics, handleClick]);

  // Track page views on route change
  useEffect(() => {
    const prevPath = scrollDepthRef.current > 0 ? location.pathname : null;
    
    // Save engagement data for previous page
    if (prevPath && consent?.analytics) {
      saveEngagementData(prevPath);
    }

    // Reset engagement tracking for new page
    scrollDepthRef.current = 0;
    engagementStartRef.current = Date.now();
    totalEngagementTimeRef.current = 0;
    isVisibleRef.current = !document.hidden;

    // Track the page view (only if analytics consent)
    trackPageView(location.pathname, document.title);
    
    // Increment pages viewed in session
    if (sessionInfo?.sessionId) {
      incrementPagesViewed(sessionInfo.sessionId);
    }
  }, [location.pathname, trackPageView, sessionInfo, incrementPagesViewed, consent?.analytics, saveEngagementData]);

  // Save on page unload
  useEffect(() => {
    const handleBeforeUnload = () => {
      if (consent?.analytics) {
        // Use sendBeacon for reliability
        const visitorId = getVisitorId();
        const engagementTime = isVisibleRef.current 
          ? Math.floor((totalEngagementTimeRef.current + (Date.now() - engagementStartRef.current)) / 1000)
          : Math.floor(totalEngagementTimeRef.current / 1000);
        
        // Best effort save via beacon
        navigator.sendBeacon?.(
          `${import.meta.env.VITE_SUPABASE_URL}/rest/v1/page_views?visitor_id=eq.${visitorId}&page_path=eq.${encodeURIComponent(location.pathname)}&order=viewed_at.desc&limit=1`,
          JSON.stringify({ engagement_time: engagementTime, scroll_depth: scrollDepthRef.current })
        );
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [consent?.analytics, location.pathname]);

  // This component doesn't render anything
  return null;
};

export default PageViewTracker;
