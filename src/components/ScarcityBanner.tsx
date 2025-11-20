import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { AlertTriangle } from "lucide-react";

const ScarcityBanner = () => {
  const [remaining, setRemaining] = useState<number | null>(null);
  const MAX_COPIES = 5;

  useEffect(() => {
    const fetchPurchaseCount = async () => {
      const { count, error } = await supabase
        .from('database_purchases')
        .select('*', { count: 'exact', head: true })
        .eq('payment_status', 'completed');

      if (error) {
        console.error('Error fetching purchase count:', error);
      } else {
        const purchased = count || 0;
        setRemaining(Math.max(0, MAX_COPIES - purchased));
      }
    };

    fetchPurchaseCount();

    // Set up realtime subscription
    const channel = supabase
      .channel('database_purchases_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'database_purchases'
        },
        () => {
          fetchPurchaseCount();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  if (remaining === null) return null;

  const isSoldOut = remaining === 0;

  return (
    <div className={`sticky top-0 z-50 ${isSoldOut ? 'bg-destructive' : 'bg-primary'} text-primary-foreground py-3 px-4`}>
      <div className="container max-w-6xl mx-auto">
        <p className="text-center font-bold flex items-center justify-center gap-2">
          <AlertTriangle className="w-5 h-5" />
          {isSoldOut ? (
            <>SOLD OUT - Join waitlist for next update</>
          ) : (
            <>🔴 ONLY 5 COPIES AVAILABLE IN ORLANDO | {remaining} REMAINING</>
          )}
        </p>
      </div>
    </div>
  );
};

export default ScarcityBanner;
