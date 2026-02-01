
## What’s happening (why it feels like I’m “asking again”)
Right now the login cannot succeed because the backend is comparing your entered password to a stored secret value that is **not the same string**.

I verified this by calling the backend login endpoint directly:
- It consistently returns **“Invalid password”**
- Backend logs show the stored password is **13 characters long**
- Both `CafeAdmin2026!` (14 chars) and `CafeAdmin2026` (13 chars) still fail, meaning the stored secret is a *different* 13‑character string

I cannot read the secret value for security reasons, so the only reliable fix is to **overwrite it once to a known value**, then we test immediately.

---

## Goals you asked for
1) **Basic functionality works** (login → kitchen dashboard)
2) Analytics access can remain “same password” for now; later we can add a separate analytics password
3) Stop the confusion/mismatch issues

---

## Implementation plan

### Phase A — Make the password work (one decisive reset)
1) **Overwrite the backend secret** `ADMIN_PASSWORD_HASH` to a new known password (copy/paste exactly):
   - Suggested temporary password (simple, no symbols):  
     `NawaKitchen2026`
2) Keep `SESSION_SECRET` as-is (it’s already present and required for session tokens).
3) Immediately verify backend accepts the new password by performing a test login request (I’ll run this verification once you’ve saved it).

**Success criteria:** a login request returns `{ success: true, sessionToken: "..." }`.

---

### Phase B — Fix the staff flow to land on the kitchen dashboard (code change)
Update the staff login screen to match what you selected:
1) In `src/pages/StaffLogin.tsx`:
   - After successful login, redirect to **`/admin/kitchen`** (kitchen dashboard), not `/visitors`
   - Update the toast text to say “Redirecting to kitchen dashboard…”

**Success criteria:** staff enters password → goes straight to kitchen dashboard.

---

### Phase C — Fix broken admin authentication plumbing (so “basic functionality” is actually consistent)
Right now there are multiple inconsistent token keys / auth styles, which causes random “not working” behavior:

#### C1) Standardize the session token storage key everywhere
- Use **one** localStorage key: `admin_session`  
Currently:
- Kitchen + Analytics + StaffLogin use `admin_session`
- `adminService.ts` uses `admin_session_token` (different) → breaks admin modal login

Plan:
1) Update `src/services/adminService.ts` to use `admin_session` and store/read `sessionToken` (not `token`)
2) Update `src/components/AdminPasswordModal.tsx` will work automatically once `adminService` is fixed

#### C2) Ensure admin pages actually send the token to protected backend functions
Some pages call protected backend functions but **don’t include the token header**, so they always fail auth.

Plan:
1) In `src/pages/AdminLogin.tsx`:
   - Store `data.sessionToken` into `localStorage('admin_session')` on success
2) In `src/pages/AdminDashboard.tsx`:
   - For `admin-session`, `admin-items`, `admin-item`, `admin-upload-url` calls: include header `x-admin-token: <token>`
   - If token missing/invalid, redirect to `/admin/login`

#### C3) Fix backend upload auth mismatch (cookie vs token)
`supabase/functions/admin-upload-url/index.ts` currently checks a cookie named `admin_session`, but your login system uses localStorage + `x-admin-token`.

Plan:
1) Update `supabase/functions/admin-upload-url/index.ts` to validate using the same `x-admin-token` HMAC method as `admin-items` / `admin-item`
2) This makes image uploading in the admin dashboard actually work again

---

### Phase D — Remove sensitive debug logs from login (cleanup)
`admin-login` currently logs password lengths and match results. That’s useful for debugging but not good to keep.

Plan:
1) Remove the detailed password debug logs from `supabase/functions/admin-login/index.ts`
2) Keep only minimal operational logs (e.g., “login attempt”, “success”, “invalid password”)

---

### Phase E — End-to-end verification checklist (so we stop going in circles)
After the secret reset + code changes, we verify these flows in order:

1) **Staff login**
   - Go to `/staff/login`
   - Enter `NawaKitchen2026`
   - Confirm redirect to `/admin/kitchen`

2) **Kitchen dashboard access**
   - Refresh the page on `/admin/kitchen`
   - Confirm it does NOT bounce you back to login (token validated)

3) **Analytics access (same password for now)**
   - Go to `/visitors`
   - Confirm it loads (and if not authenticated, it sends you to `/staff/login`)

4) **Admin dashboard basics (optional but recommended)**
   - Go to `/admin/login`
   - Login, confirm it stores token and doesn’t immediately redirect you out
   - Confirm menu items load

5) **Publishing (for your real domain)**
   - After we confirm everything works in preview, publish the frontend so routes like `/visitors` and `/admin/kitchen` work on your live domain too.

---

## Risks / edge cases we’re addressing
- Secret saved to a value you didn’t intend (common with copy/paste or multiple environments)
- Multiple token key names (`admin_session` vs `admin_session_token`)
- Protected backend functions being called without required headers
- Upload endpoint using cookie auth while the app uses token auth
- Different session expiry logic across pages/functions

---

## Next improvements (later, once basic works)
- Add a separate password for `/visitors` (analytics-only)
- Replace password-only auth with real user accounts + roles
- Add a simple “Staff home” screen (Kitchen / Analytics buttons) after login
