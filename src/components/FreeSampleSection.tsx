import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Building2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface SampleRecord {
  id: string;
  property_name: string;
  address: string;
  building_age: number;
  estimated_warranty_expiration: string;
  property_owner_name: string;
  owner_phone: string;
}

const FreeSampleSection = () => {
  const [samples, setSamples] = useState<SampleRecord[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSamples = async () => {
      const { data, error } = await supabase
        .from('commercial_buildings')
        .select('*')
        .eq('is_sample_record', true)
        .limit(3);

      if (error) {
        console.error('Error fetching samples:', error);
        toast.error('Failed to load sample records');
      } else if (data) {
        setSamples(data);
      }
      setLoading(false);
    };

    fetchSamples();

    // Track sample view
    const logSampleView = async () => {
      await supabase
        .from('sample_views')
        .insert({});
    };

    logSampleView();
  }, []);

  if (loading) {
    return (
      <section className="py-24 px-4 bg-slate-900/50">
        <div className="container max-w-6xl">
          <div className="text-center">
            <p className="text-muted-foreground">Loading sample records...</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-24 px-4 bg-slate-900/50">
      <div className="container max-w-6xl">
        <div className="text-center mb-12">
          <Badge variant="secondary" className="mb-4 px-4 py-2 bg-secondary/20 text-secondary border border-secondary/30 green-glow">
            <Building2 className="w-4 h-4 mr-2" />
            Free Sample Data
          </Badge>
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            See the Data Quality <span className="text-primary">Before You Buy</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Here are 3 real properties from the database. The full version includes 67 more just like these.
          </p>
        </div>

        {/* Terminal-style table */}
        <Card className="glass-card max-w-5xl mx-auto overflow-hidden">
          <div className="bg-terminal-bg border-b border-terminal-border px-6 py-3">
            <p className="text-terminal-text font-mono text-sm flex items-center gap-2">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-terminal-text opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-terminal-text"></span>
              </span>
              SAMPLE_RECORDS.DB // 3 OF 70 TOTAL
            </p>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full font-mono text-sm">
              <thead className="bg-muted/50 border-b border-border">
                <tr>
                  <th className="px-4 py-3 text-left text-muted-foreground font-semibold">Property Name</th>
                  <th className="px-4 py-3 text-left text-muted-foreground font-semibold">Address</th>
                  <th className="px-4 py-3 text-left text-muted-foreground font-semibold">Age</th>
                  <th className="px-4 py-3 text-left text-muted-foreground font-semibold">Warranty Exp</th>
                  <th className="px-4 py-3 text-left text-muted-foreground font-semibold">Owner</th>
                  <th className="px-4 py-3 text-left text-muted-foreground font-semibold">Phone</th>
                </tr>
              </thead>
              <tbody>
                {samples.map((record, index) => (
                  <tr 
                    key={record.id} 
                    className={`border-b border-border/50 hover:bg-muted/30 transition-colors ${
                      index % 2 === 0 ? 'bg-muted/10' : ''
                    }`}
                  >
                    <td className="px-4 py-4 text-foreground">{record.property_name}</td>
                    <td className="px-4 py-4 text-foreground">{record.address}</td>
                    <td className="px-4 py-4 text-secondary font-semibold">{record.building_age} yrs</td>
                    <td className="px-4 py-4 text-primary">
                      {new Date(record.estimated_warranty_expiration).toLocaleDateString('en-US', { 
                        month: 'short', 
                        year: 'numeric' 
                      })}
                    </td>
                    <td className="px-4 py-4 text-foreground">{record.property_owner_name}</td>
                    <td className="px-4 py-4 text-foreground">{record.owner_phone}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        {/* Note */}
        <div className="text-center mt-8">
          <p className="text-sm text-muted-foreground">
            <span className="text-secondary font-semibold">All 70 records</span> include property name, full address, building age, warranty expiration date, owner name, and direct phone number
          </p>
        </div>
      </div>
    </section>
  );
};

export default FreeSampleSection;
