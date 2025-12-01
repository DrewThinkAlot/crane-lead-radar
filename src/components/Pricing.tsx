import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check, AlertTriangle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface PricingProps {
  onOpenWaitlist: (mode?: 'waitlist' | 'free-lead' | 'purchase') => void;
}

const Pricing = ({ onOpenWaitlist }: PricingProps) => {
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
      .channel('pricing_purchases_changes')
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

  const features = [
    "50 Commercial Properties in Seattle",
    "15+ Years Old (Warranties Expiring)",
    "Owner Names & Direct Phone Numbers",
    "Property Details & Permit History",
    "Permanent CSV Download Link"
  ];

  const isSoldOut = remaining === 0;

  return (
    <section className="py-24 px-4">
      <div className="container max-w-4xl">
        <div className="text-center mb-16">
          <Badge variant="destructive" className="mb-4 px-4 py-2">
            <AlertTriangle className="w-4 h-4 mr-2" />
            STRICTLY LIMITED - ONLY 5 COPIES SOLD
          </Badge>
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            One-Time Payment. <span className="text-primary">Permanent Access.</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            We limit sales to 5 copies to protect the value of the data for buyers
          </p>
        </div>

        <Card className="glass-card overflow-hidden max-w-md mx-auto">
          {/* Scarcity banner */}
          <div className={`${isSoldOut ? 'bg-destructive/20 border-destructive/30' : 'bg-primary/20 border-primary/30'} border-b px-6 py-3 text-center`}>
            <p className={`${isSoldOut ? 'text-destructive' : 'text-primary'} font-semibold flex items-center justify-center gap-2`}>
              <span className="relative flex h-2 w-2">
                <span className={`animate-ping absolute inline-flex h-full w-full rounded-full ${isSoldOut ? 'bg-destructive' : 'bg-primary'} opacity-75`}></span>
                <span className={`relative inline-flex rounded-full h-2 w-2 ${isSoldOut ? 'bg-destructive' : 'bg-primary'}`}></span>
              </span>
              {isSoldOut ? 'SOLD OUT' : `${remaining} OF 5 REMAINING`}
            </p>
          </div>

          <div className="p-8">
            {/* Price */}
            <div className="text-center mb-8">
              <div className="text-5xl font-bold mb-2">
                $499
                <span className="text-xl text-muted-foreground font-normal"> one-time</span>
              </div>
              <p className="text-muted-foreground">No subscription • Permanent access</p>
            </div>

            {/* Features */}
            <ul className="space-y-4 mb-8">
              {features.map((feature, index) => (
                <li key={index} className="flex items-center gap-3">
                  <div className="flex-shrink-0 w-5 h-5 rounded-full bg-secondary/20 flex items-center justify-center">
                    <Check className="w-3 h-3 text-secondary" />
                  </div>
                  <span className="text-foreground">{feature}</span>
                </li>
              ))}
            </ul>

            {/* CTA */}
            {isSoldOut ? (
              <Button 
                className="w-full text-lg py-6 hover:scale-105 transition-transform"
                size="lg"
                onClick={() => onOpenWaitlist('waitlist')}
              >
                Join Waitlist for Next Release
              </Button>
            ) : (
              <Button 
                className="w-full text-lg py-6 orange-glow hover:scale-105 transition-transform"
                size="lg"
                onClick={() => onOpenWaitlist('purchase')}
              >
                Buy Database Now
              </Button>
            )}

            <p className="text-center text-sm text-muted-foreground mt-4">
              Delivered within 20 minutes via email
            </p>
            
            <p className="text-center text-xs text-muted-foreground mt-2">
              Want to see the data first? <button onClick={() => onOpenWaitlist('free-lead')} className="text-secondary hover:underline font-semibold">View 3 sample records above →</button>
            </p>
          </div>
        </Card>
      </div>
    </section>
  );
};

export default Pricing;
