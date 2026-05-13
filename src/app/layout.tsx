import type { Metadata } from "next";
import { Open_Sans } from "next/font/google";
import "./globals.css";
import { AppShell } from "@/components/AppShell";
import { PasswordGate } from "@/components/PasswordGate";

const openSans = Open_Sans({
  subsets: ["latin"],
  weight: ["400", "600", "700"],
  variable: "--font-sans",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Supported Release Center — JFrog",
  description:
    "Internal alignment POC for the Supported Release Center. Cores, Services, SLA-driven vulnerability lifecycle, and CVE×Service matrix.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`h-full antialiased ${openSans.variable}`}>
      <body className="h-full font-sans">
        <PasswordGate>
          <AppShell>{children}</AppShell>
        </PasswordGate>
      </body>
    </html>
  );
}
