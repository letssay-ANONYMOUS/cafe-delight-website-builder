

# Menu Cards Full Replacement Plan

## Overview

You will send 5 CSV files containing all 167 menu cards. I will replace the entire menu database with this new data, processing each CSV sequentially without touching previously inserted cards.

## How It Works

Since the menu is entirely database-driven (fetched from the backend `menu_items` table), the process is:

1. **Step 1 (on your first CSV):** Delete ALL existing menu items from the database, then insert the cards from CSV #1
2. **Step 2 (CSV #2):** Insert ONLY the new cards -- no modifications to CSV #1 cards
3. **Step 3 (CSV #3):** Insert ONLY the new cards -- no modifications to CSV #1 or #2 cards
4. **Step 4 (CSV #4):** Insert ONLY the new cards -- no modifications to previous cards
5. **Step 5 (CSV #5):** Insert ONLY the new cards -- no modifications to previous cards

No frontend code changes are needed. The menu page already reads from the database dynamically.

## Strict Rules I Will Follow

- Each CSV batch is an INSERT-only operation (after the initial cleanup)
- Previously inserted cards are never touched, updated, or re-inserted
- Card numbers, titles, prices, descriptions, categories, images, and options will be set exactly as provided in each CSV
- I will confirm the count of inserted cards after each batch

## What I Need From You

Go ahead and send CSV #1 whenever you are ready. For each CSV, please include:
- Card number
- Title
- Description
- Price
- Category
- Subcategory (if any)
- Image URL/path
- Options (if any, e.g. bean selections)
- Tags (if any)

