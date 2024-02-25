import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import NextAuthProvider from "@/components/NextAuthProvider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <NextAuthProvider>
        <body className={inter.className}>
          <div className="min-h-screen flex flex-col justify-center items-center">
            <div className="w-[40vw]">{children}</div>
          </div>
        </body>
      </NextAuthProvider>
    </html>
  );
}
