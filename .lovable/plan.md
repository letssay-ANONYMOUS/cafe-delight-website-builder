

# Continuous Alert Sound System - Fix Plan

## Problem Summary
The current alert system has these issues:
1. **Sound is NOT truly continuous** - plays once, then silence for 1.2 seconds, repeat
2. **Sounds are too short** (0.15 to 1.5 seconds) with audible gaps
3. **No maximum timeout** - you want a 2.5-minute safety cutoff
4. **No audio file support** - currently only uses Web Audio API generated sounds

## Solution Overview

We will:
1. Make the alert **truly continuous** (no gaps) by using HTML5 `<audio>` element with `loop=true`
2. Add **2.5-minute auto-stop** safety feature
3. Support **both** built-in synth sounds AND audio file URLs
4. Let you paste an MP3/WAV URL later when you find one you like

---

## Technical Changes

### File 1: `src/hooks/useKitchenAlert.ts` (Major Rewrite)

**Current Behavior:**
```text
[SOUND]  ────gap────  [SOUND]  ────gap────  [SOUND]
  0.5s      0.7s        0.5s      0.7s        0.5s
```

**New Behavior:**
```text
[──────CONTINUOUS AUDIO LOOP──────────────────────>
  No gaps, plays until ACK or 2.5 min timeout
```

**Changes:**
- Add support for HTML5 `<audio>` element with `loop=true`
- Add `maxDuration` parameter (default 150 seconds = 2.5 minutes)
- Auto-stop after timeout, but keep "unacknowledged" badge visible
- Support both modes:
  - **Built-in synth**: Uses Web Audio API with tighter loop (every 600ms instead of 1200ms)
  - **Audio file**: Uses `<audio>` tag with loop for truly gapless playback

**New Hook Interface:**
```typescript
interface UseKitchenAlertOptions {
  soundId: string;           // 'chime', 'bell', etc. OR 'custom'
  customAudioUrl?: string;   // MP3/WAV URL when soundId='custom'
  maxDuration?: number;      // Default 150000ms (2.5 min)
}

const { isPlaying, startAlert, stopAlert, initAudioContext } = 
  useKitchenAlert(options);
```

### File 2: `src/components/kitchen/SoundPicker.tsx` (Enhance)

**Add:**
- New option: "Custom URL" at the bottom of the list
- Text input field to paste an MP3/WAV URL
- "Test URL" button to preview the custom sound
- Save custom URL to localStorage alongside sound choice

**New UI:**
```text
┌────────────────────────────────────────────┐
│  Choose Alert Sound                    [X] │
├────────────────────────────────────────────┤
│  ○ Chime Arpeggio          [Test] [Loop]  │
│  ○ Bell Ring               [Test] [Loop]  │
│  ○ Alarm                   [Test] [Loop]  │
│  ...                                       │
│  ○ Custom Audio URL                        │
│    ┌────────────────────────────────────┐  │
│    │ https://example.com/alarm.mp3     │  │
│    └────────────────────────────────────┘  │
│    [Test URL] [Loop Preview]               │
├────────────────────────────────────────────┤
│  [Cancel]              [Use This Sound]    │
└────────────────────────────────────────────┘
```

### File 3: `src/pages/KitchenDashboard.tsx` (Minor Update)

**Changes:**
- Pass `customAudioUrl` from localStorage to the hook
- Add timeout callback to show toast when auto-stopped after 2.5 min
- Keep badge visible even after timeout (staff should still acknowledge)

### File 4: `src/components/kitchen/OrderTable.tsx` (No Change)

Already has the ACK button - no changes needed.

---

## Sound Looping Approach

### For Built-in Synth Sounds:
```typescript
// Tighter loop with no gaps
intervalRef.current = setInterval(() => {
  playSound();
}, 600); // Reduced from 1200ms

// Also extend each sound duration
// E.g., chime now sustains 0.3s per note instead of 0.15s
```

### For Custom Audio URL:
```typescript
// True seamless loop using HTML5 Audio
const audio = new Audio(customAudioUrl);
audio.loop = true;
audio.volume = 0.8;
audio.play();

// Stop after 2.5 min max
setTimeout(() => {
  audio.pause();
  audio.currentTime = 0;
}, 150000);
```

---

## Safety Timeout Logic

```text
                   2.5 Minutes
    ├─────────────────────────────────────────┤
    │                                         │
    │   SOUND PLAYING CONTINUOUSLY            │ → Auto-stop sound
    │                                         │   Badge still shows
    ├─────────────────────────────────────────┤
                                              ▼
                               Toast: "Alert timed out after 2.5 min"
                               Badge: Still shows "New!" until ACK
```

---

## Files Summary

| File | Change Type | Description |
|------|------------|-------------|
| `src/hooks/useKitchenAlert.ts` | **Rewrite** | Add audio file support, 2.5 min timeout, tighter loop |
| `src/components/kitchen/SoundPicker.tsx` | **Enhance** | Add custom URL input, loop preview button |
| `src/pages/KitchenDashboard.tsx` | **Minor** | Pass custom URL, handle timeout callback |

---

## How to Use Custom Audio Later

Once implemented, you can:
1. Click the "Sound" button in kitchen dashboard
2. Scroll to "Custom Audio URL" option
3. Paste any public MP3/WAV URL (e.g., from freesound.org, soundcloud direct link, etc.)
4. Click "Test URL" to preview
5. Click "Use This Sound" to save

The URL will be stored in localStorage and used for all future alerts.

---

## Expected Result

After this fix:
- Alert plays **continuously with no gaps** until acknowledged
- Automatically stops after **2.5 minutes** (safety feature)
- Badge stays visible until staff clicks ACK
- Staff can choose between **10 built-in sounds** OR paste a **custom MP3/WAV URL**
- Custom URL saved to browser for future use

