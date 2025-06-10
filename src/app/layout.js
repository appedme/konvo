import { Inter } from "next/font/google";
import { StackProvider, StackTheme } from "@stackframe/stack";
import { stackServerApp } from "../stack";
import { StackProvider, StackTheme } from "@stackframe/stack";
import { stackServerApp } from "@/lib/stack";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata = {
  title: "Konvo - Find Your People. Start Your Space.",
  description: "A modern, clean, community-first platform where people can create, join, and grow Spaces — safe environments for open, unrestricted conversation.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="light">
      <body className={`${inter.variable} font-sans antialiased`}><StackProvider app={stackServerApp}><StackTheme>
        <StackProvider app={stackServerApp}>
          <StackTheme>
            {children}
          </StackTheme>
        </StackProvider>
      </StackTheme></StackProvider></body>
    </html>
  );
}
