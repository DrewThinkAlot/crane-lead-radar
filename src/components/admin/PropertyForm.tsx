import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const propertySchema = z.object({
  property_name: z.string().min(1, "Property name is required"),
  address: z.string().min(1, "Address is required"),
  city: z.string().default("Orlando"),
  zip_code: z.string().min(5, "Valid ZIP code required"),
  property_type: z.string().min(1, "Property type is required"),
  year_built: z.number().min(1900).max(new Date().getFullYear()),
  square_footage: z.number().min(1),
  last_roof_permit_date: z.string(),
  property_owner_name: z.string().min(1, "Owner name is required"),
  property_management_company: z.string().optional(),
  owner_phone: z.string().min(10, "Valid phone number required"),
  owner_email: z.string().email().optional().or(z.literal("")),
  notes: z.string().optional(),
  is_sample_record: z.boolean().default(false),
});

type PropertyFormData = z.infer<typeof propertySchema>;

const PropertyForm = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    watch,
  } = useForm<PropertyFormData>({
    resolver: zodResolver(propertySchema),
    defaultValues: {
      city: "Orlando",
      is_sample_record: false,
    },
  });

  const isSampleRecord = watch("is_sample_record");

  const onSubmit = async (data: PropertyFormData) => {
    setIsSubmitting(true);

    try {
      const currentYear = new Date().getFullYear();
      const buildingAge = currentYear - data.year_built;
      const permitDate = new Date(data.last_roof_permit_date);
      const warrantyExpiration = new Date(permitDate);
      warrantyExpiration.setFullYear(permitDate.getFullYear() + 20);

      const { error } = await supabase.from("commercial_buildings").insert({
        property_name: data.property_name,
        address: data.address,
        city: data.city,
        zip_code: data.zip_code,
        property_type: data.property_type,
        year_built: data.year_built,
        building_age: buildingAge,
        square_footage: data.square_footage,
        last_roof_permit_date: data.last_roof_permit_date,
        estimated_warranty_expiration: warrantyExpiration.toISOString().split('T')[0],
        property_owner_name: data.property_owner_name,
        property_management_company: data.property_management_company || null,
        owner_phone: data.owner_phone,
        owner_email: data.owner_email || null,
        notes: data.notes || null,
        is_sample_record: data.is_sample_record,
      });

      if (error) throw error;

      toast.success("Property added successfully");
      reset();
    } catch (error: any) {
      console.error("Error adding property:", error);
      toast.error(error.message || "Failed to add property");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <Label htmlFor="property_name">Property Name *</Label>
          <Input
            id="property_name"
            {...register("property_name")}
            className="mt-1"
          />
          {errors.property_name && (
            <p className="text-destructive text-sm mt-1">{errors.property_name.message}</p>
          )}
        </div>

        <div>
          <Label htmlFor="property_type">Property Type *</Label>
          <Input
            id="property_type"
            {...register("property_type")}
            placeholder="e.g., Office Building, Warehouse"
            className="mt-1"
          />
          {errors.property_type && (
            <p className="text-destructive text-sm mt-1">{errors.property_type.message}</p>
          )}
        </div>

        <div className="md:col-span-2">
          <Label htmlFor="address">Address *</Label>
          <Input
            id="address"
            {...register("address")}
            className="mt-1"
          />
          {errors.address && (
            <p className="text-destructive text-sm mt-1">{errors.address.message}</p>
          )}
        </div>

        <div>
          <Label htmlFor="city">City *</Label>
          <Input
            id="city"
            {...register("city")}
            className="mt-1"
          />
          {errors.city && (
            <p className="text-destructive text-sm mt-1">{errors.city.message}</p>
          )}
        </div>

        <div>
          <Label htmlFor="zip_code">ZIP Code *</Label>
          <Input
            id="zip_code"
            {...register("zip_code")}
            className="mt-1"
          />
          {errors.zip_code && (
            <p className="text-destructive text-sm mt-1">{errors.zip_code.message}</p>
          )}
        </div>

        <div>
          <Label htmlFor="year_built">Year Built *</Label>
          <Input
            id="year_built"
            type="number"
            {...register("year_built", { valueAsNumber: true })}
            className="mt-1"
          />
          {errors.year_built && (
            <p className="text-destructive text-sm mt-1">{errors.year_built.message}</p>
          )}
        </div>

        <div>
          <Label htmlFor="square_footage">Square Footage *</Label>
          <Input
            id="square_footage"
            type="number"
            {...register("square_footage", { valueAsNumber: true })}
            className="mt-1"
          />
          {errors.square_footage && (
            <p className="text-destructive text-sm mt-1">{errors.square_footage.message}</p>
          )}
        </div>

        <div>
          <Label htmlFor="last_roof_permit_date">Last Roof Permit Date *</Label>
          <Input
            id="last_roof_permit_date"
            type="date"
            {...register("last_roof_permit_date")}
            className="mt-1"
          />
          {errors.last_roof_permit_date && (
            <p className="text-destructive text-sm mt-1">{errors.last_roof_permit_date.message}</p>
          )}
        </div>

        <div>
          <Label htmlFor="property_owner_name">Property Owner Name *</Label>
          <Input
            id="property_owner_name"
            {...register("property_owner_name")}
            className="mt-1"
          />
          {errors.property_owner_name && (
            <p className="text-destructive text-sm mt-1">{errors.property_owner_name.message}</p>
          )}
        </div>

        <div>
          <Label htmlFor="property_management_company">Property Management Company</Label>
          <Input
            id="property_management_company"
            {...register("property_management_company")}
            className="mt-1"
          />
        </div>

        <div>
          <Label htmlFor="owner_phone">Owner Phone *</Label>
          <Input
            id="owner_phone"
            {...register("owner_phone")}
            placeholder="(407) 555-1234"
            className="mt-1"
          />
          {errors.owner_phone && (
            <p className="text-destructive text-sm mt-1">{errors.owner_phone.message}</p>
          )}
        </div>

        <div>
          <Label htmlFor="owner_email">Owner Email</Label>
          <Input
            id="owner_email"
            type="email"
            {...register("owner_email")}
            className="mt-1"
          />
          {errors.owner_email && (
            <p className="text-destructive text-sm mt-1">{errors.owner_email.message}</p>
          )}
        </div>

        <div className="md:col-span-2">
          <Label htmlFor="notes">Notes</Label>
          <Textarea
            id="notes"
            {...register("notes")}
            className="mt-1"
            rows={3}
          />
        </div>

        <div className="md:col-span-2 flex items-center space-x-2">
          <Checkbox
            id="is_sample_record"
            checked={isSampleRecord}
            onCheckedChange={(checked) => setValue("is_sample_record", checked as boolean)}
          />
          <Label htmlFor="is_sample_record" className="cursor-pointer">
            Mark as sample record (publicly visible)
          </Label>
        </div>
      </div>

      <Button type="submit" disabled={isSubmitting} className="w-full">
        {isSubmitting ? "Adding Property..." : "Add Property"}
      </Button>
    </form>
  );
};

export default PropertyForm;
