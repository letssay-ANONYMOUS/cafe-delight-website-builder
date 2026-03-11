

## Problem

The user wants the invisible Nawa watermark logo removed from the center of the screen. Currently, `src/App.tsx` renders a fixed watermark with 3% opacity (`opacity-[0.03]`) that sits behind all content but is still visible enough to be distracting.

## Solution

Remove the watermark `<div>` block entirely from `src/App.tsx`.

**File to change:**

| File | Change |
|------|--------|
| `src/App.tsx` | Remove the entire watermark `<div>` block (lines with the fixed inset-0 watermark logo) |

The watermark is the block with:
- `fixed inset-0 pointer-events-none z-[1]`
- `nawaWatermark` image
- `opacity-[0.03]`

Removing this will eliminate the centered logo without affecting any other UI elements.

