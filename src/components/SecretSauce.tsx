import { Card } from "@/components/ui/card";
import { Eye, UserCheck, Filter } from "lucide-react";

const SecretSauce = () => {
  const features = [
    {
      icon: Eye,
      title: "The Old Way (Failure)",
      description: "Waiting for roofing permits. Result: You call the GC, but they already signed a contract with someone else. You're too late to the plan room."
    },
    {
      icon: UserCheck,
      title: "The New Way (Success)",
      description: "Tracking New Construction permits. Result: You call the GC while they are still budgeting. You get the 'Last Look' at the bid during the buyout phase."
    },
    {
      icon: Filter,
      title: "Massive Volume",
      description: "Orlando is booming. We track dozens of new commercial starts every month—warehouses, strip malls, apartment complexes. All before submittals close."
    }
  ];

  return (
    <section className="py-24 px-4">
      <div className="container max-w-6xl">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Why <span className="text-primary">It Works</span>
          </h2>
          <p className="text-xl text-muted-foreground">
            By the time a 'Roofing Permit' is filed, the job is already taken
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
