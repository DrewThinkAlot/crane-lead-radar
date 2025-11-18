import { Card } from "@/components/ui/card";
import { Eye, UserCheck, Filter } from "lucide-react";

const SecretSauce = () => {
  const features = [
    {
      icon: Eye,
      title: "Hidden Signals",
      description: "We don't just scrape building permits. We track crane reservations and sidewalk closures—the signals that big money is being spent."
    },
    {
      icon: UserCheck,
      title: "Direct-to-Owner",
      description: "Bypass the GC. Many of our leads are Property Managers filing permits directly. Be the first to call."
    },
    {
      icon: Filter,
      title: "No Residential Junk",
      description: "Our algorithms filter out driveways and house pools. You only get commercial/multi-family leads."
    }
  ];

  return (
    <section className="py-24 px-4">
      <div className="container max-w-6xl">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            The <span className="text-primary">Secret Sauce</span>
          </h2>
          <p className="text-xl text-muted-foreground">
            Why our data is worth more than standard building permits
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

export default SecretSauce;
