
# Kitchen Dashboard Enhancement Plan

## Summary
Redesign the kitchen dashboard with two separate tables (Pending/Paid), implement a continuous alert sound for PAID orders only with an acknowledgement button, remove cookie consent from staff/admin pages, and remove the cash payment option.

---

## Current State
- **Kitchen Dashboard**: Single table showing all orders, plays short beep on ANY new order (including pending)
- **Checkout Page**: Currently allows card payments via Ziina (no cash option exists already)
- **Cookie Consent**: Shows on ALL pages including admin/staff/visitors
- **Order Table**: Shows item count but not item names in the main row

---

## Changes Overview

### 1. Two-Column Layout: Pending vs Paid

| Pending Orders (Left) | Paid Orders (Right) |
|-----------------------|---------------------|
| Shows when checkout starts | Shows when payment completes |
| Yellow badge | Green badge with glow |
| No alert sound | Continuous alert + Acknowledge button |
| Shows item names | Shows item names |
| Expandable for notes | Expandable for notes |

### 2. Continuous Alert for PAID Orders Only
- Loop a pleasant chime sound when new PAID order arrives
- Sound continues until staff clicks "Acknowledge" button
- Pulsing red button for unacknowledged paid orders
- Sound stops per-order when acknowledged

### 3. Remove Cookie Consent from Staff Pages
Hide the cookie consent banner on:
- `/admin/*` (Admin dashboard, login)
- `/staff/*` (Staff login)
- `/admin/kitchen` (Kitchen dashboard)
- `/visitors` (Analytics)

### 4. Show Item Names in Table
- Display first 2-3 item names in the collapsed row
- Show "Burger, Coffee, +2 more" format
- Full details with notes in expanded view

---

## Technical Implementation

### Files to Create

**`src/hooks/useKitchenAlert.ts`** (NEW)
- Web Audio API continuous chime loop
- Musical arpeggio pattern (C5 -> E5 -> G5)
- `startAlert()` and `stopAlert()` methods
- Volume control (0.5 for audibility)

**`src/components/kitchen/OrderTable.tsx`** (NEW)
- Reusable table component
- Props: `orders`, `type: 'pending' | 'paid'`, `onAcknowledge`
- Shows item names preview
- Expandable rows with notes form

### Files to Modify

**`src/pages/KitchenDashboard.tsx`**
- Split into two-column responsive grid
- Left: Pending orders (payment_status = 'pending')
- Right: Paid orders (payment_status = 'paid')
- Track `unacknowledgedOrders` state (Set of order IDs)
- Listen for realtime UPDATE when payment_status changes to 'paid'
- Trigger continuous alert ONLY for newly paid orders
- Add Acknowledge button for each paid order

**`src/App.tsx`**
- Wrap CookieConsent in route-aware component
- Check if current path starts with `/admin`, `/staff`, or `/visitors`
- Only render CookieConsent on customer-facing pages

---

## Alert Sound Logic

```text
Order Flow:
                                       
  Customer                Kitchen Dashboard
  ────────                ─────────────────
      │                         │
      │ Checkout (no payment)   │
      ├────────────────────────►│ INSERT order (pending)
      │                         │ → Appears in LEFT table
      │                         │ → NO sound
      │                         │
      │ Payment Success         │
      ├────────────────────────►│ UPDATE order (paid)
      │                         │ → Moves to RIGHT table
      │                         │ → CONTINUOUS SOUND starts
      │                         │
                                │ Staff clicks [Acknowledge]
                                │ → Sound stops for that order
```

---

## UI Layout

```text
┌───────────────────────────────────────────────────────────────────────┐
│  Kitchen Dashboard                    [🔊] [↻] [↗]    Feb 1, 2026    │
├───────────────────────────────────────────────────────────────────────┤
│                                                                       │
│  ┌─────────────────────────────┐  ┌─────────────────────────────────┐ │
│  │  ⏳ PENDING (3)             │  │  ✅ PAID (2)                    │ │
│  │  ─────────────────────────  │  │  ───────────────────────────    │ │
│  │                             │  │  ┌─────────────────────────┐    │ │
│  │  Ahmad | 050-123-4567       │  │  │ ★ Fatima | 055-987-6543│    │ │
│  │  Burger, Coffee             │  │  │   Pasta, Salad          │    │ │
│  │  AED 42.00 [▼ Expand]       │  │  │   AED 78.00             │    │ │
│  │                             │  │  │   [🔔 ACKNOWLEDGE]      │    │ │
│  │  ─────────────────────────  │  │  │   [▼ Expand]            │    │ │
│  │                             │  │  └─────────────────────────┘    │ │
│  │  Basem | 052-111-2222       │  │                                 │ │
│  │  3 items | AED 96.00        │  │  Naveen | 056-333-4444          │ │
│  │  [▼ Expand]                 │  │  Croissant, Latte               │ │
│  │                             │  │  AED 54.00 (acknowledged)       │ │
│  └─────────────────────────────┘  └─────────────────────────────────┘ │
│                                                                       │
└───────────────────────────────────────────────────────────────────────┘
```

---

## Sound Design

The continuous alert uses Web Audio API:
- **Pattern**: C5 (523Hz) → E5 (659Hz) → G5 (784Hz) major chord arpeggio
- **Timing**: 150ms per note, 300ms pause, then repeat
- **Volume**: 0.5 (loud but not harsh)
- **Type**: Sine wave for pleasant cafe sound

---

## Detailed Steps

### Step 1: Create Kitchen Alert Hook
New file with:
- `AudioContext` management
- `isPlaying` state
- `startAlert()` - begins loop
- `stopAlert()` - ends loop
- Auto-cleanup on unmount

### Step 2: Create Reusable OrderTable Component
Props interface:
```typescript
interface OrderTableProps {
  orders: OrderWithItems[];
  type: 'pending' | 'paid';
  unacknowledged?: Set<string>;
  onAcknowledge?: (orderId: string) => void;
}
```
Features:
- Item names preview (first 2 items + count)
- Expandable row with full details
- Notes display
- Acknowledge button (paid only)
- Pulsing animation for unacknowledged

### Step 3: Redesign Kitchen Dashboard
- Two-column grid (responsive, stacks on mobile)
- Track `unacknowledgedOrders` in state
- On realtime UPDATE to 'paid': add to unacknowledged set, start sound
- On acknowledge click: remove from set, stop sound if set empty

### Step 4: Route-Aware Cookie Consent in App.tsx
```typescript
// Paths where cookie consent should NOT show
const EXCLUDED_PATHS = ['/admin', '/staff', '/visitors'];

// Wrap CookieConsent with location check
```

---

## File Summary

| File | Action | Description |
|------|--------|-------------|
| `src/hooks/useKitchenAlert.ts` | CREATE | Continuous audio loop hook |
| `src/components/kitchen/OrderTable.tsx` | CREATE | Reusable order table with acknowledge |
| `src/pages/KitchenDashboard.tsx` | REWRITE | Two-column layout, alert integration |
| `src/App.tsx` | MODIFY | Route-aware cookie consent |
