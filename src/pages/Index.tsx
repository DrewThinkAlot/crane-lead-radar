import { useState } from "react";
import Hero from "@/components/Hero";
import SecretSauce from "@/components/SecretSauce";
import LiveFeed from "@/components/LiveFeed";
import Pricing from "@/components/Pricing";
import FAQ from "@/components/FAQ";
import Footer from "@/components/Footer";
import WaitlistModal from "@/components/WaitlistModal";

const Index = () => {
  const [waitlistOpen, setWaitlistOpen] = useState(false);

  return (
    <main className="min-h-screen">
      <Hero onOpenWaitlist={() => setWaitlistOpen(true)} />
      <SecretSauce />
      <LiveFeed />
      <Pricing onOpenWaitlist={() => setWaitlistOpen(true)} />
      <FAQ />
      <Footer />
      <WaitlistModal open={waitlistOpen} onOpenChange={setWaitlistOpen} />
    </main>
  );
};

export default Index;
