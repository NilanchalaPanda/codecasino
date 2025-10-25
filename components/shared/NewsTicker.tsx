"use client";

import React from "react";

const messages = [
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
  },
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
          <span key={index} className="inline-block mx-8">
            <span className="text-gray-400 mr-2">[{formatDate(msg.date)}]</span>
            {msg.text}
          </span>
        ))}
      </div>
    </div>
  );
}
