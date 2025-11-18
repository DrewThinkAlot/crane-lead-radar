import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "https://esm.sh/resend@4.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

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

    // Send notification to the business owner
    const ownerEmail = await resend.emails.send({
      from: "Dallas Roof Radar <onboarding@resend.dev>",
      to: ["aclyder@gmail.com"],
      subject: "🎯 New Free Lead Request",
      html: `
        <h2>New Free Lead Request Received</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Company:</strong> ${company}</p>
        <p><strong>Requested at:</strong> ${new Date().toLocaleString()}</p>
        <hr>
        <p style="color: #666; font-size: 12px;">Follow up immediately to send them their free lead!</p>
      `,
    });

    console.log("Owner notification sent successfully:", ownerEmail);

    // Send confirmation to the prospect
    const prospectEmail = await resend.emails.send({
      from: "Dallas Roof Radar <onboarding@resend.dev>",
      to: [email],
      subject: "Your Free Lead is On The Way!",
      html: `
        <h1>Thanks for your interest, ${name}!</h1>
        <p>We're preparing your free high-value commercial roofing lead right now.</p>
        <p>You'll receive it within the next 2 minutes at this email address.</p>
        <p>This lead will show you exactly what kind of exclusive data we track:</p>
        <ul>
          <li>Direct property owner contact information</li>
          <li>Crane and Right-of-Way permit details</li>
          <li>Estimated project value</li>
          <li>Filed date and status</li>
        </ul>
        <p><strong>Want more leads like this?</strong> <a href="https://dallasroofradar.com">Check availability in Dallas</a></p>
        <hr>
        <p style="color: #666; font-size: 12px;">Dallas Roof Radar - Exclusive Commercial Roofing Leads</p>
      `,
    });

    console.log("Prospect confirmation sent successfully:", prospectEmail);

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
