import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@14.21.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { Resend } from "https://esm.sh/resend@4.0.0";

const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY")!, {
  apiVersion: "2023-10-16",
});

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));
const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
const supabaseServiceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
const supabase = createClient(supabaseUrl, supabaseServiceRoleKey);

const handler = async (req: Request): Promise<Response> => {
  try {
    const signature = req.headers.get("stripe-signature");
    if (!signature) {
      console.error("No stripe signature found");
      return new Response("No signature", { status: 400 });
    }

    const body = await req.text();
    const webhookSecret = Deno.env.get("STRIPE_WEBHOOK_SECRET");
    
    let event: Stripe.Event;
    
    try {
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret!);
    } catch (err: any) {
      console.error("Webhook signature verification failed:", err.message);
      return new Response(`Webhook Error: ${err.message}`, { status: 400 });
    }

    console.log("Processing Stripe event:", event.type);

    if (event.type === "checkout.session.completed") {
      const session = event.data.object as Stripe.Checkout.Session;
      
      console.log("Checkout session completed:", session.id);

      const metadata = session.metadata!;
      const buyerName = metadata.buyer_name;
      const buyerEmail = metadata.buyer_email;
      const buyerCompany = metadata.buyer_company;
      const buyerPhone = metadata.buyer_phone;
      const amountPaid = session.amount_total! / 100; // Convert from cents

      // Insert pending purchase record
      const { data: purchase, error: insertError } = await supabase
        .from('database_purchases')
        .insert({
          buyer_name: buyerName,
          buyer_email: buyerEmail,
          buyer_company: buyerCompany,
          buyer_phone: buyerPhone,
          amount_paid: amountPaid,
          payment_status: 'pending',
          stripe_checkout_session_id: session.id,
          stripe_payment_intent_id: session.payment_intent as string,
        })
        .select()
        .single();

      if (insertError) {
        console.error("Error inserting purchase record:", insertError);
        throw new Error("Failed to create purchase record");
      }

      console.log("Purchase record created:", purchase.id);

      // Generate CSV via edge function
      const generateResponse = await fetch(`${supabaseUrl}/functions/v1/generate-database-csv`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${supabaseServiceRoleKey}`,
        },
        body: JSON.stringify({ purchaseId: purchase.id }),
      });

      if (!generateResponse.ok) {
        const errorText = await generateResponse.text();
        console.error("Error generating CSV:", errorText);
        throw new Error("Failed to generate database CSV");
      }

      const { downloadUrl } = await generateResponse.json();
      console.log("CSV generated with download URL");

      // Send delivery email
      const emailResponse = await resend.emails.send({
        from: "Orlando Roof Database <onboarding@resend.dev>",
        to: [buyerEmail],
        subject: "🎯 Your Orlando Roofing Database is Ready",
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h1 style="color: #f97316;">Your Database is Ready! 🎯</h1>
            
            <p>Hi ${buyerName},</p>
            
            <p>Thank you for your purchase! Your Orlando Commercial Roofing Database is ready for download.</p>
            
            <div style="background-color: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <h2 style="margin-top: 0;">📥 Download Your Database</h2>
              <a href="${downloadUrl}" style="display: inline-block; background-color: #f97316; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold;">Download CSV File</a>
              <p style="margin-top: 10px; font-size: 12px; color: #666;">This link never expires - save it for future access</p>
            </div>
            
            <h3>What's Included:</h3>
            <ul>
              <li>✅ <strong>50 Commercial Properties</strong> in Orlando</li>
              <li>✅ <strong>Property Owner Names</strong> & Contact Information</li>
              <li>✅ <strong>Phone Numbers</strong> & Email Addresses</li>
              <li>✅ <strong>Warranty Expiration Dates</strong></li>
              <li>✅ <strong>Building Details</strong> (age, square footage, type)</li>
              <li>✅ <strong>Last Roof Permit Dates</strong></li>
            </ul>
            
            <h3>How to Use This Data:</h3>
            <ol>
              <li>Open the CSV file in Excel, Google Sheets, or your CRM</li>
              <li>Sort by warranty expiration date to prioritize hot leads</li>
              <li>Call property owners directly - you have their contact info</li>
              <li>Reference the specific building details in your pitch</li>
              <li>Close deals before your competitors even know about them</li>
            </ol>
            
            <div style="background-color: #fef3c7; padding: 15px; border-left: 4px solid #f59e0b; margin: 20px 0;">
              <p style="margin: 0;"><strong>⚡ Remember:</strong> Only 5 copies of this database exist. You have exclusive access to these leads in your market.</p>
            </div>
            
            <h3>Need Updated Data?</h3>
            <p>We release new data every 6 months. You'll receive an email when fresh Orlando properties are available for purchase.</p>
            
            <p>Questions? Reply to this email and we'll help you get the most out of your database.</p>
            
            <p>Good luck closing deals!<br>
            <strong>Orlando Roof Database Team</strong></p>
            
            <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 30px 0;">
            
            <p style="font-size: 12px; color: #6b7280; text-align: center;">
              Orlando Commercial Roofing Database<br>
              One-time purchase • Permanent access • Exclusive data
            </p>
          </div>
        `,
      });

      console.log("Delivery email sent successfully:", emailResponse);

      // Update purchase record to completed
      const { error: updateError } = await supabase
        .from('database_purchases')
        .update({
          payment_status: 'completed',
          csv_delivered_at: new Date().toISOString(),
          csv_download_url: downloadUrl,
        })
        .eq('id', purchase.id);

      if (updateError) {
        console.error("Error updating purchase record:", updateError);
        // Don't throw error since emails were sent successfully
      }

      console.log("Purchase completed successfully:", purchase.id);
    }

    return new Response(JSON.stringify({ received: true }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error: any) {
    console.error("Error processing webhook:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
};

serve(handler);
