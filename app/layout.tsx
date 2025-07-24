import type { Metadata } from "next";
import { Geist, Geist_Mono, Afacad } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const afcad = Afacad({
  variable: "--font-afcad",
  subsets: ["latin"],
});


export const metadata: Metadata = {
  title: "ChatStack | AI Agents for Business",
  description: "...",
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon.ico',
    apple: '/favicon.ico',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${afcad.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
