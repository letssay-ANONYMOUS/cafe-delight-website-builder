-- Create anonymous_visitors table for essential tracking (no consent required)
CREATE TABLE public.anonymous_visitors (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  visitor_id text NOT NULL,
  fingerprint text,
  ip_address text,
  country text,
  city text,
  browser text,
  browser_version text,
  os text,
  device_type text,
  screen_resolution text,
  timezone text,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  last_seen_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Create index on visitor_id for fast lookups
CREATE INDEX idx_anonymous_visitors_visitor_id ON public.anonymous_visitors(visitor_id);
CREATE INDEX idx_anonymous_visitors_last_seen ON public.anonymous_visitors(last_seen_at DESC);

-- Enable RLS
ALTER TABLE public.anonymous_visitors ENABLE ROW LEVEL SECURITY;

-- Allow public insert for tracking
CREATE POLICY "Anyone can insert anonymous visitors"
ON public.anonymous_visitors
FOR INSERT
WITH CHECK (true);

-- Allow public update for last_seen_at
CREATE POLICY "Anyone can update anonymous visitors"
ON public.anonymous_visitors
FOR UPDATE
USING (true)
WITH CHECK (true);

-- Allow public select (for dashboard, will be protected by app-level auth)
CREATE POLICY "Anyone can view anonymous visitors"
ON public.anonymous_visitors
FOR SELECT
USING (true);

-- Create page_interactions table for detailed consent-based tracking
CREATE TABLE public.page_interactions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  visitor_id text NOT NULL,
  session_id uuid REFERENCES public.visitor_sessions(id) ON DELETE CASCADE,
  page_path text NOT NULL,
  interaction_type text NOT NULL,
  element_selector text,
  element_text text,
  x_position integer,
  y_position integer,
  scroll_depth integer,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Create indexes for page_interactions
CREATE INDEX idx_page_interactions_visitor ON public.page_interactions(visitor_id);
CREATE INDEX idx_page_interactions_session ON public.page_interactions(session_id);
CREATE INDEX idx_page_interactions_created ON public.page_interactions(created_at DESC);

-- Enable RLS
ALTER TABLE public.page_interactions ENABLE ROW LEVEL SECURITY;

-- Allow public insert for tracking
CREATE POLICY "Anyone can insert page interactions"
ON public.page_interactions
FOR INSERT
WITH CHECK (true);

-- Allow public select for dashboard
CREATE POLICY "Anyone can view page interactions"
ON public.page_interactions
FOR SELECT
USING (true);

-- Add new columns to page_views table
ALTER TABLE public.page_views 
ADD COLUMN IF NOT EXISTS scroll_depth integer,
ADD COLUMN IF NOT EXISTS engagement_time integer;

-- Enable realtime for anonymous_visitors
ALTER PUBLICATION supabase_realtime ADD TABLE public.anonymous_visitors;