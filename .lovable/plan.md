

# Enhanced Visitor Tracking + Real-Time Analytics Dashboard

## Overview

This plan implements two major features:
1. **Two-tier tracking system** - Essential (no consent) + Analytics (with consent)
2. **Full Analytics Dashboard** - Password-protected page at `/visitors` with real-time data, charts, and comprehensive visitor insights

---

## Part 1: Enhanced Tracking System

### Without Consent (Essential/Anonymous)

| Feature | Description | How It Works |
|---------|-------------|--------------|
| Browser Fingerprint | Unique device signature | Canvas + audio + screen + WebGL hash |
| Browser Type | Browser name and version | User agent parsing |
| IP Address | Visitor's IP for geolocation | Captured via backend function |
| Basic Interactions | Click/scroll activity counts | Aggregate page engagement |

### With Consent (Analytics)

| Feature | Description | How It Works |
|---------|-------------|--------------|
| Full Session Journey | Every page in sequence | Enhanced page view tracking |
| Time on Each Page | Accurate seconds spent | Page Visibility API |
| Scroll Depth | How far they scrolled | Percentage (25/50/75/100%) |
| Click Heatmap Data | What they clicked on | Element + coordinates |

---

## Part 2: Full Analytics Dashboard

### Route: `/visitors`
A password-protected comprehensive analytics dashboard with real-time updates.

### Dashboard Sections:

#### 1. Overview Cards (Top Row)
| Metric | Description |
|--------|-------------|
| Active Visitors | Currently on site (real-time) |
| Today's Sessions | Total sessions today |
| Total Page Views | Pages viewed today |
| Avg. Session Duration | Average time spent |
| Bounce Rate | Single-page sessions % |
| Conversion Rate | Checkout completions % |

#### 2. Real-Time Activity Feed
| Column | Data |
|--------|------|
| Visitor ID | Short ID (last 8 chars) |
| Device | Mobile/Desktop/Tablet icon |
| Browser | Chrome/Safari/Firefox |
| Current Page | Where they are now |
| Country | Flag + country code |
| Status | Active (green) / Idle (yellow) |

#### 3. Charts and Visualizations
| Chart | Purpose |
|-------|---------|
| Visitors Over Time | Line chart - hourly/daily visitors |
| Device Breakdown | Pie chart - mobile vs desktop |
| Top Pages | Bar chart - most viewed pages |
| Traffic Sources | Pie chart - direct/google/social |
| Geographic Map | Where visitors come from |

#### 4. Menu Item Analytics
| Metric | Description |
|--------|-------------|
| Most Viewed Items | Top menu items by views |
| Add-to-Cart Rate | Views to cart conversion |
| Popular Categories | Which menu sections perform best |

#### 5. Conversion Funnel
```text
Page Views → Menu Views → Add to Cart → Checkout Started → Order Complete
```
Visual funnel showing drop-off at each stage.

#### 6. Data Table (Bottom)
Detailed table with filtering/sorting:
- All visitor sessions
- Expandable rows for page journey
- Export to CSV option

### Dashboard Features:
- **Real-time updates** via Supabase Realtime subscriptions
- **Date range picker** - today, 7 days, 30 days, custom
- **Manual refresh button**
- **Auto-refresh toggle** (every 30 seconds)
- Password protected (same as kitchen)

---

## Database Changes

### New Table: `anonymous_visitors`
Essential tracking data (no consent required):

| Column | Type | Purpose |
|--------|------|---------|
| id | uuid | Primary key |
| visitor_id | text | Links to nawa_visitor_id |
| fingerprint | text | Device fingerprint hash |
| ip_address | text | From request headers |
| country | text | Optional geolocation |
| city | text | Optional geolocation |
| browser | text | Browser name |
| browser_version | text | Version string |
| os | text | Operating system |
| device_type | text | mobile/tablet/desktop |
| screen_resolution | text | Width x Height |
| timezone | text | Visitor timezone |
| created_at | timestamp | First seen |
| last_seen_at | timestamp | Most recent activity |

### New Table: `page_interactions`
Detailed interaction log (consent required):

| Column | Type | Purpose |
|--------|------|---------|
| id | uuid | Primary key |
| visitor_id | text | Visitor identifier |
| session_id | uuid | Current session |
| page_path | text | Which page |
| interaction_type | text | click/scroll |
| element_selector | text | CSS selector of element |
| element_text | text | Button/link text |
| x_position | integer | Click X coordinate |
| y_position | integer | Click Y coordinate |
| scroll_depth | integer | Max scroll percentage |
| created_at | timestamp | When it happened |

### Updated Table: `page_views`
Add engagement columns:

| New Column | Type | Purpose |
|------------|------|---------|
| scroll_depth | integer | Max scroll (0-100) |
| engagement_time | integer | Active time in seconds |

### Enable Realtime
```text
ALTER PUBLICATION supabase_realtime ADD TABLE public.visitor_sessions;
ALTER PUBLICATION supabase_realtime ADD TABLE public.page_views;
ALTER PUBLICATION supabase_realtime ADD TABLE public.anonymous_visitors;
```

---

## New Backend Function

### `track-visitor` Edge Function
Captures IP address (cannot be done client-side):

**Endpoint:** `POST /track-visitor`

**Input:**
```text
{
  "visitor_id": "abc-123-...",
  "fingerprint": "hash...",
  "browser": "Chrome",
  "browser_version": "120",
  "os": "Windows",
  "device_type": "desktop",
  "screen_resolution": "1920x1080",
  "timezone": "Asia/Dubai"
}
```

**Output:**
```text
{
  "success": true,
  "ip_address": "xxx.xxx.xxx.xxx",
  "country": "AE",
  "city": "Dubai"
}
```

The function reads IP from `x-forwarded-for` header and stores it in `anonymous_visitors`.

---

## Frontend Changes

### New Files

| File | Purpose |
|------|---------|
| `src/hooks/useFingerprint.ts` | Generate browser fingerprint |
| `src/hooks/useEssentialTracking.ts` | No-consent tracking logic |
| `src/pages/AnalyticsDashboard.tsx` | Full analytics dashboard page |
| `src/components/analytics/OverviewCards.tsx` | Metric summary cards |
| `src/components/analytics/LiveVisitorsTable.tsx` | Real-time visitor table |
| `src/components/analytics/VisitorsChart.tsx` | Line chart for traffic |
| `src/components/analytics/DeviceBreakdown.tsx` | Pie chart for devices |
| `src/components/analytics/TopPagesChart.tsx` | Bar chart for pages |
| `src/components/analytics/ConversionFunnel.tsx` | Funnel visualization |
| `src/components/analytics/MenuItemStats.tsx` | Menu analytics section |

### Modified Files

| File | Changes |
|------|---------|
| `src/App.tsx` | Add `/visitors` route |
| `src/hooks/useAnalytics.ts` | Add scroll/click/engagement tracking |
| `src/components/PageViewTracker.tsx` | Integrate both tracking types |

---

## Fingerprinting Details

The fingerprint is generated from:
- Canvas rendering hash (how browser draws graphics)
- WebGL renderer info
- Screen resolution and color depth
- Timezone
- Audio context signature
- Platform/OS info

Combined into a SHA-256 hash that is:
- Stable across sessions (same device = same fingerprint)
- Different across devices
- Not personally identifiable

---

## Analytics Dashboard Layout

```text
┌─────────────────────────────────────────────────────────────────────┐
│  NAWA Analytics Dashboard              [Date Picker] [⟳ Refresh]   │
├─────────────────────────────────────────────────────────────────────┤
│  ┌────────┐  ┌────────┐  ┌────────┐  ┌────────┐  ┌────────┐        │
│  │ Active │  │ Today's│  │ Page   │  │ Avg.   │  │Convert.│        │
│  │   12   │  │  48    │  │  156   │  │ 4:32   │  │  8.2%  │        │
│  │Visitors│  │Sessions│  │ Views  │  │Duration│  │  Rate  │        │
│  └────────┘  └────────┘  └────────┘  └────────┘  └────────┘        │
├─────────────────────────────────────────────────────────────────────┤
│  Live Activity                    │  Visitors Over Time             │
│  ┌─────────────────────────────┐  │  ┌─────────────────────────┐   │
│  │ 🟢 abc12 | Mobile | /menu   │  │  │  📈 Line Chart          │   │
│  │ 🟢 def34 | Desktop| /       │  │  │     (hourly data)       │   │
│  │ 🟡 ghi56 | Mobile | /cart   │  │  └─────────────────────────┘   │
│  └─────────────────────────────┘  │                                 │
├───────────────────────────────────┴─────────────────────────────────┤
│  Device Breakdown    │  Top Pages          │  Traffic Sources       │
│  ┌─────────────────┐ │  ┌─────────────────┐ │  ┌─────────────────┐  │
│  │   🥧 Pie Chart  │ │  │   📊 Bar Chart  │ │  │   🥧 Pie Chart  │  │
│  │ Mobile: 65%     │ │  │ /menu: 45       │ │  │ Direct: 40%     │  │
│  │ Desktop: 35%    │ │  │ /: 32           │ │  │ Google: 35%     │  │
│  └─────────────────┘ │  └─────────────────┘ │  └─────────────────┘  │
├─────────────────────────────────────────────────────────────────────┤
│  Conversion Funnel                                                  │
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │  Page Views → Menu Views → Add Cart → Checkout → Complete   │   │
│  │     156    →    89       →   24     →    12    →    8       │   │
│  └─────────────────────────────────────────────────────────────┘   │
├─────────────────────────────────────────────────────────────────────┤
│  Popular Menu Items                                                 │
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │ 1. Avocado Toast - 24 views, 8 add-to-cart (33%)            │   │
│  │ 2. Latte - 18 views, 12 add-to-cart (67%)                   │   │
│  │ 3. Club Sandwich - 15 views, 5 add-to-cart (33%)            │   │
│  └─────────────────────────────────────────────────────────────┘   │
├─────────────────────────────────────────────────────────────────────┤
│  All Sessions [Filter ▼] [Export CSV]                              │
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │ ID     │ Device │ Pages │ Duration │ Country │ Started      │   │
│  │ abc12  │ Mobile │   5   │  3:24    │  🇦🇪    │ 2 min ago    │   │
│  │ def34  │Desktop │   3   │  1:45    │  🇸🇦    │ 5 min ago    │   │
│  └─────────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────────┘
```

---

## File Changes Summary

| File | Action | Purpose |
|------|--------|---------|
| `supabase/functions/track-visitor/index.ts` | Create | Capture IP from headers |
| `src/hooks/useFingerprint.ts` | Create | Generate device fingerprint |
| `src/hooks/useEssentialTracking.ts` | Create | No-consent tracking |
| `src/pages/AnalyticsDashboard.tsx` | Create | Full analytics dashboard |
| `src/components/analytics/*.tsx` | Create | Dashboard chart components |
| `src/App.tsx` | Update | Add `/visitors` route |
| `src/hooks/useAnalytics.ts` | Update | Add scroll/click tracking |
| `src/components/PageViewTracker.tsx` | Update | Integrate essential + analytics |
| Database migration | Create | New tables + realtime |

---

## Privacy and Security Notes

- **Fingerprinting** is a hash, not PII
- **IP address** stored but can be hashed for extra privacy
- **Essential tracking** justified under legitimate interest (security/fraud prevention)
- **Enhanced tracking** only with explicit cookie consent
- **Dashboard** protected by same password as kitchen (server-side validation)
- **RLS policies** will restrict data access appropriately

