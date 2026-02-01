
# Add "Test Continuous Alert" Button to Kitchen Dashboard

## Problem
There's no way to test the **full 2.5-minute continuous looping alert** without waiting for an actual paid order. Staff needs to hear exactly how the alert will sound in real conditions before a real order comes in.

## Solution
Add a dedicated "Test Alert" button in the kitchen dashboard header that triggers the exact same continuous alert (loops for up to 2.5 minutes or until manually stopped).

---

## Technical Changes

### File: `src/pages/KitchenDashboard.tsx`

**Add a "Test Alert" button** next to the Sound button in the header area (around line 311-320):

**New UI in header:**
```
[Sound] [Test Alert / Stop Alert] [Volume Toggle] [Refresh] [Fullscreen] [Logout]
```

**Implementation:**
```typescript
{/* Test Continuous Alert Button */}
<Button
  variant={isPlaying ? "destructive" : "outline"}
  size="sm"
  onClick={() => {
    if (isPlaying) {
      stopAlert();
      toast({ 
        title: "Alert Stopped",
        description: "Continuous alert has been stopped."
      });
    } else {
      startAlert();
      toast({ 
        title: "Testing Continuous Alert",
        description: "Alert will loop for 2.5 minutes or until you click Stop.",
        duration: 5000,
      });
    }
  }}
  className="hidden sm:flex items-center gap-2"
>
  {isPlaying ? (
    <>
      <VolumeX className="w-4 h-4" />
      <span className="text-xs">Stop Alert</span>
    </>
  ) : (
    <>
      <Volume2 className="w-4 h-4" />
      <span className="text-xs">Test Alert</span>
    </>
  )}
</Button>
```

**Behavior:**
- Clicking "Test Alert" calls `startAlert()` - begins the **full continuous loop**
- Button changes to "Stop Alert" (red/destructive) while playing
- Clicking "Stop Alert" calls `stopAlert()` - ends immediately
- If not stopped manually, alert auto-stops after **2.5 minutes** (uses existing `maxDuration: 150000` config)
- Shows toast notification explaining the test

---

## Files Changed

| File | Change |
|------|--------|
| `src/pages/KitchenDashboard.tsx` | Add ~20 lines for "Test Alert" button between Sound button and volume toggle |

## Result
Staff can test the exact continuous looping alert (with their chosen sound or custom audio URL) directly from the kitchen dashboard, hearing exactly what will play when a real paid order arrives.
