"use client";

import { Code2 } from "lucide-react";

export default function Footer() {
  return (
    <footer className="mt-8 bg-gray-900 text-secondary py-12 px-4 border-t border-gray-800">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between">
        <div className="flex items-center gap-2 mb-2 sm:mb-0">
          <Code2 className="h-5 w-5 text-cyan" />
          <span className="font-semibold font-display text-lg text-foreground">
            CodeCasino
          </span>
        </div>
        <div className="text-xs sm:text-sm font-mono text-secondary">
          © {new Date().getFullYear()} CodeCasino. All Rights Reserved.
        </div>
      </div>
    </footer>
  );
}
