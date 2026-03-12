

## Security Fixes — Kitchen Dashboard Untouched

These fixes target only the admin edge functions, one modal component, one RLS policy, and one hardcoded URL. **Zero changes** to any kitchen-related files (`KitchenDashboard.tsx`, `KitchenAuthGate.tsx`, `KitchenSidebar.tsx`, `OrderTable.tsx`, `useKitchenAlert.ts`, `StaffLogin.tsx`).

### Changes

**1. Whitelist fields in `admin-item` edge function**
- In `supabase/functions/admin-item/index.ts`, replace the destructured `...itemData` pass-through with an explicit whitelist of allowed fields (`title`, `description`, `price`, `category`, `subcategory`, `image_url`, `published`, `display_order`, `card_number`, `tags`, `options`). Prevents injection of arbitrary columns.

**2. Remove hardcoded email from `AdminPasswordModal`**
- In `src/components/AdminPasswordModal.tsx`, change the default `email` state from `'nawacafe22@gmail.com'` to `''` with a placeholder on the input field instead.

**3. Tighten `kitchen_settings` RLS**
- Database migration: Drop the 3 public INSERT/SELECT/UPDATE policies and replace with authenticated-only policies requiring `has_role(auth.uid(), 'admin')` or `has_role(auth.uid(), 'staff')`.

**4. Move n8n webhook URL to a secret**
- Add a new secret `N8N_WEBHOOK_URL` via the secrets tool.
- In `supabase/functions/create-ziina-checkout/index.ts`, replace the hardcoded URL with `Deno.env.get('N8N_WEBHOOK_URL')`.

### Files Modified
| File | Type | Kitchen Impact |
|------|------|----------------|
| `supabase/functions/admin-item/index.ts` | Edge function | None |
| `src/components/AdminPasswordModal.tsx` | Component | None |
| `supabase/functions/create-ziina-checkout/index.ts` | Edge function | None |
| Database migration (kitchen_settings RLS) | SQL | Read/write still works for authenticated staff — no behavior change |

