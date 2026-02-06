
# Kitchen Alert: Pending Trigger + Cross-Device Audio Sync

## Overview

Two changes requested:
1. **Testing Mode**: Trigger alert sound on NEW PENDING orders instead of PAID orders
2. **Cross-Device Sync**: Make your custom MP3 audio file available on all devices running the kitchen dashboard

---

## Problem with Current Custom Audio

Currently, when you add a custom MP3 URL via the Sound Picker, it saves to `localStorage` on that specific browser/device only. Other devices (tablets, phones, other computers) won't have access to that URL.

**Solution**: Store the custom audio URL in the database so all kitchen dashboard instances can read it.

---

## Technical Changes

### 1. Create Database Table for Kitchen Settings

Create a new table `kitchen_settings` to store shared settings like the custom audio URL:

```sql
CREATE TABLE public.kitchen_settings (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  setting_key text UNIQUE NOT NULL,
  setting_value text,
  updated_at timestamp with time zone DEFAULT now()
);

-- Allow authenticated staff to read/write
ALTER TABLE public.kitchen_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow all access to kitchen settings" 
  ON public.kitchen_settings FOR ALL USING (true);
```

### 2. Update KitchenDashboard.tsx

**File**: `src/pages/KitchenDashboard.tsx`

**Change A - Load custom audio from database on mount:**
```tsx
// Add effect to load custom audio URL from database
useEffect(() => {
  const loadSharedSettings = async () => {
    const { data } = await supabase
      .from('kitchen_settings')
      .select('setting_value')
      .eq('setting_key', 'custom_audio_url')
      .single();
    
    if (data?.setting_value) {
      setCustomAudioUrl(data.setting_value);
      setSelectedSound('custom');
    }
  };
  loadSharedSettings();
}, []);
```

**Change B - Save to database when custom URL is set:**
```tsx
const handleSoundSelect = async (soundId: string, customUrl?: string) => {
  setSelectedSound(soundId);
  localStorage.setItem('kitchen_alert_sound', soundId);
  
  if (customUrl) {
    setCustomAudioUrl(customUrl);
    // Save to BOTH localStorage (fallback) and database (sync)
    localStorage.setItem('kitchen_alert_custom_url', customUrl);
    
    await supabase
      .from('kitchen_settings')
      .upsert({ 
        setting_key: 'custom_audio_url', 
        setting_value: customUrl,
        updated_at: new Date().toISOString()
      }, { onConflict: 'setting_key' });
  }
  
  toast({...});
};
```

**Change C - Switch alert trigger from PAID to PENDING:**

In the INSERT handler (around line 241-258):
```tsx
// BEFORE: Pending orders silent
if (newOrder.payment_status === 'pending') {
  toast({...}); // toast only
}

// AFTER: Pending orders trigger alert (FOR TESTING)
if (newOrder.payment_status === 'pending') {
  setUnacknowledgedOrders(prev => new Set([...prev, newOrder.id]));
  setActiveView("pending");
  toast({
    title: "📋 New Pending Order!",
    description: `Order ${newOrder.order_number} from ${newOrder.customer_name}`,
    className: "bg-yellow-50 border-yellow-300"
  });
}
```

In the UPDATE handler (around line 274-284):
```tsx
// BEFORE: Paid orders trigger alert
if (updatedOrder.payment_status === 'paid' && oldOrder.payment_status !== 'paid') {
  setUnacknowledgedOrders(prev => new Set([...prev, updatedOrder.id]));
  ...
}

// AFTER: Commented out for testing
// DISABLED FOR TESTING - uncomment to restore paid order alerts
// if (updatedOrder.payment_status === 'paid' && oldOrder.payment_status !== 'paid') {
//   setUnacknowledgedOrders(prev => new Set([...prev, updatedOrder.id]));
//   ...
// }
```

---

## How It Works After Implementation

### Alert Trigger (Testing Mode)
```
New Order Created (pending) → INSERT event
       ↓
Add to unacknowledgedOrders set
       ↓
Alert sound starts playing!
       ↓
Staff acknowledges → sound stops
```

### Custom Audio Sync
```
Device A: Sets custom MP3 URL
       ↓
URL saved to database + localStorage
       ↓
Device B, C, D: Open kitchen dashboard
       ↓
Load custom URL from database
       ↓
All devices play same MP3!
```

---

## Files to Modify

| File | Changes |
|------|---------|
| Database | Create `kitchen_settings` table |
| `src/pages/KitchenDashboard.tsx` | Load/save custom URL from database, switch trigger to pending |

---

## Reverting After Testing

To switch back to production mode (paid orders trigger):
1. Remove the `setUnacknowledgedOrders` call from the INSERT handler
2. Uncomment the UPDATE handler code for paid orders
