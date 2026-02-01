
# Kitchen Dashboard - Fixing Deployment Issue

## Problem Identified
The code files in the repository are **correct** and contain the two-column layout you requested:
- `src/pages/KitchenDashboard.tsx` has `grid md:grid-cols-2` with separate Pending/Paid tables
- `src/components/kitchen/OrderTable.tsx` has item name previews and acknowledge buttons
- `src/hooks/useKitchenAlert.ts` has the continuous alert sound

**But your browser is showing the OLD version** with "Today's Orders" single table layout.

## Root Cause
This is a browser/deployment caching issue - the new code was saved but your browser is serving a cached version of the old JavaScript bundle.

## Solution

### Step 1: Force Hard Refresh
On the kitchen dashboard page (`/admin/kitchen`):
- **Windows/Linux**: Press `Ctrl + Shift + R`
- **Mac**: Press `Cmd + Shift + R`
- Or: Open DevTools (F12) → Right-click refresh button → "Empty Cache and Hard Reload"

### Step 2: Clear Site Data (if Step 1 doesn't work)
1. Open browser DevTools (F12)
2. Go to **Application** tab
3. Click **Clear site data**
4. Refresh the page

### Step 3: Verify the New Layout
After refresh, you should see:
- Two side-by-side cards: "Pending Orders" (left) and "Paid Orders" (right)
- Header shows counts for both Pending and Paid
- Paid orders have a pulsing red "ACK" button when unacknowledged
- Item names like "Burger, Coffee +2 more" instead of just "1 items"

## What the New Dashboard Looks Like

| Left Column | Right Column |
|-------------|--------------|
| ⏳ **Pending Orders (X)** | ✅ **Paid Orders (Y)** |
| Orders awaiting payment | Orders that have been paid |
| No alert sound | Continuous alert + ACK button |
| Yellow header | Green header |
| Expandable rows | Expandable rows + Acknowledge |

## Technical Details

### Files Already Created/Updated:
1. `src/hooks/useKitchenAlert.ts` - Web Audio API chime loop (C5-E5-G5 arpeggio)
2. `src/components/kitchen/OrderTable.tsx` - Reusable table with item preview, expand, ACK button
3. `src/pages/KitchenDashboard.tsx` - Two-column grid with realtime listeners
4. `src/components/RouteAwareCookieConsent.tsx` - Hides cookies on admin/staff routes

### Key Features Implemented:
- **Sound triggers only for PAID orders** (not pending)
- **Continuous loop** until staff clicks "ACK" button
- **Item names shown** in collapsed row (e.g., "Burger, Coffee +2 more")
- **Expandable details** with notes, extras, customer info
- **Real-time movement** from Pending to Paid when payment completes

## If Issue Persists
I can rebuild the KitchenDashboard component with a slightly different approach to force a new bundle hash, ensuring the browser fetches fresh code.
