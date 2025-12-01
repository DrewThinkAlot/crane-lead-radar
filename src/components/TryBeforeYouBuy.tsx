import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, Building2, DollarSign, Phone } from "lucide-react";

interface TryBeforeYouBuyProps {
  onOpenFreeLead: () => void;
}

const TryBeforeYouBuy = ({ onOpenFreeLead }: TryBeforeYouBuyProps) => {
  return (
    <section className="py-24 px-4 bg-slate-900/50">
      <div className="container max-w-5xl">
        <div className="text-center mb-12">
          <Badge variant="secondary" className="mb-4 px-4 py-2 bg-secondary/20 text-secondary border border-secondary/30 green-glow">
            <CheckCircle2 className="w-4 h-4 mr-2" />
            Zero Risk Offer
          </Badge>
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Nobody Trusts New Data. <span className="text-primary">So We'll Prove It.</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            We'll send you one high-value commercial lead from last week—completely free. 
            See the quality for yourself before you commit to anything.
          </p>
        </div>

        {/* Mock Lead Card */}
        <Card className="glass-card max-w-3xl mx-auto mb-8 overflow-hidden">
          <div className="bg-secondary/10 border-b border-secondary/20 px-6 py-3">
            <p className="text-secondary font-mono text-sm flex items-center gap-2">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-secondary opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-secondary"></span>
              </span>
              EXAMPLE LEAD - TRACKED LAST WEEK
            </p>
          </div>
          
          <div className="p-6 font-mono text-sm space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-muted-foreground mb-1">PROJECT TYPE</p>
                <p className="text-foreground font-semibold flex items-center gap-2">
                  <Building2 className="w-4 h-4 text-primary" />
                  New Commercial Warehouse (50k sq ft)
                </p>
              </div>
              <div>
                <p className="text-muted-foreground mb-1">LOCATION</p>
                <p className="text-foreground font-semibold">
                  401 Terry Ave N, Seattle, WA 98109
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-muted-foreground mb-1">APPLICANT (GENERAL CONTRACTOR)</p>
                <p className="text-foreground font-semibold">
                  Balfour Beatty Construction
                </p>
              </div>
              <div>
                <p className="text-muted-foreground mb-1">EST. PROJECT VALUE</p>
                <p className="text-secondary font-semibold flex items-center gap-2">
                  <DollarSign className="w-4 h-4" />
                  $2,500,000
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-muted-foreground mb-1">ROOF STATUS</p>
                <p className="text-foreground font-semibold">
                  Uncontracted / Buyout Phase
                </p>
              </div>
              <div>
                <p className="text-muted-foreground mb-1">ACTION</p>
                <p className="text-foreground flex items-center gap-2">
                  <Phone className="w-4 h-4 text-primary" />
                  <span className="blur-sm select-none">Unlock GC Contact Info</span>
                  <Badge variant="secondary" className="text-xs">Subscribers only</Badge>
                </p>
              </div>
            </div>
          </div>
        </Card>

        {/* CTA */}
        <div className="text-center">
          <Button 
            size="lg" 
            className="text-lg px-10 py-6 orange-glow hover:scale-105 transition-transform"
            onClick={onOpenFreeLead}
          >
            Send Me One Lead Free
          </Button>
          <p className="text-sm text-muted-foreground mt-4">
            Delivered in 2 minutes • No credit card • No sales calls
          </p>
        </div>

        {/* Social proof counter */}
        <div className="text-center mt-8">
          <p className="text-sm text-muted-foreground">
            <span className="text-secondary font-semibold">47 free leads</span> sent this week
          </p>
        </div>
      </div>
    </section>
  );
};

export default TryBeforeYouBuy;