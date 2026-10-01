import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "LensLink",
  description: "Camera gear compatibility, grounded in real technical evidence.",
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
