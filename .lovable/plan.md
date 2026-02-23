

# Plan: Insert CSV #5 Cards (135-167) and Fix Display Order

## Current State

Cards 135-167 already exist in the database from a previous attempt, but with **wrong categories** (e.g., matcha items dumped under "cold-beverages", teas under "coffee"). They need to be deleted and re-inserted correctly.

The frontend also has a display bug: items are grouped by subcategory into separate grids, breaking the card_number sequence.

## Part 1: Database -- Delete and Re-insert Cards 135-167

Delete all existing cards 135-167, then insert all 33 cards fresh with correct data from the CSV.

**Category assignments based on the established menu sequence:**

| Cards | Category | Items |
|-------|----------|-------|
| 135 | infusion | HIBISCUS FRUIT BOTTEL 1 LT |
| 136-139 | fresh-juice | Orange Juice, Lemon mint Juice, NAWA Dragon Fruit, ORA COLADA |
| 140-142 | fresh-juice | Coca-Cola 290ml, Cola Light 290ml, Sprite 290ml |
| 143-150 | matcha | Matcha Latte through MATCHA WITH ROSE ICE CREAM |
| 151-154 | nawa-special-tea | EARL GREY SPECIAL through NAWA SPECIAL BLACK TEA |
| 155 | appetisers | Burrata with cherry roasted tomatoes |
| 156-157 | nawa-breakfast | Focaccia Halloumi Sandwich, Best Ever Avocado Sandwich |
| 158-165 | nawa-breakfast | Plain Croissant through HAZELNUTS CROISSANT |
| 166-167 | pastries | NAWA Cookie, NAWA Cookies - Box of 6 |

All titles, prices, descriptions, and image URLs taken exactly from the CSV. Cards 1-134 are NOT touched.

## Part 2: Frontend -- Fix Card Display Order

Two files change. No data affected.

### `src/hooks/useMenuItems.ts`
- Change `groupMenuItems` to return a flat array per category (`{ [category]: MenuItem[] }`) sorted by `card_number`, instead of nested subcategory objects.

### `src/components/Menu.tsx`
- Remove the inner `Object.entries(categoryData)` loop (lines 214-257) that creates separate grids per subcategory.
- Render one single grid per category with all items in `card_number` order.
- Remove subcategory headers entirely -- they were splitting the sequential flow.

## Result
- 167 cards total, all in perfect 1-167 sequential order in the database
- Frontend renders each category as one grid, cards flowing in card_number order
- Cards 1-134 completely untouched

