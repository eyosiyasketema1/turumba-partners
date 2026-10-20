import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Turumba Messaging",
  description: "From content to connection to community. Digital infrastructure for Kingdom collaboration.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className="h-full antialiased" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,100..1000;1,9..40,100..1000&display=swap"
          rel="stylesheet"
        />
      </head>
      <body style={{ fontFamily: "'DM Sans', sans-serif" }} className="min-h-full flex flex-col">
        {children}
      </body>
    </html>
  );
}
