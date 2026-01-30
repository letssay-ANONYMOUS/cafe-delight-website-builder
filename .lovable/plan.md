

# Database-Driven Menu Verification & Migration Plan

## Current State Analysis

### What I Found

| Aspect | Hardcoded File (`menuData.ts`) | Database (`menu_items`) |
|--------|-------------------------------|------------------------|
| Total Items | ~153 items | 153 items |
| Data Source | Local file, not connected | Supabase SQL database |
| Currently Used By Website | YES (hardcoded) | NO (ignored) |
| Has Display Order | By array position | NO column exists |
| Has Unique Integer IDs | Yes (1-153) | No (only UUID) |

### Critical Discrepancies Found

**1. Price Differences:**
- Hardcoded: "Loaded Avocado Toast" = AED 51
- Database: "Loaded avocado toast" = AED 49

- Hardcoded: "Croque Madame" = AED 47
- Database: "Croque Madame" = AED 45

**2. Image Sources:**
- Hardcoded uses: `/menu-images/card-6-croque-madame.jpg` (local files)
- Database uses: `https://images.mydigimenu.com/...` (external URLs)

**3. Missing Database Columns:**
- No `display_order` column to control card sequence (1-153)
- No integer `card_number` to match the client's master list
- No `options` column for Manual Brew items (V60, Chemex)

**4. Duplicate Items:**
- Database has 2 "Turkish Eggs" entries with different prices (46 and 40)
- Hardcoded has Turkish Eggs at ID 7 (AED 42) and ID 10 (AED 40)

---

## Solution: Complete Database Verification & Migration

### Phase 1: Add Required Columns to Database

Add the following columns to the `menu_items` table:

| Column | Type | Purpose |
|--------|------|---------|
| `display_order` | INTEGER | Controls visual sequence (1-153) |
| `card_number` | INTEGER | Matches client's master list |
| `options` | JSONB | Stores configurable choices (Manual Brew) |
| `subcategory` | TEXT | Visual grouping (e.g., "Savoury", "Hot Coffee") |

Create an index on `display_order` for fast ordering queries.

### Phase 2: Data Verification & Sync

Before migration, I will:

1. **Export all 153 items from hardcoded file** with:
   - Card Number (1-153)
   - Name
   - Price
   - Image Path
   - Description
   - Category

2. **Compare against database** item by item:
   - Match by name (case-insensitive)
   - Flag price discrepancies
   - Flag missing descriptions
   - Flag image URL differences

3. **Create verification report** showing:
   - Exact matches
   - Items needing price updates
   - Items needing description updates
   - Items with wrong image URLs

### Phase 3: Database Update

After verification, update database to match the hardcoded data exactly:

1. Set `display_order` and `card_number` for all 153 items
2. Update prices to match hardcoded values
3. Add missing descriptions
4. Update image URLs to use local paths or fix broken external URLs
5. Configure `options` JSONB for Manual Brew items (V60, Chemex)

### Phase 4: Frontend Migration

Update the website to fetch from SQL database instead of hardcoded file:

1. Create `useMenuItems` hook using React Query
2. Modify `Menu.tsx` to query database
3. Order results by `display_order` column
4. Add lazy loading for images
5. Keep hardcoded file as backup/fallback

---

## Database Schema After Migration

```text
menu_items table:
- id (UUID, primary key)
- card_number (INTEGER, unique) -- NEW: 1-153
- display_order (INTEGER) -- NEW: controls visual sequence
- title (TEXT, not null)
- description (TEXT)
- price (NUMERIC, not null)
- category (TEXT, not null)
- subcategory (TEXT) -- NEW: visual grouping
- image_url (TEXT)
- options (JSONB) -- NEW: for configurable items
- tags (ARRAY)
- published (BOOLEAN)
- created_at (TIMESTAMP)
- updated_at (TIMESTAMP)
```

---

## Verification Checklist (Card by Card)

Before going live, each card will be verified:

| Check | Status |
|-------|--------|
| Card 1: Name matches | Pending |
| Card 1: Price matches | Pending |
| Card 1: Image loads | Pending |
| Card 1: Description present | Pending |
| ... | ... |
| Card 153: All fields verified | Pending |

---

## Technical Details

### Options JSONB Structure (for V60, Chemex)

```text
{
  "groups": [
    {
      "groupName": "Choice Of: Manual Brew",
      "selectHint": "Select 1 of 5",
      "maxSelect": 1,
      "required": true,
      "choices": [
        { "name": "COLOMBIA PASSION FRUITS", "price": 35 },
        { "name": "ETHIOPIA SIDAMA", "price": 32 },
        { "name": "BRAZIL CHOCOLATE", "price": 30 }
      ]
    },
    {
      "groupName": "Hot or Cold",
      "selectHint": "Select 1 of 2",
      "maxSelect": 1,
      "required": true,
      "choices": [
        { "name": "Hot", "price": 0 },
        { "name": "Iced", "price": 0 }
      ]
    }
  ]
}
```

### React Query Hook

```text
// useMenuItems.ts
- Fetches from Supabase menu_items table
- Orders by display_order ASC
- Caches for 5 minutes (stale time)
- Groups by category/subcategory for display
```

---

## Files to Modify

| File | Changes |
|------|---------|
| Database Schema | Add 4 new columns + index |
| Database Data | Update all 153 items |
| `src/hooks/useMenuItems.ts` | NEW: React Query hook |
| `src/components/Menu.tsx` | Fetch from database |
| `src/components/MenuCard.tsx` | Lazy image loading |
| `src/pages/MenuItemDetail.tsx` | Read options from DB |

---

## Benefits After Implementation

1. Single source of truth in SQL database
2. Card sequence controlled by `display_order` column
3. Easy admin updates without code deployment
4. Fast performance with proper indexing
5. Full data integrity with verified 153 items

