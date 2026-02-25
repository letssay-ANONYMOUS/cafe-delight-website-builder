

# Fix Analytics Security and Unify Admin Login

## Two Changes

### 1. Lock Down Analytics Tables

The analytics tables (`visitor_sessions`, `page_views`, `anonymous_visitors`, `page_interactions`) currently have public SELECT policies (`USING (true)`), meaning anyone can query all visitor data directly. 

**Fix:** Remove the public SELECT policies from these tables. Analytics data is already fetched via the `admin-orders` edge function using the service role key, so the frontend won't break.

**Tables to update:**
- `visitor_sessions` -- drop "Visitors can view own sessions" SELECT policy
- `page_views` -- drop "Visitors can view own page views" SELECT policy  
- `anonymous_visitors` -- drop "Anyone can view anonymous visitors" SELECT policy
- `page_interactions` -- drop "Anyone can view page interactions" SELECT policy

### 2. Switch Admin Footer Login to Email/Password Auth

Currently the secret footer button (5 clicks on copyright) uses a custom password-only system via the `admin-login` edge function. We'll replace this with the same email/password login used by staff (`nawacafe22@gmail.com` / `Nawa@22*2`) using standard authentication.

**Changes:**
- **`AdminPasswordModal.tsx`** -- Add an email field (pre-filled with `nawacafe22@gmail.com` for convenience) alongside the password field. Use `supabase.auth.signInWithPassword()` instead of `adminService.login()`.
- **`AdminContext.tsx`** -- On login, check the user's role via `user_roles` table to confirm they have `staff` or `admin` role before activating admin mode. Listen to `onAuthStateChange` to persist admin state across refreshes.
- **`Footer.tsx`** -- Update logout to call `supabase.auth.signOut()` in addition to clearing admin state.
- **`adminService.ts`** -- Keep the `X-Admin-Token` header logic for backend calls (the edge functions still validate it), but the login/logout methods will now wrap Supabase Auth.

---

### Technical Details

**Migration SQL (analytics lockdown):**
```sql
DROP POLICY "Visitors can view own sessions" ON visitor_sessions;
DROP POLICY "Visitors can view own page views" ON page_views;
DROP POLICY "Anyone can view anonymous visitors" ON anonymous_visitors;
DROP POLICY "Anyone can view page interactions" ON page_interactions;
```

**AdminPasswordModal changes:**
- Add email input field
- Replace `adminService.login(password)` with `supabase.auth.signInWithPassword({ email, password })`
- After sign-in, query `user_roles` to verify the user has `staff` role

**AdminContext changes:**
- Add `onAuthStateChange` listener to auto-restore admin mode on page refresh
- Check role on auth state change

**No edge function changes needed** -- the existing `admin-items` / `admin-item` edge functions still validate via `X-Admin-Token` header, which will continue to work alongside the new auth-based login for the UI gate.

