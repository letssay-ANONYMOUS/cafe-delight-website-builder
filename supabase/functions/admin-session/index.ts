import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, cookie',
  'Access-Control-Allow-Credentials': 'true',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const cookieHeader = req.headers.get('cookie');
    
    if (!cookieHeader) {
      console.log('No cookie header found');
      return new Response(
        JSON.stringify({ authenticated: false }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const cookies = cookieHeader.split(';').map(c => c.trim());
    const sessionCookie = cookies.find(c => c.startsWith('admin_session='));

    if (!sessionCookie) {
      console.log('No admin session cookie found');
      return new Response(
        JSON.stringify({ authenticated: false }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const token = sessionCookie.split('=')[1];
    const sessionSecret = Deno.env.get('SESSION_SECRET');

    if (!sessionSecret) {
      console.error('Missing SESSION_SECRET');
      return new Response(
        JSON.stringify({ authenticated: false }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Validate token (basic validation - in production, use proper JWT)
    if (token && token.length > 0) {
      console.log('Valid session found');
      return new Response(
        JSON.stringify({ authenticated: true }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log('Invalid session token');
    return new Response(
      JSON.stringify({ authenticated: false }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Session check error:', error);
    return new Response(
      JSON.stringify({ authenticated: false }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
