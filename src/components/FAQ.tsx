import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const FAQ = () => {
  const faqs = [
    {
      question: "Is this just old building permits?",
      answer: "No. We track live Right-of-Way data which is often faster and more accurate than standard building permits. When a property manager books a crane or closes a lane, they're telling you money is about to be spent—before the traditional permit systems catch up."
    },
    {
      question: "Who is this for?",
      answer: "Commercial Roofers, Waterproofing Consultants, HVAC suppliers, and any contractor who wants to get ahead of major commercial renovation projects. If you're tired of fighting over shared leads on Angi or HomeAdvisor, this is your alternative."
    },
    {
      question: "Why only 3 subscriptions per city?",
      answer: "If we sell to everyone, the data loses its value. Your competitors will have the same intel. By limiting access, we ensure you're calling prospects before the market gets saturated."
    },
    {
      question: "How current is the data?",
      answer: "We update daily from Dallas city permit databases. Most leads are flagged within 24-48 hours of the permit being filed. You'll receive email alerts as soon as new high-value projects appear."
    },
    {
      question: "Can I export the data to my CRM?",
      answer: "Yes. All leads come with CSV export functionality. You can easily import owner names, addresses, project types, and permit details into Salesforce, HubSpot, or any CRM you use."
    }
  ];

  return (
    <section className="py-24 px-4">
      <div className="container max-w-3xl">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Common <span className="text-primary">Questions</span>
          </h2>
          <p className="text-xl text-muted-foreground">
            Everything you need to know about Dallas Roof Radar
          </p>
        </div>

        <Accordion type="single" collapsible className="space-y-4">
          {faqs.map((faq, index) => (
            <AccordionItem 
              key={index} 
              value={`item-${index}`}
              className="glass-card px-6 border-border"
            >
              <AccordionTrigger className="text-left text-lg font-semibold hover:text-primary">
                {faq.question}
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground leading-relaxed">
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
};

export default FAQ;
