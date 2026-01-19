-- Enable realtime for orders table so kitchen dashboard gets instant updates
ALTER PUBLICATION supabase_realtime ADD TABLE public.orders;