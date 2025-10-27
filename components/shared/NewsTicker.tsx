"use client";

import React from "react";

const messages = [
  {
    text: "IDE is under dev",
    date: "2025-10-27"
  },
  {
    text: "Google OAuth is completed",
    date: "2025-10-21",
  },
  {
    text: "UI is almost completed",
    date: "2025-10-18",
  },
  {
    text: "Leaderboard UI is now ready",
    date: "2025-10-17",
  }
];

function formatDate(dateStr: string) {
  const date = new Date(dateStr);
  return date.toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export default function NewsTicker() {
  return (
    <div className="overflow-hidden whitespace-nowrap bg-[#0d0d0d] border-t border-b border-cyan-800">
      <div className="flex w-max animate-marquee py-2 text-[#00d9ff] font-mono text-xs">
        {[...messages, ...messages].map((msg, index) => (
          <div key={index} className="flex flex-row mx-8">
            <p className="text-gray-400 mr-2">[{formatDate(msg.date)}]</p>
            {msg.text}
          </div>
        ))}
      </div>
    </div>
  );
}
