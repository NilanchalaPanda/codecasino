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
    <div>
      {children}
    </div>
  );
}
