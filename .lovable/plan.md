
# GA4 Analytics Dashboard Integration

## Overview
You can absolutely have your `/visitors` page pull data from Google Analytics while ALSO keeping data in the Google Analytics dashboard. Both will show the same data - GA stores it, and we fetch it to display in your custom dashboard.

---

## How It Works

```text
┌──────────────────────────────────────────────────────────────────┐
│                     User visits your site                        │
└───────────────────────────┬──────────────────────────────────────┘
                            │
                            ▼
┌──────────────────────────────────────────────────────────────────┐
│              Google Analytics 4 (G-B286Z05ZBM)                   │
│                    Stores ALL the data                           │
└───────────────────────────┬──────────────────────────────────────┘
                            │
            ┌───────────────┴───────────────┐
            │                               │
            ▼                               ▼
┌───────────────────────┐       ┌───────────────────────┐
│  Google Analytics     │       │  Your /visitors page  │
│  Dashboard (web)      │       │  (fetches via API)    │
│  analytics.google.com │       │  Custom Nawa design   │
└───────────────────────┘       └───────────────────────┘
```

---

## What You'll Get

| Feature | Google Dashboard | Your /visitors Page |
|---------|-----------------|---------------------|
| Page views | Yes | Yes |
| Sessions | Yes | Yes |
| Bounce rate | Yes | Yes |
| Active users | Yes (real-time) | Yes (via API) |
| Device breakdown | Yes | Yes |
| Top pages | Yes | Yes |
| Custom cafe branding | No | Yes |
| Order conversion data | No | Yes (from your orders table) |

---

## Requirements

Before I can implement this, you'll need:

### 1. GA4 Property ID (Not Measurement ID)
- Your Measurement ID is `G-B286Z05ZBM`
- You also need the **Property ID** (a number like `123456789`)
- Find it: GA Admin → Property Settings → Property ID

### 2. Service Account for API Access
Since this is a staff-only dashboard, we'll use a service account:
1. Go to Google Cloud Console
2. Create a Service Account
3. Download the JSON key
4. Add the service account email as a "Viewer" in your GA Property

### 3. Store Credentials Securely
The JSON key will be stored as a secret in your backend

---

## Implementation Plan

### Step 1: Create Backend Function
A new edge function `ga-analytics` that:
- Authenticates with Google using service account
- Calls GA4 Data API to fetch metrics
- Returns data to your dashboard

### Step 2: Update /visitors Dashboard
Modify `src/pages/AnalyticsDashboard.tsx` to:
- Fetch from the new edge function instead of database tables
- Keep orders data from your database (for conversion tracking)
- Remove dependencies on old tracking tables

### Step 3: Remove Old Tracking
Delete the old tracking system:
- `PageViewTracker.tsx`
- `useAnalytics.ts`
- `useEssentialTracking.ts`
- `track-visitor` edge function

### Step 4: Keep Essential Data
Keep these for cart/orders:
- `useVisitorId.ts` (for cart persistence)
- `orders` table queries (for conversion)

---

## Technical Details

### Edge Function: `supabase/functions/ga-analytics/index.ts`
```typescript
// Calls GA4 Data API with service account
// Endpoint: POST /ga-analytics
// Body: { dateRange: 'today' | '7days' | '30days' }
// Returns: { sessions, pageViews, bounceRate, topPages, devices }
```

### Dashboard Updates
- Replace Supabase queries with edge function calls
- Merge GA data with order conversion data from orders table
- Maintain existing UI components (charts, tables)

---

## Next Steps

To proceed, I need:
1. **Your GA4 Property ID** (not the G-B286Z05ZBM, but the numeric ID)
2. **Confirmation** that you can create a service account in Google Cloud

Would you like me to proceed once you have these? Or would you prefer a simpler approach where I just clean up the old tracking and you use the Google Analytics website directly for analytics?
