import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { amount, customerName, phoneNumber, orderItems, additionalNotes } = await req.json();

    // Get Ziina API token from secrets
    const ziinaToken = Deno.env.get("ZIINA_API_TOKEN");
    if (!ziinaToken) {
      throw new Error("ZIINA_API_TOKEN not configured");
    }

    const origin = req.headers.get("origin") || "http://localhost:8080";

    // Create Payment Intent with Ziina
    // Amount should be in fils (1 AED = 100 fils)
    const amountInFils = Math.round(amount * 100);

    const paymentIntentResponse = await fetch("https://api.ziina.com/v1/payment_intent", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${ziinaToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        amount: amountInFils,
        currency: "AED",
        success_url: `${origin}/payment-success?payment_intent_id={PAYMENT_INTENT_ID}`,
        cancel_url: `${origin}/checkout`,
        test: true, // Set to false for production
        metadata: {
          customerName,
          phoneNumber,
          orderItems: JSON.stringify(orderItems),
          additionalNotes,
        },
      }),
    });

    if (!paymentIntentResponse.ok) {
      const errorData = await paymentIntentResponse.text();
      console.error("Ziina API Error:", errorData);
      throw new Error(`Failed to create payment intent: ${errorData}`);
    }

    const paymentIntent = await paymentIntentResponse.json();

    return new Response(
      JSON.stringify({
        redirectUrl: paymentIntent.redirect_url,
        paymentIntentId: paymentIntent.id,
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      }
    );
  } catch (error) {
    console.error("Error:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500,
      }
    );
  }
});
