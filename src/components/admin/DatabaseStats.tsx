import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { Building2, Eye, ShoppingCart, Users } from "lucide-react";

const DatabaseStats = () => {
  const [stats, setStats] = useState({
    totalProperties: 0,
    sampleRecords: 0,
    totalPurchases: 0,
    waitlistSignups: 0,
  });

  useEffect(() => {
    const fetchStats = async () => {
      const [
        { count: totalProperties },
        { count: sampleRecords },
        { count: totalPurchases },
        { count: waitlistSignups },
      ] = await Promise.all([
        supabase.from('commercial_buildings').select('*', { count: 'exact', head: true }),
        supabase.from('commercial_buildings').select('*', { count: 'exact', head: true }).eq('is_sample_record', true),
        supabase.from('database_purchases').select('*', { count: 'exact', head: true }),
        supabase.from('waitlist_signups').select('*', { count: 'exact', head: true }),
      ]);

      setStats({
        totalProperties: totalProperties || 0,
        sampleRecords: sampleRecords || 0,
        totalPurchases: totalPurchases || 0,
        waitlistSignups: waitlistSignups || 0,
      });
    };

    fetchStats();
  }, []);

  const statCards = [
    {
      title: "Total Properties",
      value: stats.totalProperties,
      icon: Building2,
      color: "text-primary",
    },
    {
      title: "Sample Records",
      value: stats.sampleRecords,
      icon: Eye,
      color: "text-secondary",
    },
    {
      title: "Total Purchases",
      value: stats.totalPurchases,
      icon: ShoppingCart,
      color: "text-primary",
    },
    {
      title: "Waitlist Signups",
      value: stats.waitlistSignups,
      icon: Users,
      color: "text-secondary",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {statCards.map((stat) => (
        <Card key={stat.title} className="glass-card p-6">
          <div className="flex items-center justify-between mb-2">
            <stat.icon className={`w-8 h-8 ${stat.color}`} />
          </div>
          <p className="text-3xl font-bold mb-1">{stat.value}</p>
          <p className="text-sm text-muted-foreground">{stat.title}</p>
        </Card>
      ))}
    </div>
  );
};

export default DatabaseStats;
