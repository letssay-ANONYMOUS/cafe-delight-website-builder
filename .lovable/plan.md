

# Fix Missing user_roles Table and Connect Your Staff Account

## Problem
The `user_roles` table was never actually created in the database -- the migration ended up as a no-op. The login page and auth gate code are already in place but fail because the table they reference doesn't exist.

## What I'll Do

### 1. Create the database migration
Run a migration to create:
- The `app_role` enum type (`admin`, `staff`)
- The `user_roles` table (with `user_id` referencing auth users and a `role` column)
- RLS policies so users can read their own roles
- The `has_role()` security definer function used by RLS policies on orders/order_items

### 2. Update RLS policies on orders and order_items
- Replace the current `SELECT` policy on `orders` (which uses `USING (false)` -- blocking all reads) with one that allows authenticated staff/admin to read orders
- Tighten the `order_items` SELECT policy to staff/admin only (currently public)

### 3. Add your staff account's role
After the table is created, insert a row linking your auth user to the `staff` role so you can log in at `/staff/login` and access the kitchen dashboard.

## No Code Changes Needed
The `StaffLogin.tsx`, `KitchenAuthGate.tsx`, and `KitchenDashboard.tsx` files are already correctly implemented from the previous work. This is purely a database fix.

## Technical Details

**Migration SQL (key parts):**
```text
CREATE TYPE public.app_role AS ENUM ('admin', 'staff');

CREATE TABLE public.user_roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL,
  UNIQUE (user_id, role)
);

ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own roles" ON public.user_roles
  FOR SELECT TO authenticated
  USING (auth.uid() = user_id);

CREATE OR REPLACE FUNCTION public.has_role(...)
  -- security definer function to check roles without RLS recursion

-- Replace orders SELECT policy
DROP POLICY IF EXISTS "Select own order by id" ON public.orders;
CREATE POLICY "Staff can view orders" ON public.orders
  FOR SELECT TO authenticated
  USING (has_role(auth.uid(), 'admin') OR has_role(auth.uid(), 'staff'));

-- Tighten order_items SELECT
DROP POLICY IF EXISTS "Anyone can view order items" ON public.order_items;
CREATE POLICY "Staff can view order items" ON public.order_items
  FOR SELECT TO authenticated
  USING (has_role(auth.uid(), 'admin') OR has_role(auth.uid(), 'staff'));

-- Insert your staff role (using the user ID from auth)
INSERT INTO public.user_roles (user_id, role)
SELECT id, 'staff' FROM auth.users LIMIT 1;
```

The last line assigns the `staff` role to the first auth user found -- which should be the account you just created.

