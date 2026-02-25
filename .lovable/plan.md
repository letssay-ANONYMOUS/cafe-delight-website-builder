
# Create Staff Account (nawacafe22@gmail.com)

## Problem
The auth system has no users. The email provider is enabled but no account has been created yet. The credentials provided are:
- Email: nawacafe22@gmail.com
- Password: Nawa@22*2

## Plan

### 1. Create a one-time setup edge function (`create-staff-user`)
This backend function will:
- Use the service role key to create the user via the admin auth API (`supabase.auth.admin.createUser`)
- Set `email_confirm: true` so the account is immediately usable
- Insert a row into `user_roles` with the `staff` role for the new user
- Return success/failure

### 2. Call the edge function to create the account
After deploying, I'll invoke it to create the user and assign the `staff` role.

### 3. Verify
Query `auth.users` and `user_roles` to confirm the account and role were created.

### 4. Clean up
Delete the edge function after use since it's a one-time setup utility.

## No UI Changes Needed
The `StaffLogin.tsx` page already handles email/password login via `signInWithPassword()`. Once the account exists, logging in at `/staff/login` will work immediately.
