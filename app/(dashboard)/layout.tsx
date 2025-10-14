import React from "react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dashboard | CodeCasino",
  description: "User dashboard for CodeCasino",
};

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0f172a] via-[#1e1b4b] to-[#312e81] text-white">
      {children}
    </div>
  );
}
