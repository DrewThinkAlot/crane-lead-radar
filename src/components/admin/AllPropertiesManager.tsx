import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Trash2, Edit, Search } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface Property {
  id: string;
  property_name: string;
  address: string;
  city: string;
  building_age: number;
  estimated_warranty_expiration: string;
  property_owner_name: string;
  owner_phone: string;
  is_sample_record: boolean;
}

const AllPropertiesManager = () => {
  const [properties, setProperties] = useState<Property[]>([]);
  const [filteredProperties, setFilteredProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const fetchProperties = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('commercial_buildings')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching properties:', error);
      toast.error('Failed to load properties');
    } else if (data) {
      setProperties(data);
      setFilteredProperties(data);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchProperties();
  }, []);

  useEffect(() => {
    if (searchTerm) {
      const filtered = properties.filter(p =>
        p.property_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.property_owner_name.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredProperties(filtered);
    } else {
      setFilteredProperties(properties);
    }
  }, [searchTerm, properties]);

  const handleDelete = async (id: string) => {
    const { error } = await supabase
      .from('commercial_buildings')
      .delete()
      .eq('id', id);

    if (error) {
      toast.error('Failed to delete property');
    } else {
      toast.success('Property deleted successfully');
      fetchProperties();
    }
    setDeleteId(null);
  };

  const toggleSampleStatus = async (id: string, currentStatus: boolean) => {
    const { error } = await supabase
      .from('commercial_buildings')
      .update({ is_sample_record: !currentStatus })
      .eq('id', id);

    if (error) {
      toast.error('Failed to update sample status');
    } else {
      toast.success(`Property ${!currentStatus ? 'marked' : 'unmarked'} as sample`);
      fetchProperties();
    }
  };

  if (loading) {
    return <div className="text-center py-8">Loading properties...</div>;
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search by property name, address, or owner..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="text-sm text-muted-foreground">
          {filteredProperties.length} properties
        </div>
      </div>

      {filteredProperties.length === 0 ? (
        <div className="text-center py-8 text-muted-foreground">
          No properties found
        </div>
      ) : (
        <div className="space-y-2">
          {filteredProperties.map((property) => (
            <div
              key={property.id}
              className="glass-card p-4 flex items-center justify-between gap-4"
            >
              <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-2">
                <div>
                  <p className="font-semibold">{property.property_name}</p>
                  <p className="text-sm text-muted-foreground">{property.address}</p>
                </div>
                <div>
                  <p className="text-sm">Owner: {property.property_owner_name}</p>
                  <p className="text-sm text-muted-foreground">{property.owner_phone}</p>
                </div>
                <div>
                  <p className="text-sm">Age: {property.building_age} years</p>
                  <p className="text-sm text-muted-foreground">
                    Warranty Exp: {new Date(property.estimated_warranty_expiration).toLocaleDateString()}
                  </p>
                </div>
              </div>
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant={property.is_sample_record ? "secondary" : "outline"}
                  onClick={() => toggleSampleStatus(property.id, property.is_sample_record)}
                >
                  {property.is_sample_record ? "Sample" : "Mark Sample"}
                </Button>
                <Button
                  size="sm"
                  variant="destructive"
                  onClick={() => setDeleteId(property.id)}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the property record.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={() => deleteId && handleDelete(deleteId)}>
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default AllPropertiesManager;
