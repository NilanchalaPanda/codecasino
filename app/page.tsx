import BattleFormats from "@/components/home/BattleFormats";
import CallToAction from "@/components/home/CallToAction";
import HeroSection from "@/components/home/HeroSection";
import WhyChoose from "@/components/home/WhyChoose";
import Footer from "@/components/shared/Footer";
import Navbar from "@/components/shared/NavBar";
import NewsTicker from "@/components/shared/NewsTicker";
import { Toaster } from "react-hot-toast";

export default function HomePage() {
  return (
    <main>
      <Toaster />
      <NewsTicker />
      <Navbar />
      <HeroSection />
      <WhyChoose />
      <BattleFormats />
      <CallToAction />
      <Footer />
    </main>
  );
}
