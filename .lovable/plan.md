

## Kitchen Dashboard Hardening Plan

Three targeted changes to make the kitchen page production-reliable.

---

### 1. Realtime channel reconnection (`KitchenDashboard.tsx`)

**Problem:** If the realtime channel drops (network blip, token expiry), staff silently stop receiving orders with no recovery.

**Fix:** After `.subscribe()`, listen to the channel status. On `CHANNEL_ERROR` or `TIMED_OUT`, wait 3 seconds, remove the dead channel, and re-subscribe. On reconnect, call `loadOrders()` to catch any missed orders during the gap.

---

### 2. Stop redundant role checks on TOKEN_REFRESHED (`AdminContext.tsx`)

**Problem:** Line 65 triggers `checkRoleAndSet` on every `TOKEN_REFRESHED` event (~every hour). If the RPC momentarily fails during a refresh, `isAdmin` flips to `false` and the staff gets kicked out mid-shift.

**Fix:** Remove `TOKEN_REFRESHED` from the condition. Only check roles on `SIGNED_IN`. A token refresh doesn't change roles.

```
// Before
(event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED')

// After  
event === 'SIGNED_IN'
```

---

### 3. Reduce fallback polling + add retry (`KitchenDashboard.tsx`)

**Problem:** If realtime dies AND `loadOrders()` fails, the dashboard sits stale for 5 minutes before the next poll attempt.

**Fix:**
- Change polling interval from `5 * 60 * 1000` to `60 * 1000` (1 minute, as requested)
- Add retry with backoff to `loadOrders`: on failure, retry after 5s, then 15s, then 30s (3 attempts max) before giving up until the next poll cycle

---

### Files to change

| File | Change |
|------|--------|
| `src/pages/KitchenDashboard.tsx` | Add channel status monitoring + reconnect logic; reduce poll to 1 min; add retry backoff on `loadOrders` failure |
| `src/contexts/AdminContext.tsx` | Remove `TOKEN_REFRESHED` from role-check trigger (line 65) |

