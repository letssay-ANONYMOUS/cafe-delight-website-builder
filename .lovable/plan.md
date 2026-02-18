

## Fix: Reorder Menu Categories to Match Card Number Sequence

### Problem
The `menuCategories` array in `src/hooks/useMenuItems.ts` controls the order categories appear on the menu page. Currently, this array order does not match the card number sequence from the database. For example:
- `cold-beverages` starts at card 43 but is listed 15th in the array
- `manual-brew` starts at card 59 but is listed 3rd

Within each category, items are already correctly sorted by `display_order` from the database query. The only fix needed is reordering the `menuCategories` array.

### What Changes
**Single file edit:** `src/hooks/useMenuItems.ts`

Reorder the `menuCategories` array to match the card number sequence from the database:

| Order | Category | First Card |
|-------|----------|------------|
| 1 | NAWA Breakfast | 1 |
| 2 | COFFEE | 24 |
| 3 | Cold Beverages | 43 |
| 4 | MANUAL BREW | 59 |
| 5 | Lunch and Dinner | 64 |
| 6 | Appetisers | 67 |
| 7 | Pasta | 74 |
| 8 | RISOTTO | 77 |
| 9 | Spanish Dishes | 82 |
| 10 | Burgers | 84 |
| 11 | Sharing Meal | (if items exist) |
| 12 | Fries | 92 |
| 13 | Club Sandwich | 95 |
| 14 | Kids Meals | 96 |
| 15 | Pastries and Desserts | 99 |
| 16 | Mojito | 126 |
| 17 | Water | 131 |
| 18 | Infusion | 134 |
| 19 | Fresh Juice | 136 |
| 20 | Matcha | 143 |
| 21 | NAWA Special Tea | 151 |
| 22 | Arabic Coffee | (if items exist) |
| 23 | NAWA Summer | (if items exist) |

### What Does NOT Change
- No database changes
- No changes to any other file
- No changes to card data, images, prices, or descriptions
- The items within each category remain sorted by their existing `display_order` from the database

