import 'reflect-metadata';

import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { StoreProvider } from '@/components/StoreProvider';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'EMS Admin',
  description: 'Event Management System Admin'
};

export default function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang='en'>
      <body className={`${inter.className} h-screen`}>
        <StoreProvider>
          <Navbar />
          <div className='min-h-[80%]'>{children}</div>
          <Footer />
        </StoreProvider>
      </body>
    </html>
  );
}
