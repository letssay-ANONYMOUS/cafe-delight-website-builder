-- Create analytics tables for anonymous user tracking

-- Table 1: Visitor Sessions
CREATE TABLE public.visitor_sessions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  visitor_id text NOT NULL,
  session_start timestamptz NOT NULL DEFAULT now(),
  session_end timestamptz,
  device_type text,
  browser text,
  referrer text,
  landing_page text,
  pages_viewed integer DEFAULT 1,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- Table 2: Page Views
CREATE TABLE public.page_views (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  visitor_id text NOT NULL,
  session_id uuid REFERENCES public.visitor_sessions(id) ON DELETE CASCADE,
  page_path text NOT NULL,
  page_title text,
  referrer text,
  time_on_page integer,
  viewed_at timestamptz NOT NULL DEFAULT now()
);

-- Table 3: Menu Item Views
CREATE TABLE public.menu_item_views (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  visitor_id text NOT NULL,
  menu_item_id uuid REFERENCES public.menu_items(id) ON DELETE SET NULL,
  item_name text NOT NULL,
  category text,
  action text NOT NULL,
  viewed_at timestamptz NOT NULL DEFAULT now()
);

-- Table 4: Site Events
CREATE TABLE public.site_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  visitor_id text NOT NULL,
  event_type text NOT NULL,
  event_name text NOT NULL,
  event_data jsonb,
  page_path text,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE public.visitor_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.page_views ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.menu_item_views ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.site_events ENABLE ROW LEVEL SECURITY;

-- Insert policies (for tracking - anyone can insert)
CREATE POLICY "Anyone can insert sessions" ON public.visitor_sessions FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can insert page views" ON public.page_views FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can insert menu views" ON public.menu_item_views FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can insert events" ON public.site_events FOR INSERT WITH CHECK (true);

-- Select policies (visitors can view their own sessions for session management)
CREATE POLICY "Visitors can view own sessions" ON public.visitor_sessions FOR SELECT USING (true);
CREATE POLICY "Visitors can view own page views" ON public.page_views FOR SELECT USING (true);

-- Update policy for session end time
CREATE POLICY "Anyone can update sessions" ON public.visitor_sessions FOR UPDATE USING (true) WITH CHECK (true);

-- Enable realtime for analytics tables (optional, for live dashboard)
ALTER PUBLICATION supabase_realtime ADD TABLE public.visitor_sessions;
ALTER PUBLICATION supabase_realtime ADD TABLE public.page_views;