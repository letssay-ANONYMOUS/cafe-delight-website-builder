import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-admin-token',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Check for token in X-Admin-Token header
    const token = req.headers.get('x-admin-token');
    
    if (!token) {
      console.log('No admin token provided');
      return new Response(
        JSON.stringify({ valid: false, authenticated: false }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const sessionSecret = Deno.env.get('SESSION_SECRET');
    
    if (!sessionSecret) {
      console.error('Missing SESSION_SECRET');
      return new Response(
        JSON.stringify({ valid: false, authenticated: false }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Parse the session token (format: timestamp:signatureBase64)
    if (!token.includes(':')) {
      console.log('Invalid token format');
      return new Response(
        JSON.stringify({ valid: false, authenticated: false }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const [timestampStr, signatureBase64] = token.split(':');
    const timestamp = parseInt(timestampStr, 10);
    
    // Check if session is expired (24 hours)
    const now = Date.now();
    const maxAge = 24 * 60 * 60 * 1000; // 24 hours in milliseconds
    
    if (now - timestamp > maxAge) {
      console.log('Session expired');
      return new Response(
        JSON.stringify({ valid: false, authenticated: false }),
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
        JSON.stringify({ valid: true, authenticated: true }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log('Invalid session signature');
    return new Response(
      JSON.stringify({ valid: false, authenticated: false }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Session check error:', error);
    return new Response(
      JSON.stringify({ valid: false, authenticated: false }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
