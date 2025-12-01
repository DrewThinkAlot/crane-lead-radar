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

    // Fetch all sample records
    const { data: sampleLeads, error: sampleError } = await supabase
      .from('public_sample_buildings')
      .select('*')
      .limit(3);

    if (sampleError || !sampleLeads || sampleLeads.length === 0) {
      console.error("Failed to fetch sample leads:", sampleError);
      throw new Error("Failed to retrieve sample leads");
    }

    console.log(`Fetched ${sampleLeads.length} sample leads`);

    // Send notification to the business owner
    const ownerEmail = await resend.emails.send({
      from: "Seattle Roof Database <notifications@roofcipher.com>",
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

    // Generate HTML for all sample leads
    const sampleLeadsHtml = sampleLeads.map((lead, index) => `
      <div style="background: #f5f5f5; border-left: 4px solid #f97316; padding: 20px; margin: 20px 0; font-family: monospace;">
        <h3 style="margin-top: 0; color: #f97316;">🏢 Sample ${index + 1}: ${lead.property_name}</h3>
        <p><strong>📍 Address:</strong> ${lead.address}, ${lead.city || 'Seattle'}, WA ${lead.zip_code || ''}</p>
        <p><strong>📏 Square Footage:</strong> ${lead.square_footage?.toLocaleString() || 'N/A'} sq ft</p>
        <p><strong>🏗️ Property Type:</strong> ${lead.property_type || 'Commercial'}</p>
        <p><strong>📅 Building Age:</strong> ${lead.building_age || 'N/A'} years (Built ${lead.year_built || 'N/A'})</p>
        <p><strong>⚠️ Warranty Status:</strong> ${lead.estimated_warranty_expiration ? new Date(lead.estimated_warranty_expiration).toLocaleDateString() : 'Expired'}</p>
        ${lead.property_management_company ? `<p><strong>🏢 Management:</strong> ${lead.property_management_company}</p>` : ''}
        <p style="color: #22c55e; font-weight: bold;">💰 ${lead.contact_note || 'Ready for roof replacement'}</p>
      </div>
    `).join('');

    // Send confirmation to the prospect with all sample leads
    const prospectEmail = await resend.emails.send({
      from: "Seattle Roof Database <notifications@roofcipher.com>",
      to: [email],
      subject: "🎯 Your 3 Free Sample Leads from Seattle Database",
      html: `
        <h1>Here Are Your 3 Free Sample Leads, ${name}!</h1>
        <p>Below are three real commercial properties from our exclusive Seattle database. This is exactly what you'll get with all 50 properties:</p>
        
        ${sampleLeadsHtml}

        <h3>What You Get With The Full Database:</h3>
        <ul>
          <li>✅ <strong>50 Commercial Properties</strong> in Seattle with expiring warranties</li>
          <li>✅ <strong>Property Owner Names</strong> and direct contact information</li>
          <li>✅ <strong>Phone Numbers & Email Addresses</strong> - reach decision makers directly</li>
          <li>✅ <strong>Building Details</strong> - square footage, age, property type</li>
          <li>✅ <strong>Warranty Expiration Dates</strong> - know exactly when they'll need a new roof</li>
          <li>✅ <strong>Permit History</strong> - understand the property's maintenance cycle</li>
        </ul>

        <div style="background: #fef3c7; border: 2px solid #f59e0b; padding: 15px; margin: 20px 0; border-radius: 8px;">
          <p style="margin: 0; font-size: 16px;"><strong>⚡ Only 5 Copies Available</strong> - Secure Your Exclusive Access for $499</p>
        </div>

        <p style="text-align: center; margin: 30px 0;">
          <a href="${Deno.env.get("SUPABASE_URL") || 'https://your-domain.com'}" style="background: #f97316; color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block;">Get All 50 Properties Now</a>
        </p>

        <hr>
        <p style="color: #666; font-size: 12px;">Seattle Commercial Roofing Database - Your Competitive Advantage</p>
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
