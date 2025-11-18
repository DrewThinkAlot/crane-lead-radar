import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check, AlertTriangle } from "lucide-react";

interface PricingProps {
  onOpenWaitlist: (mode?: 'waitlist' | 'free-lead') => void;
}

const Pricing = ({ onOpenWaitlist }: PricingProps) => {
  const features = [
    "Daily Email Alerts",
    "CSV Export for CRM",
    "Direct Owner Names & Contact Info",
    "No Long-Term Contracts",
    "Priority Support"
  ];

  return (
    <section className="py-24 px-4">
      <div className="container max-w-4xl">
        <div className="text-center mb-16">
          <Badge variant="destructive" className="mb-4 px-4 py-2">
            <AlertTriangle className="w-4 h-4 mr-2" />
            STRICTLY LIMITED ACCESS
          </Badge>
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Pricing That Protects <span className="text-primary">Your Edge</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            To protect the value of the data, we only sell 3 subscriptions per city
          </p>
        </div>

        <Card className="glass-card overflow-hidden max-w-md mx-auto">
          {/* Scarcity banner */}
          <div className="bg-destructive/20 border-b border-destructive/30 px-6 py-3 text-center">
            <p className="text-destructive font-semibold flex items-center justify-center gap-2">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-destructive opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-destructive"></span>
              </span>
              1 Seat Remaining in Dallas
            </p>
          </div>

          <div className="p-8">
            {/* Price */}
            <div className="text-center mb-8">
              <div className="text-5xl font-bold mb-2">
                $299
                <span className="text-xl text-muted-foreground font-normal">/month</span>
              </div>
              <p className="text-muted-foreground">Billed monthly • Cancel anytime</p>
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
            <Button 
              className="w-full text-lg py-6 orange-glow hover:scale-105 transition-transform"
              size="lg"
              onClick={() => onOpenWaitlist('waitlist')}
            >
              Secure Your Spot Now
            </Button>

            <p className="text-center text-sm text-muted-foreground mt-4">
              No setup fees • 14-day money-back guarantee
            </p>
            
            <p className="text-center text-xs text-muted-foreground mt-2">
              Not sure yet? <button onClick={() => onOpenWaitlist('free-lead')} className="text-secondary hover:underline font-semibold">Get one lead free first →</button>
            </p>
          </div>
        </Card>
      </div>
    </section>
  );
};

export default Pricing;
