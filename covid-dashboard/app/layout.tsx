import type { Metadata } from "next";
import { Roboto } from "next/font/google";
import "./globals.css";

const robotoFont = Roboto({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-roboto",
});

export const metadata: Metadata = {
  title: "Covid Tracker Dashboard",
  description: "Track Covid-19 statistics by state in the US.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      {/* <body className=' font-sans font-2xl antialiased'> */}
      <body className={`${robotoFont.variable} antialiased bg-background`}>
        {children}
      </body>
    </html>
  );
}
