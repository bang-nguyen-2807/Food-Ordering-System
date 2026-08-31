import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Topbar from "@/components/sidebar/topbar/topbar";
import Navbar from "@/components/sidebar/navbar/navbar";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "FoodGo - Food Ordering System",
  description: "Hệ thống đặt đồ ăn FoodGo",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-screen flex flex-col bg-gray-50 font-sans text-gray-900">
        {/* Topbar nằm ở phía trên cùng */}
        <Topbar />

        {/* Body chứa Navbar nằm ở phía tay trái và khu vực children */}
        <div className="flex flex-1 relative">
          {/* Navbar nằm ở phía tay trái */}
          <Navbar />

          {/* Nội dung trang (children) */}
          <main className="flex-1 p-6 md:p-8 overflow-y-auto">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}
