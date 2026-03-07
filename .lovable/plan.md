

## Problem

The cookie consent banner uses a single-row `flex` layout with text and buttons side-by-side. On mobile, the text and buttons compete for horizontal space, causing the text to wrap word-by-word into a vertical column (as shown in the screenshot).

## Solution

Switch to a **stacked layout on mobile**: text on top, buttons below. Keep the single-row layout on desktop (`sm:` breakpoint and up).

### Changes to `src/components/CookieConsent.tsx` (lines 75-114)

1. Change the outer flex container to `flex-col` on mobile, `sm:flex-row sm:items-center` on desktop.
2. Move the buttons into a full-width row on mobile with proper spacing.
3. Ensure the text paragraph takes full width on mobile and doesn't get squeezed.

```text
Mobile layout:
┌──────────────────────────────┐
│ 🍪 We use cookies to enhance │
│ your experience...  Learn more│
│                              │
│  [Accept] [Essential Only] ✕ │
└──────────────────────────────┘

Desktop layout (unchanged):
┌──────────────────────────────────────────────────────────┐
│ 🍪 We use cookies to enhance...  Learn more  [Accept] [Essential Only] ✕ │
└──────────────────────────────────────────────────────────┘
```

Single file change, minimal diff.

