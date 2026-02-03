
# Google Analytics Integration

## Overview
This plan integrates Google Analytics 4 (GA4) with your Nawa Cafe project, respecting the existing cookie consent system and route exclusion policies.

---

## What Will Change

### 1. Add GA4 Script to index.html
Insert the Google Analytics gtag.js snippet in the `<head>` section, but configured to **not send data initially** (consent-aware loading).

### 2. Create GoogleAnalytics Component
A new React component that:
- Listens to cookie consent status
- Only activates GA tracking when user accepts "analytics" cookies
- Sends page views on route changes
- Respects the same route exclusions as your existing tracking (no GA on `/admin`, `/staff`, `/visitors`)

### 3. Consent-Aware Activation
- If user clicks "Accept All" - GA starts tracking immediately
- If user clicks "Essential Only" or declines - GA stays disabled
- If user previously consented - GA activates on page load

---

## Technical Implementation

### File Changes

| File | Change |
|------|--------|
| `index.html` | Add gtag.js script with consent mode |
| `src/components/GoogleAnalytics.tsx` | New component for consent-aware GA |
| `src/App.tsx` | Import and add GoogleAnalytics component |

---

## Technical Details

### index.html Changes
```html
<!-- Google tag (gtag.js) -->
<script async src="https://www.googletagmanager.com/gtag/js?id=G-B286Z05ZBM"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  // Default to denied - will be updated by React consent component
  gtag('consent', 'default', {
    'analytics_storage': 'denied'
  });
  gtag('config', 'G-B286Z05ZBM');
</script>
```

### GoogleAnalytics.tsx Component
```typescript
// Key functionality:
// 1. Check useCookieConsent() for analytics permission
// 2. If granted: gtag('consent', 'update', {'analytics_storage': 'granted'})
// 3. Track page views on route changes via gtag('event', 'page_view', {...})
// 4. Skip tracking on excluded routes (/admin, /staff, /visitors)
```

### App.tsx Addition
```typescript
import GoogleAnalytics from "@/components/GoogleAnalytics";
// ...
<BrowserRouter>
  <GoogleAnalytics />  {/* Add here */}
  <PageViewTracker />
  {/* ... rest of routes */}
</BrowserRouter>
```

---

## Privacy Compliance

- **Default Denied**: GA loads but doesn't track until consent is given
- **Route Exclusions**: Same as your existing system - no tracking on admin/staff/analytics pages
- **Consent Memory**: Respects the existing `nawa_cookie_consent` localStorage key
- **Cookie Banner**: Works with your existing "Accept All" / "Essential Only" buttons - no changes needed

---

## Result
- GA4 will track customer-facing pages (home, menu, cart, checkout, etc.)
- Staff pages remain private
- Full GDPR/cookie compliance with your existing consent system
- Your Measurement ID: `G-B286Z05ZBM`
