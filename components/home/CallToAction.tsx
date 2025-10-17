"use client";

import { ArrowRight } from "lucide-react";

export default function CallToAction() {
  return (
    <footer className="bg-zinc-950 border border-foreground/15 py-24 mt-12 px-4 rounded-4xl max-w-7xl mx-auto">
      <div className="max-w-5xl mx-auto text-center text-white">
        <h2 className="text-4xl sm:text-5xl font-extrabold mb-4 text-[#00d9ff] font-display uppercase tracking-wider">
          Ready to Prove Your Skills?
        </h2>
        <p className="text-xl max-w-3xl mx-auto font-mono text-gray-400 mb-8">
          Join thousands of developers in the ultimate coding competition. Climb
          the ranks, earn rewards, and become a coding legend.
        </p>
        <button
          onClick={() => console.log("CTA button clicked: Start Battle")}
          className="px-8 py-3 border border-cyan text-cyan font-bold rounded-md hover:bg-cyan hover:text-black transition flex items-center gap-2 mx-auto"
        >
          Start Your Battle Now
          <ArrowRight className="h-5 w-5" />
        </button>
      </div>
    </footer>
  );
}
