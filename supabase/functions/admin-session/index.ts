import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const getCorsHeaders = (origin: string | null) => {
  const allowedOrigin = origin || '*';
  return {
    'Access-Control-Allow-Origin': allowedOrigin,
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, cookie',
    'Access-Control-Allow-Credentials': 'true',
  };
};

serve(async (req) => {
  const origin = req.headers.get('origin');
  const corsHeaders = getCorsHeaders(origin);

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

    // Validate token - check timestamp and signature
    if (token && token.includes(':')) {
      const [timestampStr, signatureBase64] = token.split(':');
      const timestamp = parseInt(timestampStr, 10);
      
      // Check if session is expired (8 hours = 28800 seconds)
      const now = Date.now();
      const maxAge = 28800 * 1000; // 8 hours in milliseconds
      
      if (now - timestamp > maxAge) {
        console.log('Session expired');
        return new Response(
          JSON.stringify({ authenticated: false }),
          { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      // Verify signature
      const encoder = new TextEncoder();
      const data = encoder.encode(`admin:${timestamp}`);
      const key = await crypto.subtle.importKey(
        'raw',
        encoder.encode(sessionSecret),
        { name: 'HMAC', hash: 'SHA-256' },
        false,
        ['verify']
      );
      
      const signatureBytes = Uint8Array.from(atob(signatureBase64), c => c.charCodeAt(0));
      const isValid = await crypto.subtle.verify('HMAC', key, signatureBytes, data);
      
      if (isValid) {
        console.log('Valid session found');
        return new Response(
          JSON.stringify({ authenticated: true }),
          { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
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
