import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, cookie',
  'Access-Control-Allow-Credentials': 'true',
};

const checkAuth = (req: Request): boolean => {
  const cookieHeader = req.headers.get('cookie');
  if (!cookieHeader) return false;
  
  const cookies = cookieHeader.split(';').map(c => c.trim());
  const sessionCookie = cookies.find(c => c.startsWith('admin_session='));
  
  return !!sessionCookie;
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    if (!checkAuth(req)) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const { fileName, contentType } = await req.json();

    if (!fileName) {
      return new Response(
        JSON.stringify({ error: 'File name required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log('Generating upload path for:', fileName);

    // Generate a unique file path
    const timestamp = Date.now();
    const randomString = Math.random().toString(36).substring(7);
    const extension = fileName.split('.').pop();
    const path = `${timestamp}-${randomString}.${extension}`;

    console.log('Upload path generated:', path);

    return new Response(
      JSON.stringify({ 
        path,
        contentType: contentType || 'application/octet-stream'
      }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Upload URL generation error:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
