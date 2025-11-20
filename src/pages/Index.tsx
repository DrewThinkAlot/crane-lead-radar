import { useState } from "react";
import Hero from "@/components/Hero";
import WhyThisExists from "@/components/WhyThisExists";
import LiveFeed from "@/components/LiveFeed";
import FreeSampleSection from "@/components/FreeSampleSection";
import Pricing from "@/components/Pricing";
import FAQ from "@/components/FAQ";
import Footer from "@/components/Footer";
import WaitlistModal from "@/components/WaitlistModal";
import ScarcityBanner from "@/components/ScarcityBanner";

const Index = () => {
  const [waitlistOpen, setWaitlistOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'waitlist' | 'free-lead'>('waitlist');

  const handleOpenWaitlist = (mode: 'waitlist' | 'free-lead' = 'waitlist') => {
    setModalMode(mode);
    setWaitlistOpen(true);
  };

  return (
    <main className="min-h-screen">
      <ScarcityBanner />
      <Hero onOpenWaitlist={handleOpenWaitlist} />
      <WhyThisExists />
      <LiveFeed />
      <FreeSampleSection />
      <Pricing onOpenWaitlist={() => handleOpenWaitlist('waitlist')} />
      <FAQ />
      <Footer />
      <WaitlistModal open={waitlistOpen} onOpenChange={setWaitlistOpen} mode={modalMode} />
    </main>
  );
};

export default Index;
