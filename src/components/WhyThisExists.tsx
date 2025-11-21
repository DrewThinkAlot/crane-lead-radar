import { Card } from "@/components/ui/card";
import { DollarSign, Target, Users } from "lucide-react";

const WhyThisExists = () => {
  const features = [
    {
      icon: DollarSign,
      title: "50 Properties. $499. That's $9.98 per lead.",
      description: "Close one deal and you've made your money back 10x over. This isn't a subscription that bleeds you dry—it's a one-time investment in your pipeline."
    },
    {
      icon: Target,
      title: "These Aren't Suspects. They're Prospects.",
      description: "Every building in this database is 15+ years old with an expiring warranty. These property owners need a new roof. You're not cold calling—you're calling at the perfect time."
    },
    {
      icon: Users,
      title: "Only 5 Copies Sold. Zero Competition.",
      description: "We cap sales at 5 to keep the data valuable. When you buy, you're one of 5 roofers in Orlando with this list. Everyone else is still chasing roofing permits (too late)."
    }
  ];

  return (
    <section className="py-24 px-4">
      <div className="container max-w-6xl">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Why <span className="text-primary">This Exists</span>
          </h2>
          <p className="text-xl text-muted-foreground">
            Most roofers are reactive. This database makes you proactive.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <Card 
              key={index}
              className="glass-card p-8 hover:border-primary/50 transition-all duration-300 group"
            >
              <div className="mb-6 inline-flex p-4 rounded-lg bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                <feature.icon className="w-8 h-8" />
              </div>
              <h3 className="text-2xl font-bold mb-4">{feature.title}</h3>
              <p className="text-muted-foreground leading-relaxed">
                {feature.description}
              </p>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhyThisExists;
