import type { Metadata } from "next";
import { JetBrains_Mono, Orbitron } from "next/font/google";
import "./globals.css";
import { UserProvider } from "@/providers/UserProvider";

const jetbrains = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains",
});

const orbitron = Orbitron({
  subsets: ["latin"],
  variable: "--font-orbitron",
});

export const metadata: Metadata = {
  title: "CodeCasino",
  description:
    "Enter the ultimate coding arena where algorithms meet adrenaline.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning={true} data-qb-installed="true">
      <body className={`${jetbrains.variable} ${orbitron.variable}`}>
        <UserProvider>{children}</UserProvider>
      </body>
    </html>
  );
}
