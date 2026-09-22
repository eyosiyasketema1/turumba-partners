import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Turumba Messaging",
  description: "Digital Infrastructure for Kingdom Collaboration",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className="h-full antialiased">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Urbanist:ital,wght@0,100..900;1,100..900&display=swap" rel="stylesheet" />
      </head>
      <body style={{ fontFamily: "'Urbanist', sans-serif" }} className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
