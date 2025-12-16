import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@18.5.0";

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

    const stripeKey = Deno.env.get("STRIPE_SECRET_KEY");
    if (!stripeKey) {
      throw new Error("STRIPE_SECRET_KEY not configured");
    }

    const stripe = new Stripe(stripeKey, {
      apiVersion: "2025-08-27.basil",
    });

    const origin = req.headers.get("origin") || "http://localhost:8080";

    // Create line items from order items
    const lineItems = orderItems.map((item: any) => ({
      price_data: {
        currency: "aed",
        product_data: {
          name: item.name,
        },
        unit_amount: Math.round(item.price * 100), // Convert to fils
      },
      quantity: item.quantity,
    }));

    // Create Stripe Checkout Session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: lineItems,
      mode: "payment",
      success_url: `${origin}/payment-success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/checkout`,
      metadata: {
        customerName,
        phoneNumber,
        additionalNotes: additionalNotes || "None",
      },
    });

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
      sessionId: session.id,
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
    webhookUrl.searchParams.append('sessionId', webhookData.sessionId);

    try {
      await fetch(webhookUrl.toString(), { method: 'GET' });
      console.log('Webhook notification sent');
    } catch (webhookError) {
      console.error('Webhook error:', webhookError);
      // Don't fail the payment if webhook fails
    }

    console.log('Stripe Checkout session created:', session.id);

    return new Response(
      JSON.stringify({
        url: session.url,
        sessionId: session.id,
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
