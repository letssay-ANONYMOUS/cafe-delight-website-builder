
# Fix Analytics Not Working - Consent State Synchronization

## Problem

When you click "Accept All" on the cookie banner, the analytics consent is saved to storage but **Google Analytics never receives the update** until you manually refresh the page.

This happens because the different parts of the app don't communicate with each other when consent changes.

## Solution

Add a simple notification system so that when you click "Accept All", all parts of the app that need to know about analytics consent get updated immediately.

---

## Technical Implementation

### File: `src/components/CookieConsent.tsx`

**Change 1**: Add a custom event constant at the top of the file:
```tsx
const CONSENT_CHANGED_EVENT = 'nawa_consent_changed';
```

**Change 2**: Update `saveConsent` function to dispatch event after saving:
```tsx
const saveConsent = (preferences: CookiePreferences) => {
  const consentData = {
    ...preferences,
    timestamp: new Date().toISOString(),
    version: '1.0',
  };
  localStorage.setItem(COOKIE_CONSENT_KEY, JSON.stringify(consentData));
  
  // NEW: Notify all components that consent has changed
  window.dispatchEvent(new CustomEvent(CONSENT_CHANGED_EVENT, { 
    detail: preferences 
  }));
  
  setShowBanner(false);
};
```

**Change 3**: Update `useCookieConsent` hook to listen for the event:
```tsx
export const useCookieConsent = () => {
  const [consent, setConsent] = useState<CookiePreferences | null>(null);

  useEffect(() => {
    // Load initial consent from storage
    const loadConsent = () => {
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
    };
    
    loadConsent();

    // NEW: Listen for consent changes from the banner
    const handleConsentChange = (event: Event) => {
      const customEvent = event as CustomEvent<CookiePreferences>;
      setConsent(customEvent.detail);
    };

    window.addEventListener(CONSENT_CHANGED_EVENT, handleConsentChange);
    return () => {
      window.removeEventListener(CONSENT_CHANGED_EVENT, handleConsentChange);
    };
  }, []);

  return consent;
};
```

---

## How It Works After Fix

```text
User clicks "Accept All"
       ↓
saveConsent() runs
       ↓
├── Saves to localStorage
└── Dispatches 'nawa_consent_changed' event
       ↓
useCookieConsent() hook receives event
       ↓
Updates state to { analytics: true, ... }
       ↓
GoogleAnalytics component re-renders
       ↓
Calls gtag('consent', 'update', { analytics_storage: 'granted' })
       ↓
GA4 starts tracking immediately!
```

---

## Files to Modify

| File | Changes |
|------|---------|
| `src/components/CookieConsent.tsx` | Add event constant, dispatch in `saveConsent`, update hook to listen |

---

## Verification Steps

After implementation:
1. Open the site in an incognito window (to get fresh consent state)
2. Open browser DevTools → Network tab
3. Filter by "google" or "analytics"
4. Click "Accept All" on the cookie banner
5. You should see GA requests start appearing immediately without needing to refresh
