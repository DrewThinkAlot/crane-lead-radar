import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const SampleRecordsManager = () => {
  const [samples, setSamples] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSamples();
  }, []);

  const fetchSamples = async () => {
    const { data, error } = await supabase
      .from('commercial_buildings')
      .select('*')
      .eq('is_sample_record', true)
      .order('created_at', { ascending: false });

    if (error) {
      toast.error('Failed to fetch sample records');
      console.error(error);
    } else {
      setSamples(data || []);
    }
    setLoading(false);
  };

  if (loading) {
    return <p className="text-muted-foreground">Loading sample records...</p>;
  }

  if (samples.length === 0) {
    return (
      <p className="text-muted-foreground">
        No sample records yet. Add properties and mark them as sample records.
      </p>
    );
  }

  return (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground">
        {samples.length} sample record(s) currently visible on the landing page
      </p>
      
      <div className="space-y-3">
        {samples.map((sample) => (
          <div key={sample.id} className="glass-card p-4 rounded-lg border border-border">
            <h3 className="font-semibold text-lg mb-2">{sample.property_name}</h3>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <p><span className="text-muted-foreground">Address:</span> {sample.address}</p>
              <p><span className="text-muted-foreground">Age:</span> {sample.building_age} years</p>
              <p><span className="text-muted-foreground">Owner:</span> {sample.property_owner_name}</p>
              <p><span className="text-muted-foreground">Phone:</span> {sample.owner_phone}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SampleRecordsManager;
