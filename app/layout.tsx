// ===========================================
// ROOT LAYOUT
// Solar Template - app/layout.tsx
// ===========================================

import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { APP_NAME, APP_DESCRIPTION } from '@/config/constants';

// ===========================================
// FONTS
// ===========================================

const inter = Inter({ 
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});

// ===========================================
// METADATA
// ===========================================

export const metadata: Metadata = {
  title: {
    default: APP_NAME,
    template: `%s | ${APP_NAME}`,
  },
  description: APP_DESCRIPTION,
  keywords: ['real estate', 'switzerland', 'property', 'valais', 'map'],
};

// ===========================================
// LAYOUT
// ===========================================

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="de-CH" className={inter.variable}>
      <body className="min-h-screen bg-gray-50 font-sans antialiased">
        {children}
      </body>
    </html>
  );
}
