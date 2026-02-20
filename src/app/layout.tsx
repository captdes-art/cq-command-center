import type { Metadata } from "next";
import { dmSans, spaceGrotesk } from "./fonts";
import "./globals.css";

export const metadata: Metadata = {
  title: "CQ Command Center",
  description: "Celtic Quest Fishing Operations Hub",
  robots: "noindex, nofollow",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${dmSans.variable} ${spaceGrotesk.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
