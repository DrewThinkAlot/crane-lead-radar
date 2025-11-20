import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Upload } from "lucide-react";

const CSVUploader = () => {
  const [uploading, setUploading] = useState(false);
  const [file, setFile] = useState<File | null>(null);

  const parseCSV = (text: string): any[] => {
    const lines = text.split('\n');
    const headers = lines[0].split(',').map(h => h.trim());
    const records = [];

    for (let i = 1; i < lines.length; i++) {
      if (!lines[i].trim()) continue;
      
      const values = lines[i].split(',').map(v => v.trim());
      const record: any = {};
      
      headers.forEach((header, index) => {
        record[header] = values[index];
      });
      
      records.push(record);
    }

    return records;
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!file) {
      toast.error("Please select a CSV file");
      return;
    }

    setUploading(true);

    try {
      const text = await file.text();
      const records = parseCSV(text);

      // Transform CSV data to match database schema
      const transformedRecords = records.map(record => {
        const yearBuilt = parseInt(record.year_built || record.YearBuilt || record.Year_Built);
        const currentYear = new Date().getFullYear();
        const buildingAge = currentYear - yearBuilt;
        
        return {
          property_name: record.property_name || record.PropertyName || record.Property_Name,
          address: record.address || record.Address,
          city: record.city || record.City || 'Orlando',
          zip_code: record.zip_code || record.ZipCode || record.Zip_Code,
          building_age: buildingAge,
          year_built: yearBuilt,
          estimated_warranty_expiration: record.estimated_warranty_expiration || record.WarrantyExpiration,
          square_footage: parseInt(record.square_footage || record.SquareFootage || '0'),
          property_type: record.property_type || record.PropertyType || record.Property_Type,
          property_owner_name: record.property_owner_name || record.OwnerName || record.Owner_Name,
          property_management_company: record.property_management_company || record.ManagementCompany || null,
          owner_phone: record.owner_phone || record.OwnerPhone || record.Owner_Phone,
          owner_email: record.owner_email || record.OwnerEmail || null,
          last_roof_permit_date: record.last_roof_permit_date || record.PermitDate || record.Last_Roof_Permit_Date,
          notes: record.notes || record.Notes || null,
          is_sample_record: false
        };
      });

      // Insert in batches
      const { error } = await supabase
        .from('commercial_buildings')
        .insert(transformedRecords);

      if (error) throw error;

      toast.success(`Successfully uploaded ${transformedRecords.length} properties`);
      setFile(null);
      // Reset file input
      const fileInput = document.getElementById('csv-upload') as HTMLInputElement;
      if (fileInput) fileInput.value = '';
    } catch (error: any) {
      console.error('CSV upload error:', error);
      toast.error(error.message || 'Failed to upload CSV');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-4 p-6 glass-card">
      <div>
        <h3 className="text-lg font-semibold mb-2">Bulk CSV Upload</h3>
        <p className="text-sm text-muted-foreground mb-4">
          Upload a CSV file with property data. Required columns: property_name, address, year_built, 
          estimated_warranty_expiration, property_type, property_owner_name, owner_phone, last_roof_permit_date
        </p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="csv-upload">Select CSV File</Label>
        <Input
          id="csv-upload"
          type="file"
          accept=".csv"
          onChange={handleFileChange}
          disabled={uploading}
        />
      </div>

      <Button
        onClick={handleUpload}
        disabled={!file || uploading}
        className="w-full"
      >
        <Upload className="w-4 h-4 mr-2" />
        {uploading ? 'Uploading...' : 'Upload CSV'}
      </Button>
    </div>
  );
};

export default CSVUploader;
