import './globals.css';
import type { Metadata } from 'next';
import { Poppins } from 'next/font/google';
import ClientThemeProvider from '@/components/ClientThemeProvider';

const poppins = Poppins({ subsets: ['latin'], weight: ['400', '600'] });

export const metadata: Metadata = {
  title: 'Esteem',
  description: 'Application de quiz éducatifs avec IA',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <body className={poppins.className}>
        <ClientThemeProvider>{children}</ClientThemeProvider>
      </body>
    </html>
  );
}