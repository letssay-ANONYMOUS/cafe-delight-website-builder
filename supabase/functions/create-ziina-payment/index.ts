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

    const paymentIntentResponse = await fetch("https://api-v2.ziina.com/api/payment_intent", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${ziinaToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        amount: amountInFils,
        currency_code: "AED",
        success_url: `${origin}/payment-success?payment_intent_id={PAYMENT_INTENT_ID}`,
        cancel_url: `${origin}/`,
        test: true, // Set to true for testing, false for production
      }),
    });

    if (!paymentIntentResponse.ok) {
      const errorData = await paymentIntentResponse.text();
      console.error("Ziina API Error:", errorData);
      throw new Error(`Failed to create payment intent: ${errorData}`);
    }

    const paymentIntent = await paymentIntentResponse.json();

    // Send order details to n8n webhook
    const webhookData = {
      customerName,
      phoneNumber,
      orderTimestamp: new Date().toISOString(),
      timeFormatted: new Date().toLocaleString('en-AE', { timeZone: 'Asia/Dubai' }),
      orderItems: orderItems.map((item: any) => ({
        name: item.name,
        quantity: item.quantity,
        price: item.price,
        total: item.total
      })),
      totalAmount: amount,
      currency: "AED",
      paymentIntentId: paymentIntent.id,
      additionalNotes,
      paymentStatus: "Initiated"
    };

    // Send to n8n webhook (GET request with query params)
    const webhookUrl = new URL('https://hoi-there.app.n8n.cloud/webhook/ca4ea201-6cb4-4476-b7b5-d5c12894f9b1');
    webhookUrl.searchParams.append('customerName', webhookData.customerName);
    webhookUrl.searchParams.append('phoneNumber', webhookData.phoneNumber);
    webhookUrl.searchParams.append('time', webhookData.timeFormatted);
    webhookUrl.searchParams.append('totalAmount', webhookData.totalAmount.toString());
    webhookUrl.searchParams.append('currency', webhookData.currency);
    webhookUrl.searchParams.append('items', JSON.stringify(webhookData.orderItems));
    webhookUrl.searchParams.append('notes', webhookData.additionalNotes);
    webhookUrl.searchParams.append('paymentIntentId', webhookData.paymentIntentId);

    try {
      await fetch(webhookUrl.toString(), { method: 'GET' });
      console.log('Webhook notification sent');
    } catch (webhookError) {
      console.error('Webhook error:', webhookError);
      // Don't fail the payment if webhook fails
    }

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
