import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@14.21.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY")!, {
  apiVersion: "2023-10-16",
});

const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
const supabaseServiceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
const supabase = createClient(supabaseUrl, supabaseServiceRoleKey);

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface CheckoutRequest {
  name: string;
  email: string;
  company: string;
  phone: string;
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { name, email, company, phone }: CheckoutRequest = await req.json();

    console.log("Creating checkout session for:", { name, email, company });

    // Check if 5 copies limit has been reached
    const { count, error: countError } = await supabase
      .from('database_purchases')
      .select('*', { count: 'exact', head: true })
      .eq('payment_status', 'completed');

    if (countError) {
      console.error("Error checking purchase count:", countError);
      throw new Error("Failed to verify availability");
    }

    if ((count || 0) >= 5) {
      return new Response(
        JSON.stringify({ error: "All copies have been sold" }),
        {
          status: 400,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        }
      );
    }

    console.log(`Current sales: ${count}/5 - Creating checkout session`);

    // Get the origin for success/cancel URLs
    const origin = req.headers.get("origin") || "https://your-domain.com";

    // Create Stripe checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: "Orlando Commercial Roofing Database",
              description: "50 commercial buildings with expiring warranties, owner contact info, and building details",
            },
            unit_amount: 49900, // $499.00 in cents
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `${origin}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/`,
      customer_email: email,
      metadata: {
        buyer_name: name,
        buyer_email: email,
        buyer_company: company,
        buyer_phone: phone,
      },
    });

    console.log("Checkout session created:", session.id);

    return new Response(
      JSON.stringify({ sessionId: session.id }),
      {
        status: 200,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  } catch (error: any) {
    console.error("Error creating checkout session:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);
