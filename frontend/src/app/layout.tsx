import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Career Compass",
  description: "Navigate your career path with confidence",
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
