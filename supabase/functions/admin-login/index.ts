import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import * as bcrypt from "https://deno.land/x/bcrypt@v0.4.1/mod.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Credentials': 'true',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { password } = await req.json();
    const passwordHash = Deno.env.get('ADMIN_PASSWORD_HASH');
    const sessionSecret = Deno.env.get('SESSION_SECRET');

    if (!passwordHash || !sessionSecret) {
      console.error('Missing environment variables');
      return new Response(
        JSON.stringify({ success: false, error: 'Server configuration error' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log('Login attempt received');

    // Compare password with hash
    const isValid = await bcrypt.compare(password, passwordHash);

    if (!isValid) {
      console.log('Invalid password attempt');
      return new Response(
        JSON.stringify({ success: false, error: 'Invalid password' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log('Password validated successfully');

    // Create a simple session token
    const encoder = new TextEncoder();
    const data = encoder.encode(`admin:${Date.now()}`);
    const key = await crypto.subtle.importKey(
      'raw',
      encoder.encode(sessionSecret),
      { name: 'HMAC', hash: 'SHA-256' },
      false,
      ['sign']
    );
    const signature = await crypto.subtle.sign('HMAC', key, data);
    const token = btoa(String.fromCharCode(...new Uint8Array(signature)));

    // Set cookie with token
    const cookie = `admin_session=${token}; HttpOnly; Secure; SameSite=Strict; Path=/; Max-Age=28800`;

    console.log('Session created successfully');

    return new Response(
      JSON.stringify({ success: true }),
      {
        status: 200,
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json',
          'Set-Cookie': cookie,
        },
      }
    );
  } catch (error) {
    console.error('Login error:', error);
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
