import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useAnalytics } from '@/hooks/useAnalytics';
import { useSession } from '@/hooks/useSession';

/**
 * Component that automatically tracks page views on route changes
 * Only tracks if user has consented to analytics cookies
 */
const PageViewTracker = () => {
  const location = useLocation();
  const { trackPageView } = useAnalytics();
  const { sessionInfo, incrementPagesViewed } = useSession();

  useEffect(() => {
    // Track the page view
    trackPageView(location.pathname, document.title);
    
    // Increment pages viewed in session
    if (sessionInfo?.sessionId) {
      incrementPagesViewed(sessionInfo.sessionId);
    }
  }, [location.pathname, trackPageView, sessionInfo, incrementPagesViewed]);

  // This component doesn't render anything
  return null;
};

export default PageViewTracker;
