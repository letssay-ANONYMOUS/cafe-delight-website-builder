
-- Create the menu_cards SQL table (read-only reference)
CREATE TABLE public.menu_cards (
  id INTEGER PRIMARY KEY,
  price TEXT,
  name TEXT,
  description TEXT,
  image_url TEXT
);

-- Enable RLS
ALTER TABLE public.menu_cards ENABLE ROW LEVEL SECURITY;

-- Read-only policy
CREATE POLICY "Menu cards are viewable by everyone"
ON public.menu_cards
FOR SELECT
USING (true);
