

# Kitchen Alert on Pending Orders

## Summary
Move the alert sound trigger from **paid** orders to **pending** orders, ensure the custom audio URL is always used when configured, and make the Stop Alert button visible on all devices.

---

## Changes Overview

| File | Change |
|------|--------|
| `src/pages/KitchenDashboard.tsx` | Trigger alert on new PENDING orders instead of paid orders |
| `src/pages/KitchenDashboard.tsx` | Make Stop Alert button visible on mobile (remove `hidden sm:flex`) |
| `src/pages/KitchenDashboard.tsx` | Add prominent animation when alert is playing |
| `src/components/kitchen/OrderTable.tsx` | Add ACK button for pending orders |

---

## Detailed Changes

### 1. Move Alert Trigger to Pending Orders

**Current behavior (lines 262-275):**
- Alert triggers when order status changes TO `paid`
- Pending orders only show a toast, no sound

**New behavior:**
- Alert triggers on INSERT when new order has `pending` status
- Auto-switch to pending view
- Remove alert trigger from paid status update

```text
┌─────────────────────────────────────────────────────────────┐
│  CURRENT FLOW                                               │
│  New Order → Toast only                                     │
│  Order becomes PAID → Sound alert + Toast                   │
├─────────────────────────────────────────────────────────────┤
│  NEW FLOW                                                   │
│  New Pending Order → Sound alert + Toast + Auto-switch view │
│  Order becomes PAID → Toast only (no sound)                 │
└─────────────────────────────────────────────────────────────┘
```

### 2. Ensure Custom Audio URL Is Used

The current logic at line 214 in `useKitchenAlert.ts` is correct:
```typescript
const useCustomAudio = currentSoundRef.current === 'custom' && customUrlRef.current;
```

The user's saved settings are loaded at lines 68-73 of `KitchenDashboard.tsx`:
- `selectedSound` from `localStorage.getItem('kitchen_alert_sound')`
- `customAudioUrl` from `localStorage.getItem('kitchen_alert_custom_url')`

These are passed to the hook at lines 87-92. No changes needed here - the custom URL will play correctly.

### 3. Make Stop Button Always Visible

**Current (line 404):** `className="hidden sm:flex items-center gap-2"`

**New:** Remove `hidden sm:flex` and add animation when `isPlaying`:
- Always visible on all screen sizes
- Larger and more prominent when alert is playing
- Pulsing animation to draw attention

### 4. Add ACK Button for Pending Orders

**Current (line 150):** `{!isPending && <TableHead className="w-[100px]">Action</TableHead>}`

**New:** Always show Action column regardless of order type, allowing staff to acknowledge pending orders and silence the alert.

---

## Technical Details

### Alert System Flow
1. New order inserted with `payment_status: 'pending'`
2. Realtime subscription fires INSERT event
3. Order ID added to `unacknowledgedOrders` Set
4. `useKitchenAlert` starts playing (custom URL if `selectedSound === 'custom'`)
5. Staff clicks ACK or Stop Alert button
6. Sound stops immediately

### Custom Audio Priority
The hook checks `currentSoundRef.current === 'custom'` first, so:
- If user selected "custom" in Sound Picker → Custom URL plays
- If user selected any synth sound → Synth plays
- Fallback to synth if custom audio fails to load

