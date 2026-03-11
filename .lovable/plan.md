

## Two Issues Identified

### Issue 1: Location is City-Level, Not Exact

**How it works now:** When a customer places an order, the `create-ziina-checkout` edge function grabs their IP address and sends it to `ip-api.com`. That service returns the **city** (e.g., "Al Ain") -- not a street or neighborhood. Since both your branches are in Al Ain, every order just says "Al Ain" and staff can't tell which branch the customer is near.

**The fix:** Use the browser's built-in GPS (Geolocation API) on the checkout page. Before submitting the order, ask the customer for location permission. If granted, send their exact latitude/longitude to the edge function. The edge function then calculates which of your two branches is closest and stores that as the location (e.g., "Near Main Branch - 1.2km" or "Near Al Ain Municipality Branch - 0.8km").

**Changes:**
- **`src/pages/CheckoutPage.tsx`**: Request browser geolocation when the page loads. Pass `latitude` and `longitude` to the checkout edge function.
- **`supabase/functions/create-ziina-checkout/index.ts`**: Accept `latitude`/`longitude` from the request body. Define the two branch coordinates. Calculate distance to each using the Haversine formula. Store the nearest branch name + distance in `customer_location` instead of the IP-based city.
- **Fallback**: If the customer denies GPS permission, fall back to the current IP-based method (better than nothing).

### Issue 2: Device/Browser/OS Details Not Visible

**What's collected but hidden:** The `anonymous_visitors` table already stores `browser`, `browser_version`, `os`, `device_type`, `screen_resolution`, and `timezone`. The analytics Visitor Details table shows device and browser in the main row, but OS, screen resolution, and browser version are either hidden or only in the expanded view.

**Changes:**
- **`src/components/analytics/VisitorDetailsTable.tsx`**: Add `OS` and `Screen` columns to the main table (not just the expanded view). Show `browser_version` next to browser name. Keep the table scannable.
- **Kitchen dashboard**: No change needed here -- staff don't need visitor device info on orders. They need the **branch location**, which Issue 1 fixes.

---

### Files to Change

| File | What |
|------|------|
| `src/pages/CheckoutPage.tsx` | Add browser geolocation request, pass lat/lng to edge function |
| `supabase/functions/create-ziina-checkout/index.ts` | Accept lat/lng, calculate nearest branch with Haversine, store result |
| `src/components/analytics/VisitorDetailsTable.tsx` | Add OS, screen resolution, browser version columns to main table |

