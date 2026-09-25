import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "LensLink",
  description: "AI camera gear compatibility powered by structured Sanity content",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
