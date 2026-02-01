
# Fix Analytics Dashboard Access

## Current Issues

| Problem | Cause | Solution |
|---------|-------|----------|
| 404 on live site (nawacafe.com/visitors) | Frontend changes not published | Click Publish → Update |
| Need password | Stored in ADMIN_PASSWORD_HASH secret | Use `CafeAdmin2026!` |

## What's Actually Working

The code is correct:
- Route `/visitors` exists in App.tsx (line 58)
- AnalyticsDashboard redirects to `/staff/login` when not authenticated
- StaffLogin calls `admin-login` edge function
- Edge function validates password against `ADMIN_PASSWORD_HASH`
- On success, stores token and redirects to `/visitors`

## Steps to Fix

### Step 1: Publish Frontend Changes
Frontend code changes require manual publishing:
1. Click the **Publish** button (top right)
2. Click **Update** in the dialog
3. Wait for deployment to complete

### Step 2: Test the Login Flow
1. Go to `nawacafe.com/staff/login`
2. Enter password: `CafeAdmin2026!`
3. You'll be redirected to the analytics dashboard

## Password Info

The staff password is stored in the `ADMIN_PASSWORD_HASH` environment variable. According to the project memory, this is currently set to:

```text
CafeAdmin2026!
```

If you want to change it, you can update the secret in your backend settings.

## Dashboard Features (Already Built)

Once you access `/visitors`, you'll see:

| Section | What it shows |
|---------|---------------|
| Quick summary bar | Browsing now, total visitors, orders |
| Overview cards | 6 key metrics with cafe-friendly labels |
| Live activity table | Real-time visitors currently on site |
| Visitors chart | Traffic over time (hourly/daily) |
| Device breakdown | Mobile vs desktop pie chart |
| Top pages | Most viewed pages bar chart |
| Conversion funnel | Page views → Menu → Cart → Checkout → Order |
| Menu item stats | Most popular items and add-to-cart rates |
| Sessions table | Detailed list of all visitor sessions |

Real-time updates are enabled via backend subscriptions.

## After It Works

Once you confirm the dashboard loads correctly, we can:
1. Add a separate password just for analytics (if needed)
2. Customize the dashboard layout for your team
3. Add more metrics like revenue or peak hours
