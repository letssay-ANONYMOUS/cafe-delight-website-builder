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

    // Ziina uses a bearer token. Some accounts label it as API token/key.
    const ziinaToken = Deno.env.get("ZIINA_API_TOKEN") || Deno.env.get("ZIINA_API_KEY");
    if (!ziinaToken) {
      return new Response(
        JSON.stringify({
          error: { provider: "ziina", message: "Ziina token not configured" },
        }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 200,
        }
      );
    }

    const origin = req.headers.get("origin") || "http://localhost:8080";

    // Create Ziina payment intent
    const ziinaResponse = await fetch("https://api-v2.ziina.com/api/payment_intent", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${ziinaToken}`,
      },
      body: JSON.stringify({
        amount: Math.round(Number(amount) * 100), // Convert to fils
        currency_code: "AED",
        message: `Order for ${customerName}`,
        success_url: `${origin}/payment-success`,
        cancel_url: `${origin}/checkout`,
        test: false,
      }),
    });

    if (!ziinaResponse.ok) {
      const raw = await ziinaResponse.text();
      console.error("Ziina API error:", raw);

      let parsed: any = null;
      try {
        parsed = JSON.parse(raw);
      } catch (_) {
        // ignore
      }

      return new Response(
        JSON.stringify({
          error: {
            provider: "ziina",
            status: ziinaResponse.status,
            code: parsed?.code,
            message: parsed?.message ?? raw,
          },
        }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 200,
        }
      );
    }

    const ziinaData = await ziinaResponse.json();
    console.log("Ziina payment intent created:", ziinaData.id);

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
      paymentIntentId: ziinaData.id,
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
    webhookUrl.searchParams.append('notes', webhookData.additionalNotes || '');
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
        url: ziinaData.redirect_url,
        paymentIntentId: ziinaData.id,
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      }
    );
  } catch (error) {
    console.error("Error:", error);
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
