

# Plan: Create Pure SQL Menu Table in Supabase Backend

## What You Get

A clean SQL table called `menu_cards` directly in your Supabase backend with all 167 items from your file. You can open it in Supabase, see every row, and verify everything is correct.

## Step 1: Create the Table (Database Migration)

Run a single migration that:
- Creates the `menu_cards` table with these columns:
  - `id` (integer, primary key) -- card number 1 through 167
  - `name` (text) -- item name exactly from the file
  - `price` (text) -- price as shown (e.g. "AED 48.00")
  - `description` (text, nullable) -- item description
  - `image_url` (text, nullable) -- the image link
- Enables RLS with a SELECT policy so the table is readable

## Step 2: Insert All 167 Rows

Insert every single item from your file, character-for-character:

| Range | Items |
|-------|-------|
| 1-11 | Truffle Omelette Toast through Loaded avocado toast |
| 12-22 | Beetroot Avocado Toast through Egg Croissant |
| 23-40 | Espresso through Affogato |
| 41-56 | Iced Americano through CREAMY ESPRESSO |
| 57-60 | Chemex through Cold Brew |
| 61-62 | COFFE & CREAMY FULFFY CROISSANT, COFFE & TACOS PANCAKE |
| 63-66 | NAWA Mixed Sesame Salad through NAWA Special Salad |
| 67-75 | Truffle Aranchini Balls through Classic Cheese Chicken Wrap |
| 76-79 | Alfredo Penne Pasta through PINK PENNE PASTA with CHICKEN |
| 80-86 | Truffle Mushroom Risotto Chicken through CREAMY PESTO BASIL RISOTTO |
| 87-88 | PAELLA DE MARISCO, PAELLA DE POLLO |
| 89-96 | NAWA Signature Fried Chicken Burger through BLACK & WHITE |
| 97-99 | PLAIN FRIES through NAWA Classic Cheese Fries |
| 100 | NAWA SPECIAL CLUB SANDWICH |
| 101-103 | NAWA Kid's Beef Slider through NAWA Kid's Chicken Strips |
| 104-121 | HANINI CREME BRULE through San Sebastian Cheesecake |
| 122-134 | Acai Bowl through HIMALAYAN STILL WATER 750 ML |
| 135 | HIBISCUS FRUIT BOTTLE 1 LT |
| 136-139 | Orange Juice through ORA COLADA |
| 140-142 | Coca-Cola 290ml through Sprite 290ml |
| 143-150 | Matcha Latte through MATCHA WITH ROSE ICE CREAM |
| 151-154 | EARL GREY SPECIAL through NAWA SPECIAL BLACK TEA |
| 155 | Burrata with cherry roasted tomatoes |
| 156-157 | Focaccia Halloumi Sandwich, Best Ever Avocado Sandwich |
| 158-165 | Plain Croissant through HAZELNUTS CROISSANT |
| 166-167 | NAWA Cookie, NAWA Cookies - Box of 6 |

All names, prices, descriptions, and image URLs copied exactly from your file. No modifications, no interpretation.

## What This Does NOT Touch

- The existing `menu_items` table stays completely untouched
- No frontend code changes
- No edge function changes

## Technical Details

- Table: `menu_cards` (simple, clean name)
- Primary key: `id` integer (1-167)
- RLS: SELECT-only policy (read-only, nobody can modify it from the frontend)
- All data inserted via the data operation tool, not migrations
- You will be able to see it immediately in your Supabase dashboard under Tables

