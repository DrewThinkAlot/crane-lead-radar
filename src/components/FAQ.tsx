import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const FAQ = () => {
  const faqs = [
    {
      question: "How do you calculate warranty expiration dates?",
      answer: "We pull the last roof permit date from Orange County records and add 20 years (the standard commercial roof warranty period). This gives property owners a clear timeline of when they'll need a replacement roof."
    },
    {
      question: "Why are these properties better than chasing roofing permits?",
      answer: "By the time a roofing permit is filed, the contract is already signed. Our database shows buildings before they file permits—while property owners are still budgeting and comparing bids. You're proactive, not reactive."
    },
    {
      question: "What information is included for each property?",
      answer: "Each record includes: Property name, full address, building age, year built, square footage, property type, estimated warranty expiration date, property owner name, property management company (if applicable), and direct phone number. Email addresses are included when available."
    },
    {
      question: "How do I receive the database?",
      answer: "Within 20 minutes of purchase, you'll receive an email with a permanent download link to a CSV file. You can import this into Excel, Google Sheets, or your CRM. The link never expires, so you can download it as many times as you need."
    },
    {
      question: "Can I buy an updated version later?",
      answer: "Yes. Approximately 6 months after your purchase, we'll notify you when an updated database is available. You can repurchase to get fresh data with newly expiring warranties and updated contact information."
    },
    {
      question: "Why only 5 copies?",
      answer: "Scarcity protects value. If we sell to everyone, the data becomes worthless—every roofer in Orlando would be calling the same 70 property owners. By limiting sales to 5, you get a real competitive advantage with minimal market saturation."
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
            Everything you need to know about the Orlando Commercial Roof Database
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
