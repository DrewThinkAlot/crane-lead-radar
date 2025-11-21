import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
const supabaseServiceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
const supabase = createClient(supabaseUrl, supabaseServiceRoleKey);

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface GenerateRequest {
  purchaseId: string;
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { purchaseId }: GenerateRequest = await req.json();

    console.log("Generating CSV for purchase:", purchaseId);

    // Query all non-sample records
    const { data: properties, error: queryError } = await supabase
      .from('commercial_buildings')
      .select('*')
      .eq('is_sample_record', false)
      .order('created_at', { ascending: false });

    if (queryError) {
      console.error("Error querying properties:", queryError);
      throw new Error("Failed to fetch property data");
    }

    console.log(`Retrieved ${properties?.length || 0} properties`);

    // CSV Headers
    const headers = [
      "Property Name",
      "Address",
      "City",
      "Zip Code",
      "Building Age",
      "Year Built",
      "Est. Warranty Expiration",
      "Square Footage",
      "Property Type",
      "Owner Name",
      "Management Company",
      "Owner Phone",
      "Owner Email",
      "Last Roof Permit Date",
      "Notes"
    ];

    // Build CSV content
    let csvContent = headers.join(",") + "\n";

    properties?.forEach((property) => {
      const row = [
        property.property_name,
        property.address,
        property.city,
        property.zip_code,
        property.building_age,
        property.year_built,
        property.estimated_warranty_expiration,
        property.square_footage,
        property.property_type,
        property.property_owner_name,
        property.property_management_company || "",
        property.owner_phone,
        property.owner_email || "",
        property.last_roof_permit_date,
        property.notes || ""
      ].map(field => {
        // Escape fields that contain commas or quotes
        const str = String(field);
        if (str.includes(",") || str.includes('"') || str.includes("\n")) {
          return `"${str.replace(/"/g, '""')}"`;
        }
        return str;
      });

      csvContent += row.join(",") + "\n";
    });

    console.log("CSV content generated, uploading to storage...");

    // Upload to storage
    const fileName = `orlando-roofing-database-${purchaseId}.csv`;
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('database-exports')
      .upload(fileName, csvContent, {
        contentType: 'text/csv',
        upsert: false
      });

    if (uploadError) {
      console.error("Error uploading CSV:", uploadError);
      throw new Error("Failed to upload CSV file");
    }

    console.log("CSV uploaded successfully:", uploadData.path);

    // Generate permanent signed URL (10 years)
    const { data: signedUrlData, error: signedUrlError } = await supabase.storage
      .from('database-exports')
      .createSignedUrl(fileName, 315360000); // 10 years in seconds

    if (signedUrlError) {
      console.error("Error generating signed URL:", signedUrlError);
      throw new Error("Failed to generate download URL");
    }

    console.log("Permanent download URL generated");

    return new Response(
      JSON.stringify({ 
        downloadUrl: signedUrlData.signedUrl,
        fileName: fileName
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  } catch (error: any) {
    console.error("Error generating database CSV:", error);
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
