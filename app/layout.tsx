// app/layout.tsx
import type { Metadata } from "next";
import { Providers } from './providers';
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import 'boxicons/css/boxicons.min.css';
import 'ag-grid-community/styles/ag-grid.css'; // Core grid styles
import 'ag-grid-community/styles/ag-theme-alpine.css'; // Optional theme (you can choose another theme)

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});


export const metadata: Metadata = {
  title: "Invent App",
  description: "Aplikasi Inventaris Sekolah SMP Negeri 8 Batam",
  icons: {
    icon: `${process.env.NEXT_PUBLIC_BASE_PATH}/favicon/favicon.ico`, // Path to your favicon
  },
};


export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}