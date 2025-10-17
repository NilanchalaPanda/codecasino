import BattleFormats from "@/components/home/BattleFormats";
import CallToAction from "@/components/home/CallToAction";
import HeroSection from "@/components/home/HeroSection";
import WhyChoose from "@/components/home/WhyChoose";

export default function HomePage() {
  return (
    <main className="mb-12">
      <HeroSection />
      <WhyChoose />
      <BattleFormats />
      <CallToAction />
    </main>
  );
}
