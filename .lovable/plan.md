

## Problem

The GPS-based branch detection code is in place, but when customers deny the browser location prompt (or it times out), the fallback IP geolocation only returns "Al Ain City" — not which branch they're near. Since both branches are in the same city, IP geolocation can never distinguish between them.

The current flow silently falls back without telling the customer or staff that exact location wasn't available.

## Plan

### 1. Make location permission more prominent on checkout

Instead of silently requesting GPS in the background, show a visible UI prompt explaining **why** location is needed ("to identify your nearest branch"). If the customer hasn't granted permission yet, show a button they can tap to trigger the location request. This increases the grant rate significantly.

**File:** `src/pages/CheckoutPage.tsx`
- Add a location status indicator near the top of the checkout form
- Show one of three states:
  - "Locating..." (pending)
  - "Stadhazza Branch" or "Municipality Branch" with a green checkmark (acquired)
  - "Location not available — please select your branch" with a manual dropdown fallback (denied/timeout)
- Add a `<Select>` dropdown with the two branches as a **manual fallback** so staff always know the branch even if GPS fails
- Pass the selected branch name to the edge function when GPS is unavailable

### 2. Update edge function to accept manual branch selection

**File:** `supabase/functions/create-ziina-checkout/index.ts`
- Accept a new optional field `selectedBranch` from the request body
- Priority: GPS coords > manual selection > IP fallback
- If `selectedBranch` is provided and no GPS, use it directly (e.g., "Stadhazza Branch (manual)")

### 3. No database or kitchen UI changes needed

The `customer_location` field already exists on the `orders` table and is already displayed in `OrderTable.tsx`. Once the value is correct, it will show the branch name automatically.

### Files to change

| File | Change |
|------|--------|
| `src/pages/CheckoutPage.tsx` | Add visible location status + manual branch selector fallback |
| `supabase/functions/create-ziina-checkout/index.ts` | Accept `selectedBranch` field, use as fallback |

