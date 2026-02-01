import { useLocation } from 'react-router-dom';
import { CookieConsent } from './CookieConsent';

// Routes where cookie consent should NOT be shown
const EXCLUDED_PATHS = [
  '/admin',
  '/staff',
  '/visitors',
];

export const RouteAwareCookieConsent = () => {
  const location = useLocation();
  
  // Check if current path starts with any excluded path
  const shouldHide = EXCLUDED_PATHS.some(path => 
    location.pathname.startsWith(path)
  );
  
  if (shouldHide) {
    return null;
  }
  
  return <CookieConsent />;
};

export default RouteAwareCookieConsent;
