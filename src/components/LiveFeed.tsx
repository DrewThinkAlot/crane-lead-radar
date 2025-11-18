import { Badge } from "@/components/ui/badge";
import { ArrowUpRight, Construction, AlertCircle } from "lucide-react";

const LiveFeed = () => {
  const leads = [
    {
      address: "13907 Noel Rd",
      status: "Crane Lift (350 Ton)",
      owner: "Galleria Hotel",
      value: "High",
      isNew: true
    },
    {
      address: "2811 Maple Ave",
      status: "Sidewalk Closure (Roof Staging)",
      owner: "Crescent Realty",
      value: "High",
      isNew: true
    },
    {
      address: "8350 N Central Expy",
      status: "Lane Closure + Equipment Storage",
      owner: "Park Place Tower LLC",
      value: "High",
      isNew: false
    }
  ];

  return (
    <section className="py-24 px-4 bg-terminal-bg/50">
      <div className="container max-w-5xl">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-secondary/10 border border-secondary/30 mb-6">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-secondary opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-secondary"></span>
            </span>
            <span className="text-secondary font-mono text-sm font-semibold">LIVE FEED</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            See What You're <span className="text-primary">Missing</span>
          </h2>
          <p className="text-xl text-muted-foreground">
            Real permits from this week. Your competitors don't have this data.
          </p>
        </div>

        {/* Terminal-style container */}
        <div className="terminal-glow rounded-lg bg-terminal-bg border-2 border-terminal-border overflow-hidden">
          {/* Terminal header */}
          <div className="bg-card border-b border-terminal-border px-6 py-3 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex gap-2">
                <div className="w-3 h-3 rounded-full bg-destructive"></div>
                <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                <div className="w-3 h-3 rounded-full bg-secondary"></div>
              </div>
              <span className="font-mono text-sm text-muted-foreground">dallas_permits_feed.log</span>
            </div>
            <Construction className="w-5 h-5 text-primary" />
          </div>

          {/* Feed content */}
          <div className="p-6 space-y-4 font-mono text-sm">
            {leads.map((lead, index) => (
              <div 
                key={index}
                className="p-4 rounded border border-border bg-card/30 hover:bg-card/50 hover:border-primary/50 transition-all group cursor-pointer"
              >
                <div className="flex flex-wrap items-start gap-4">
                  {lead.isNew && (
                    <Badge variant="secondary" className="bg-secondary/20 text-secondary border-secondary/30 px-2 py-1">
                      NEW
                    </Badge>
                  )}
                  <div className="flex-1 min-w-[200px]">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-foreground font-semibold">{lead.address}</span>
                      <ArrowUpRight className="w-4 h-4 text-primary opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-muted-foreground">
                      <div>
                        <span className="text-terminal-text">Status:</span> {lead.status}
                      </div>
                      <div>
                        <span className="text-terminal-text">Owner:</span> {lead.owner}
                      </div>
                      <div className="flex items-center gap-1">
                        <span className="text-terminal-text">Value:</span>
                        <span className="text-primary font-semibold flex items-center gap-1">
                          {lead.value}
                          <AlertCircle className="w-3 h-3" />
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Terminal footer */}
          <div className="px-6 py-3 bg-card/50 border-t border-border">
            <p className="font-mono text-xs text-muted-foreground">
              <span className="text-terminal-text">$</span> Updated 4 minutes ago • Next refresh in 2m 15s
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default LiveFeed;
