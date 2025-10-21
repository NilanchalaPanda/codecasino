import React from "react";
import type { Metadata } from "next";
import Navbar from "@/components/shared/NavBar";

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
    <div>
      <Navbar />
      {children}
    </div>
  );
}
