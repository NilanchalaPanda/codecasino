import BattleFormats from "@/components/home/BattleFormats";
import CallToAction from "@/components/home/CallToAction";
import HeroSection from "@/components/home/HeroSection";
import WhyChoose from "@/components/home/WhyChoose";
import Footer from "@/components/shared/Footer";

export default function HomePage() {
  return (
    <main>
      <HeroSection />
      <WhyChoose />
      <BattleFormats />
      <CallToAction />
      <Footer />
    </main>
  );
}
