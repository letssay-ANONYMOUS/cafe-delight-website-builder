-- Create kitchen_settings table for cross-device settings sync
CREATE TABLE public.kitchen_settings (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  setting_key text UNIQUE NOT NULL,
  setting_value text,
  updated_at timestamp with time zone DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.kitchen_settings ENABLE ROW LEVEL SECURITY;

-- Allow all access (staff dashboard is already protected by login)
CREATE POLICY "Allow read access to kitchen settings" 
  ON public.kitchen_settings FOR SELECT USING (true);

CREATE POLICY "Allow insert access to kitchen settings" 
  ON public.kitchen_settings FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow update access to kitchen settings" 
  ON public.kitchen_settings FOR UPDATE USING (true) WITH CHECK (true);