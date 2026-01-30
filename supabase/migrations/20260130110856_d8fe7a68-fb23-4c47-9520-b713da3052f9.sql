-- Add new columns for menu ordering and configuration
ALTER TABLE public.menu_items 
ADD COLUMN IF NOT EXISTS display_order INTEGER,
ADD COLUMN IF NOT EXISTS card_number INTEGER,
ADD COLUMN IF NOT EXISTS options JSONB,
ADD COLUMN IF NOT EXISTS subcategory TEXT;

-- Create index for fast ordering queries
CREATE INDEX IF NOT EXISTS idx_menu_items_display_order ON public.menu_items(display_order);

-- Create unique constraint on card_number
CREATE UNIQUE INDEX IF NOT EXISTS idx_menu_items_card_number ON public.menu_items(card_number) WHERE card_number IS NOT NULL;