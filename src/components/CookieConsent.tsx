import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Cookie, X } from 'lucide-react';

const COOKIE_CONSENT_KEY = 'nawa_cookie_consent';

type ConsentStatus = 'pending' | 'accepted' | 'declined';

interface CookiePreferences {
  essential: boolean; // Always true - required for site to function
  analytics: boolean; // Optional - for tracking/analytics
  marketing: boolean; // Optional - for marketing purposes
}

export const CookieConsent = () => {
  const [showBanner, setShowBanner] = useState(false);
  const [showDetails, setShowDetails] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem(COOKIE_CONSENT_KEY);
    if (!consent) {
      // Show banner after a short delay for better UX
      const timer = setTimeout(() => setShowBanner(true), 1000);
      return () => clearTimeout(timer);
    }
  }, []);

  const saveConsent = (preferences: CookiePreferences) => {
    const consentData = {
      ...preferences,
      timestamp: new Date().toISOString(),
      version: '1.0',
    };
    localStorage.setItem(COOKIE_CONSENT_KEY, JSON.stringify(consentData));
    setShowBanner(false);
  };

  const handleAcceptAll = () => {
    saveConsent({
      essential: true,
      analytics: true,
      marketing: true,
    });
  };

  const handleAcceptEssential = () => {
    saveConsent({
      essential: true,
      analytics: false,
      marketing: false,
    });
  };

  const handleDecline = () => {
    // Still save essential cookies (required for site function)
    saveConsent({
      essential: true,
      analytics: false,
      marketing: false,
    });
  };

  if (!showBanner) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 p-4 animate-in slide-in-from-bottom-5 duration-300">
      <div className="max-w-4xl mx-auto bg-card border border-border rounded-lg shadow-lg p-4 md:p-6">
        <div className="flex items-start gap-4">
          <div className="hidden sm:flex items-center justify-center w-10 h-10 rounded-full bg-primary/10 flex-shrink-0">
            <Cookie className="w-5 h-5 text-primary" />
          </div>
          
          <div className="flex-1">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-semibold text-foreground">Cookie Preferences</h3>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 -mr-2"
                onClick={handleDecline}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            
            <p className="text-sm text-muted-foreground mb-4">
              We use cookies to enhance your experience, save your cart, and analyze site traffic. 
              Your visitor ID helps us remember your preferences across sessions.
            </p>

            {showDetails && (
              <div className="mb-4 p-3 bg-muted rounded-md space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="font-medium">Essential Cookies</span>
                  <span className="text-muted-foreground">Always Active</span>
                </div>
                <p className="text-muted-foreground text-xs">
                  Required for the website to function. Includes your visitor ID and cart data.
                </p>
                <div className="flex justify-between mt-2">
                  <span className="font-medium">Analytics Cookies</span>
                  <span className="text-muted-foreground">Optional</span>
                </div>
                <p className="text-muted-foreground text-xs">
                  Help us understand how visitors interact with our website.
                </p>
              </div>
            )}
            
            <div className="flex flex-wrap gap-2 items-center">
              <Button 
                onClick={handleAcceptAll}
                size="sm"
                className="bg-primary hover:bg-primary/90"
              >
                Accept All
              </Button>
              <Button 
                onClick={handleAcceptEssential}
                variant="outline"
                size="sm"
              >
                Essential Only
              </Button>
              <Button
                onClick={() => setShowDetails(!showDetails)}
                variant="ghost"
                size="sm"
                className="text-muted-foreground"
              >
                {showDetails ? 'Hide Details' : 'Cookie Details'}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

/**
 * Hook to check cookie consent status
 */
export const useCookieConsent = () => {
  const [consent, setConsent] = useState<CookiePreferences | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem(COOKIE_CONSENT_KEY);
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        setConsent({
          essential: parsed.essential ?? true,
          analytics: parsed.analytics ?? false,
          marketing: parsed.marketing ?? false,
        });
      } catch {
        setConsent({ essential: true, analytics: false, marketing: false });
      }
    }
  }, []);

  return consent;
};

export default CookieConsent;
