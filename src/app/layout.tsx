import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "LumieraMed Admin",
  description: "Admin dashboard for LumieraMed placement platform",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
