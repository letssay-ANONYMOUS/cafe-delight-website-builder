

# Complete Kitchen Alert + Payment Verification System

## Summary
This plan addresses three interconnected requirements:
1. **Fix payment flow**: When customer pays on Ziina and returns to success page, verify payment and update order to `paid`
2. **Trigger alerts on PAID orders**: Sound plays when order becomes paid (after successful payment verification)
3. **Stacked stop buttons**: Each paid order gets its own stop button so staff knows exactly how many orders came in

---

## How the Complete Flow Will Work

```text
Customer Journey                          Kitchen Dashboard
─────────────────                          ─────────────────
1. Add items to cart
2. Click "Pay" → Order saved as PENDING → [Order appears in Pending table]
3. Redirected to Ziina payment page         (No sound yet)
4. Completes payment on Ziina
5. Redirected to /payment-success?payment_id=xxx&order_id=yyy
6. Success page calls verify-ziina-payment
7. Edge function verifies with Ziina API
8. If paid → Updates order to PAID ──────→ [Realtime UPDATE fires]
                                            ↓
                                           SOUND PLAYS!
                                           [Stop button appears]
                                           [Order moves to Paid table]
```

---

## Changes Overview

| File | Action | Purpose |
|------|--------|---------|
| `supabase/functions/verify-ziina-payment/index.ts` | CREATE | Verify payment with Ziina API, update order status |
| `supabase/functions/create-ziina-checkout/index.ts` | MODIFY | Add order_id to success URL |
| `supabase/config.toml` | MODIFY | Add new function config |
| `src/pages/PaymentSuccessPage.tsx` | MODIFY | Call verification endpoint, handle real results |
| `src/pages/KitchenDashboard.tsx` | MODIFY | Trigger alert on PAID (not pending), stacked stop buttons |

---

## Detailed Changes

### 1. Create Payment Verification Edge Function

**New File:** `supabase/functions/verify-ziina-payment/index.ts`

This function will:
- Receive `payment_id` and `order_id` from the success page
- Call Ziina API: `GET https://api-v2.ziina.com/api/payment_intent/{payment_id}`
- Check if status is `completed`
- Update the order in database to `payment_status: 'paid'`
- Return success/failure to frontend

```typescript
// Pseudocode flow:
1. Parse payment_id, order_id from request
2. Fetch payment status from Ziina API
3. If status === 'completed':
   - UPDATE orders SET payment_status='paid', paid_at=now() WHERE id=order_id
   - Return { success: true, order_number }
4. Else:
   - Return { success: false, status: actualStatus }
```

### 2. Update Ziina Checkout to Include Order ID in Success URL

**File:** `supabase/functions/create-ziina-checkout/index.ts`

Current (line 57):
```typescript
success_url: `${origin}/payment-success`,
```

Change to:
```typescript
success_url: `${origin}/payment-success?payment_id=${ziinaData.id}&order_id=${orderData.id}`,
```

Note: The order is already created before Ziina returns the payment ID, so we need to restructure slightly - create order first, get ID, then build success URL.

### 3. Update Payment Success Page

**File:** `src/pages/PaymentSuccessPage.tsx`

Replace the fake 2-second timer with real verification:

```typescript
useEffect(() => {
  const paymentId = searchParams.get('payment_id');
  const orderId = searchParams.get('order_id');
  
  if (!paymentId || !orderId) {
    setError('Missing payment information');
    setVerifying(false);
    return;
  }
  
  // Call the verification edge function
  supabase.functions.invoke('verify-ziina-payment', {
    body: { payment_id: paymentId, order_id: orderId }
  }).then(({ data, error }) => {
    if (error || !data?.success) {
      setError('Payment verification failed');
    } else {
      setOrderNumber(data.order_number);
    }
    setVerifying(false);
  });
}, []);
```

### 4. Move Alert Trigger to PAID Orders + Stacked Stop Buttons

**File:** `src/pages/KitchenDashboard.tsx`

#### 4a. Trigger on UPDATE to paid (not INSERT pending)

In the realtime subscription UPDATE handler (line 262-282):
```typescript
// When order changes TO 'paid' - trigger alert
if (updatedOrder.payment_status === 'paid' && oldOrder.payment_status !== 'paid') {
  // ADD to unacknowledged set - triggers sound
  setUnacknowledgedOrders(prev => new Set([...prev, updatedOrder.id]));
  // Auto-switch to paid view
  setActiveView("paid");
  toast({ title: "💰 New Paid Order!", ... });
}
```

In the INSERT handler (line 241-252):
```typescript
// Remove alert trigger for pending - just show toast
if (newOrder.payment_status === 'pending') {
  // NO sound, just notification
  toast({ title: "📋 New Pending Order", ... });
}
```

#### 4b. Stacked Stop Buttons (one per order)

Replace the single "Stop Alert" button with a stack of buttons - one for each unacknowledged order:

```tsx
{/* Stacked Stop Buttons - one per unacknowledged order */}
{isPlaying && Array.from(unacknowledgedOrders).map((orderId) => {
  const order = orders.find(o => o.id === orderId);
  return (
    <Button
      key={orderId}
      variant="destructive"
      size="default"
      onClick={() => {
        handleAcknowledge(orderId);
        toast({ 
          title: "Order Acknowledged",
          description: `Order ${order?.order_number || orderId.slice(0,8)} acknowledged.`
        });
      }}
      className="flex items-center gap-2 animate-pulse shadow-lg"
    >
      <VolumeX className="w-5 h-5" />
      <span className="font-semibold">
        Stop #{order?.order_number?.split('-').pop() || '???'}
      </span>
    </Button>
  );
})}
```

This means:
- 1 order paid → 1 stop button
- 2 orders paid → 2 stop buttons stacked
- 10 orders paid → 10 stop buttons stacked
- Staff must click each one to acknowledge, ensuring they see every order

---

## Technical Architecture

```text
┌─────────────────────────────────────────────────────────────────┐
│                      PAYMENT VERIFICATION FLOW                  │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  Customer pays on Ziina                                         │
│         ↓                                                       │
│  Redirected to: /payment-success?payment_id=pi_xxx&order_id=123 │
│         ↓                                                       │
│  PaymentSuccessPage calls verify-ziina-payment                  │
│         ↓                                                       │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │ verify-ziina-payment Edge Function                       │   │
│  │  1. GET ziina.com/api/payment_intent/{pi_xxx}           │   │
│  │  2. Check: status === 'completed'?                       │   │
│  │  3. UPDATE orders SET payment_status='paid' WHERE id=123 │   │
│  └─────────────────────────────────────────────────────────┘   │
│         ↓                                                       │
│  Supabase Realtime fires UPDATE event                           │
│         ↓                                                       │
│  KitchenDashboard receives update                               │
│         ↓                                                       │
│  Order ID added to unacknowledgedOrders Set                     │
│         ↓                                                       │
│  SOUND PLAYS + STOP BUTTON APPEARS                              │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## Stacked Stop Buttons Visual

```text
When 3 customers pay simultaneously:

┌──────────────────────────────────────────────────────────────┐
│  Kitchen Dashboard Header                                     │
│                                                              │
│  ┌─────────────────────┐  ┌─────────────────────┐            │
│  │ 🔇 Stop #001       │  │ Sound: On           │            │
│  └─────────────────────┘  └─────────────────────┘            │
│  ┌─────────────────────┐                                     │
│  │ 🔇 Stop #002       │  ← Each button is pulsing red       │
│  └─────────────────────┘                                     │
│  ┌─────────────────────┐                                     │
│  │ 🔇 Stop #003       │  ← Staff clicks each to acknowledge │
│  └─────────────────────┘                                     │
│                                                              │
│  🔴 3 New!  [Sound Picker] [Refresh] [Logout]               │
└──────────────────────────────────────────────────────────────┘
```

Staff must click 3 times → they know there are 3 orders to prepare.

---

## Security Considerations

1. **Payment Reference Validation**: The verification function checks that `payment_reference` matches the provided `payment_id` to prevent order tampering
2. **Idempotency**: Only updates orders that are still in `pending` status to prevent duplicate updates
3. **Service Role Key**: Edge function uses service role to update orders (bypasses RLS)

---

## Testing Recommendations

After implementation:
1. Place a test order and complete payment on Ziina
2. Verify the success page shows real verification (not fake timer)
3. Confirm kitchen dashboard shows the order move from Pending to Paid
4. Confirm sound plays ONLY when order becomes paid
5. Test with 2+ orders to verify stacked stop buttons work correctly

