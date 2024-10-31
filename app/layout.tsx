import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Aimpower Zoom App",
  description: "This is zoom app developed by Aimpower.org",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
