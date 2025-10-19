import React from "react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Auth | CodeCasino",
  description: "Authentication pages for CodeCasino",
};

export default function AuthLayout({
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
