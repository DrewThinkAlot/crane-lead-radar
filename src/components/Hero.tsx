import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Building2, TrendingUp, AlertCircle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface HeroProps {
  onOpenWaitlist: (mode?: 'waitlist' | 'free-lead' | 'purchase') => void;
}

const Hero = ({ onOpenWaitlist }: HeroProps) => {
  const [isSoldOut, setIsSoldOut] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAvailability = async () => {
      const { count } = await supabase
        .from('database_purchases')
        .select('*', { count: 'exact', head: true })
        .eq('payment_status', 'completed');

      setIsSoldOut((count || 0) >= 5);
      setLoading(false);
    };

    checkAvailability();
  }, []);
  return (
    <section className="relative min-h-screen flex items-center justify-center px-4 py-20 overflow-hidden">
      {/* Background grid effect */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:4rem_4rem] opacity-20" />
      
      <div className="container max-w-6xl relative z-10">
        <div className="text-center space-y-8 animate-slide-up">
          {/* Badge */}
          <div className="flex justify-center">
          <Badge variant="secondary" className="px-4 py-2 text-sm font-mono bg-secondary/20 text-secondary border border-secondary/30 green-glow">
              <TrendingUp className="w-4 h-4 mr-2" />
              50 Commercial Buildings. Warranties Expiring.
            </Badge>
          </div>

          {/* Main Headline */}
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight leading-tight">
            50 Commercial Buildings in Seattle.{" "}
            <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Warranties Expiring. Owners Ready to Buy.
            </span>
          </h1>

          {/* Subheadline */}
          <p className="text-xl md:text-2xl text-muted-foreground max-w-4xl mx-auto leading-relaxed">
            We pulled <span className="text-foreground font-semibold">15+ years of permit records</span> and compiled the only database of commercial properties hitting warranty expiration.{" "}
            <span className="text-secondary font-semibold">Get property owner contact info for buildings that need a new roof now.</span>
          </p>

          {/* CTA Buttons */}
          {loading ? (
            <div className="py-6 text-muted-foreground">Loading...</div>
          ) : isSoldOut ? (
            <div className="space-y-4 pt-4">
              <div className="flex items-center justify-center gap-2 text-destructive">
                <AlertCircle className="w-6 h-6" />
                <span className="text-2xl font-bold">SOLD OUT</span>
              </div>
              <p className="text-lg text-muted-foreground">
                All 5 copies of the current database have been claimed
              </p>
              <Button 
                size="lg" 
                variant="secondary"
                className="text-lg px-8 py-6"
                onClick={() => onOpenWaitlist('waitlist')}
              >
                Join Waitlist for Next Release
              </Button>
            </div>
          ) : (
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4">
              <Button 
                size="lg" 
                className="text-lg px-8 py-6 orange-glow hover:scale-105 transition-transform"
                onClick={() => onOpenWaitlist('purchase')}
              >
                <Building2 className="w-5 h-5 mr-2" />
                Buy Database for $499
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                className="text-lg px-8 py-6 border-2"
                onClick={() => onOpenWaitlist('free-lead')}
              >
                See 3 Sample Records Free
              </Button>
            </div>
          )}

          {/* Trust indicator */}
          <p className="text-sm text-muted-foreground pt-4">
            One-time payment • Full database access • Permanent download link
          </p>
        </div>
      </div>
    </section>
  );
};

export default Hero;
