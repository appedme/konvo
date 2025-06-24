import { Inter } from "next/font/google";
import { StackProvider, StackTheme } from "@stackframe/stack";
import { stackServerApp } from "@/lib/stack";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { SWRProvider } from "@/components/providers/swr-provider";
import { Toaster } from 'react-hot-toast';
import ErrorBoundary from "@/components/error-boundary";
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
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} font-sans antialiased`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <SWRProvider>
            <StackProvider app={stackServerApp}>
              <StackTheme>
                <ErrorBoundary>
                  {children}
                  <Toaster
                    position="bottom-right"
                    toastOptions={{
                      duration: 3000,
                      style: {
                        background: 'hsl(var(--background))',
                        color: 'hsl(var(--foreground))',
                        border: '1px solid hsl(var(--border))',
                      },
                    }}
                  />
                </ErrorBoundary>
              </StackTheme>
            </StackProvider>
          </SWRProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
