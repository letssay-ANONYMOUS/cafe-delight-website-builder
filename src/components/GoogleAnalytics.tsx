import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { useCookieConsent } from './CookieConsent';

declare global {
  interface Window {
    gtag: (...args: unknown[]) => void;
    dataLayer: unknown[];
  }
}

const GA_MEASUREMENT_ID = 'G-B286Z05ZBM';

// Routes where GA tracking should be disabled (staff/admin pages)
const EXCLUDED_ROUTES = ['/admin', '/staff', '/visitors'];

const isExcludedRoute = (pathname: string): boolean => {
  return EXCLUDED_ROUTES.some(route => pathname.startsWith(route));
};

const GoogleAnalytics = () => {
  const location = useLocation();
  const consent = useCookieConsent();
  const hasGrantedConsent = useRef(false);

  // Update consent status when user accepts analytics cookies
  useEffect(() => {
    if (consent?.analytics && !hasGrantedConsent.current) {
      // User has granted analytics consent
      window.gtag?.('consent', 'update', {
        'analytics_storage': 'granted'
      });
      hasGrantedConsent.current = true;
    }
  }, [consent?.analytics]);

  // Track page views on route changes (only if consent granted and not excluded route)
  useEffect(() => {
    if (!consent?.analytics) return;
    if (isExcludedRoute(location.pathname)) return;

    // Send page view to GA
    window.gtag?.('event', 'page_view', {
      page_path: location.pathname + location.search,
      page_title: document.title,
      page_location: window.location.href,
    });
  }, [location.pathname, location.search, consent?.analytics]);

  // This component doesn't render anything
  return null;
};

export default GoogleAnalytics;
