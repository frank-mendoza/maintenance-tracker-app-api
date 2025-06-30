import type { Metadata } from "next";
import "./globals.css";
import { Inter } from "next/font/google";
import { MainProvider } from "@/components/provider/MainProvider";

export const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  // metadataBase: new URL('https://yourdomain.com'),
  title: {
    default: "My Rental App",
    template: "%s | My Rental App",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} antialiased`}>
        <MainProvider>{children}</MainProvider>
      </body>
    </html>
  );
}
