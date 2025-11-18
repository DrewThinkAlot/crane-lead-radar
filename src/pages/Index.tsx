import { useState } from "react";
import Hero from "@/components/Hero";
import SecretSauce from "@/components/SecretSauce";
import LiveFeed from "@/components/LiveFeed";
import TryBeforeYouBuy from "@/components/TryBeforeYouBuy";
import Pricing from "@/components/Pricing";
import FAQ from "@/components/FAQ";
import Footer from "@/components/Footer";
import WaitlistModal from "@/components/WaitlistModal";

const Index = () => {
  const [waitlistOpen, setWaitlistOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'waitlist' | 'free-lead'>('waitlist');

  const handleOpenWaitlist = (mode: 'waitlist' | 'free-lead' = 'waitlist') => {
    setModalMode(mode);
    setWaitlistOpen(true);
  };

  return (
    <main className="min-h-screen">
      <Hero onOpenWaitlist={handleOpenWaitlist} />
      <SecretSauce />
      <LiveFeed />
      <TryBeforeYouBuy onOpenFreeLead={() => handleOpenWaitlist('free-lead')} />
      <Pricing onOpenWaitlist={() => handleOpenWaitlist('waitlist')} />
      <FAQ />
      <Footer />
      <WaitlistModal open={waitlistOpen} onOpenChange={setWaitlistOpen} mode={modalMode} />
    </main>
  );
};

export default Index;
