import './globals.css';
import { Inter } from 'next/font/google';
import { ThemeProvider } from '@/components/theme-provider';
import Header from '@/components/header';
import { Toaster } from '@/components/ui/toaster';
import AuthProvider from '@/components/auth-provider';
import HydrationWrapper from '@/components/hydration-wrapper';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Plants vs Water',
  description: 'My plants must survive, they need water for them.',
  icons: {
    icon: '/favicon.ico',
  },
};

const inter = Inter({ subsets: ['latin'] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <HydrationWrapper>
          <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false}>
            <AuthProvider>
              <div className="min-h-screen flex flex-col">
                <Header />
                <main className="flex-1">
                  {children}
                </main>
                <footer className="py-4 border-t">
                  <div className="container mx-auto text-center text-sm text-muted-foreground">
                  <a
          href="https://p4techsolutions.com/"
          target="_blank"
          className="animate block text-center text-sm hover:scale-110 max-md:mt-4"
        >
        P4 Tech Solutions - Copyright 2025
        </a>
                  </div>
                </footer>
              </div>
              <Toaster />
            </AuthProvider>
          </ThemeProvider>
        </HydrationWrapper>
      </body>
    </html>
  );
}