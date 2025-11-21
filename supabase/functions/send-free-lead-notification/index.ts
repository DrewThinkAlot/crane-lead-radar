import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "https://esm.sh/resend@4.0.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
const supabaseServiceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
const supabase = createClient(supabaseUrl, supabaseServiceRoleKey);

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface FreeLeadRequest {
  name: string;
  email: string;
  company: string;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { name, email, company }: FreeLeadRequest = await req.json();

    console.log("Processing free lead request:", { name, email, company });

    // Insert record into database
    const { data: leadRequest, error: dbError } = await supabase
      .from('free_lead_requests')
      .insert({
        name,
        email,
        company,
        status: 'pending'
      })
      .select()
      .single();

    if (dbError) {
      console.error("Database error:", dbError);
      throw new Error("Failed to save lead request");
    }

    console.log("Lead request saved to database:", leadRequest);

    // Send notification to the business owner
    const ownerEmail = await resend.emails.send({
      from: "Orlando Roof Database <onboarding@resend.dev>",
      to: ["aclyder@gmail.com"],
      subject: "🎯 New Free Sample Request",
      html: `
        <h2>New Free Sample Request Received</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Company:</strong> ${company}</p>
        <p><strong>Requested at:</strong> ${new Date().toLocaleString()}</p>
        <hr>
        <p style="color: #666; font-size: 12px;">Follow up to provide access to the 3 sample records!</p>
      `,
    });

    console.log("Owner notification sent successfully:", ownerEmail);

    // Send confirmation to the prospect
    const prospectEmail = await resend.emails.send({
      from: "Orlando Roof Database <onboarding@resend.dev>",
      to: [email],
      subject: "Your Free Sample Records Are Ready!",
      html: `
        <h1>Thanks for your interest, ${name}!</h1>
        <p>We're sending you access to 3 sample records from our Orlando Commercial Roofing Database.</p>
        <p>You'll receive them within the next 2 minutes at this email address.</p>
        <p>These samples will show you exactly what kind of exclusive data we've compiled:</p>
        <ul>
          <li>Property owner names and contact information</li>
          <li>Direct phone numbers and email addresses</li>
          <li>Building details and square footage</li>
          <li>Warranty expiration dates</li>
          <li>Last roof permit dates</li>
        </ul>
        <p><strong>Ready for all 50 properties?</strong> The complete database includes buildings with warranties expiring now - owners ready to buy.</p>
        <p>Only 5 copies available. <a href="${Deno.env.get("SUPABASE_URL") || 'https://your-domain.com'}">Secure your exclusive access</a></p>
        <hr>
        <p style="color: #666; font-size: 12px;">Orlando Commercial Roofing Database - Exclusive Market Intelligence</p>
      `,
    });

    console.log("Prospect confirmation sent successfully:", prospectEmail);

    // Update record with successful delivery timestamp
    const { error: updateError } = await supabase
      .from('free_lead_requests')
      .update({
        status: 'sent',
        lead_sent_at: new Date().toISOString()
      })
      .eq('id', leadRequest.id);

    if (updateError) {
      console.error("Failed to update lead request status:", updateError);
      // Don't throw error since emails were sent successfully
    }

    return new Response(
      JSON.stringify({ 
        success: true,
        message: "Free lead request received. Check your inbox!"
      }), 
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          ...corsHeaders,
        },
      }
    );
  } catch (error: any) {
    console.error("Error in send-free-lead-notification function:", error);
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
