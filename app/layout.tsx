import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";
import { KeyboardShortcutHandler } from "@/components/KeyboardShortcutHandler";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "DAT WEB3 GUY - Airdrop Tracker",
  description: "Track the latest Web3 airdrop opportunities. Never miss a chance to earn free tokens.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Providers>
          <KeyboardShortcutHandler />
          {children}
        </Providers>
      </body>
    </html>
  );
}

