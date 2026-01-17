import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { amount, customerName, phoneNumber, orderItems, additionalNotes } = await req.json();

    console.log("Checkout request:", { amount, customerName, phoneNumber, itemCount: orderItems?.length });

    // Get Ziina API token
    const ziinaToken = Deno.env.get("ZIINA_API_TOKEN") || Deno.env.get("ZIINA_API_KEY");
    if (!ziinaToken) {
      console.error("No Ziina token configured");
      return new Response(
        JSON.stringify({
          error: { provider: "ziina", message: "Payment gateway not configured" },
        }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 200,
        }
      );
    }

    // Get origin for redirect URLs
    const origin = req.headers.get("origin") || "https://cafe-delight-website-builder.lovable.app";
    
    // Build payment request - amount in fils (base units)
    const amountInFils = Math.round(Number(amount) * 100);
    
    const paymentBody = {
      amount: amountInFils,
      currency_code: "AED",
      message: `Nawa Cafe - Order for ${customerName}`,
      success_url: `${origin}/payment-success`,
      cancel_url: `${origin}/checkout`,
      failure_url: `${origin}/checkout?error=payment_failed`,
    };

    console.log("Creating Ziina payment intent:", JSON.stringify(paymentBody));

    // Create Ziina payment intent
    const ziinaResponse = await fetch("https://api-v2.ziina.com/api/payment_intent", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${ziinaToken}`,
      },
      body: JSON.stringify(paymentBody),
    });

    const responseText = await ziinaResponse.text();
    console.log("Ziina response status:", ziinaResponse.status);
    console.log("Ziina response body:", responseText);

    let ziinaData: any;
    try {
      ziinaData = JSON.parse(responseText);
    } catch {
      console.error("Failed to parse Ziina response");
      return new Response(
        JSON.stringify({
          error: { provider: "ziina", message: "Invalid response from payment gateway" },
        }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 200,
        }
      );
    }

    // Check for errors in response
    if (!ziinaResponse.ok || ziinaData.error || ziinaData.message === "Unauthorized") {
      const errorMessage = ziinaData.message || ziinaData.error?.message || "Payment request failed";
      const errorCode = ziinaData.code || ziinaData.error?.code || ziinaData.statusCode;
      
      console.error("Ziina API error:", { status: ziinaResponse.status, code: errorCode, message: errorMessage });
      
      return new Response(
        JSON.stringify({
          error: {
            provider: "ziina",
            status: ziinaResponse.status,
            code: errorCode,
            message: errorMessage,
          },
        }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 200,
        }
      );
    }

    // Success - we have a redirect URL
    if (!ziinaData.redirect_url) {
      console.error("No redirect URL in Ziina response:", ziinaData);
      return new Response(
        JSON.stringify({
          error: { provider: "ziina", message: "No payment URL received" },
        }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 200,
        }
      );
    }

    console.log("Payment intent created successfully:", ziinaData.id);

    // Send order to n8n webhook (non-blocking)
    const webhookUrl = new URL('https://hoi-there.app.n8n.cloud/webhook/ca4ea201-6cb4-4476-b7b5-d5c12894f9b1');
    webhookUrl.searchParams.append('customerName', customerName || '');
    webhookUrl.searchParams.append('phoneNumber', phoneNumber || '');
    webhookUrl.searchParams.append('time', new Date().toLocaleString('en-AE', { timeZone: 'Asia/Dubai' }));
    webhookUrl.searchParams.append('totalAmount', String(amount));
    webhookUrl.searchParams.append('currency', 'AED');
    webhookUrl.searchParams.append('items', JSON.stringify(orderItems || []));
    webhookUrl.searchParams.append('notes', additionalNotes || '');
    webhookUrl.searchParams.append('paymentIntentId', ziinaData.id);

    // Fire and forget webhook
    fetch(webhookUrl.toString(), { method: 'GET' }).catch(e => console.warn('Webhook failed:', e));

    return new Response(
      JSON.stringify({
        url: ziinaData.redirect_url,
        paymentIntentId: ziinaData.id,
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      }
    );
  } catch (error) {
    console.error("Server error:", error);
    const message = error instanceof Error ? error.message : String(error);

    return new Response(
      JSON.stringify({
        error: { provider: "server", message },
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      }
    );
  }
});
