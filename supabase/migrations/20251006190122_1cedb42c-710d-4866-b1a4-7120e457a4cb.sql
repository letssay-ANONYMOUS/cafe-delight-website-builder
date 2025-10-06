-- Create storage bucket for menu item images
INSERT INTO storage.buckets (id, name, public)
VALUES ('menu-images', 'menu-images', true);

-- Create menu_items table
CREATE TABLE public.menu_items (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  price DECIMAL(10, 2) NOT NULL,
  category TEXT NOT NULL,
  tags TEXT[],
  image_url TEXT,
  published BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create RLS policies for public read access
ALTER TABLE public.menu_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Menu items are viewable by everyone" 
ON public.menu_items 
FOR SELECT 
USING (published = true);

-- Storage policies for menu images
CREATE POLICY "Menu images are publicly accessible" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'menu-images');

CREATE POLICY "Anyone can upload menu images" 
ON storage.objects 
FOR INSERT 
WITH CHECK (bucket_id = 'menu-images');

CREATE POLICY "Anyone can update menu images" 
ON storage.objects 
FOR UPDATE 
USING (bucket_id = 'menu-images');

CREATE POLICY "Anyone can delete menu images" 
ON storage.objects 
FOR DELETE 
USING (bucket_id = 'menu-images');

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_menu_items_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_menu_items_updated_at
BEFORE UPDATE ON public.menu_items
FOR EACH ROW
EXECUTE FUNCTION public.update_menu_items_updated_at();