"use client";
import { ArrowRight } from "lucide-react";

export default function CallToAction() {
  return (
    <footer className="mx-4 sm:mx-0">
      <div className="bg-gray-800/50 border border-gray-700 py-16 sm:py-24 mt-12 px-4 rounded-3xl max-w-7xl mx-auto">
        <div className="max-w-4xl sm:max-w-5xl mx-auto text-center text-white">
          <h2 className="text-3xl sm:text-4xl font-extrabold mb-3 sm:mb-4 text-[#00d9ff] font-display uppercase tracking-wider">
            Ready to Prove Your Skills?
          </h2>
          <p className="text-base sm:text-xl max-w-2xl sm:max-w-3xl mx-auto font-mono text-secondary mb-6 sm:mb-8">
            Join thousands of developers in the ultimate coding competition.
            Climb the ranks, earn rewards, and become a coding legend.
          </p>
          <button
            onClick={() => console.log("CTA button clicked: Start Battle")}
            className="px-6 py-3 sm:px-8 sm:py-3 border border-cyan text-cyan font-bold rounded-md hover:bg-cyan hover:text-gray-900 transition flex items-center gap-2 mx-auto"
          >
            Start Your Battle Now
            <ArrowRight className="h-4 w-4 sm:h-5 sm:w-5" />
          </button>
        </div>
      </div>
    </footer>
  );
}
