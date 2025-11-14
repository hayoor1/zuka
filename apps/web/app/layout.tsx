import './globals.css';
import type { ReactNode } from 'react';
import { Inter } from 'next/font/google';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'Zuka - Nigeria\'s Luxury Fashion Destination',
  description: 'Experience premium shopping with exclusive fashion collections, designer pieces, and rewarding loyalty programs. Nigeria\'s most sophisticated online luxury marketplace.',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        {children}
      </body>
    </html>
  );
}