import type { Metadata } from 'next';
import { Syne, Inter, Space_Mono } from 'next/font/google';
import './globals.css';

const syne = Syne({ subsets: ['latin'], variable: '--font-syne' });
const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });
const spaceMono = Space_Mono({
  subsets: ['latin'],
  weight: ['400', '700'],
  variable: '--font-space-mono',
});

export const metadata: Metadata = {
  title: 'LoopCast — In-Browser Video Looper',
  description: 'Loop any video to match any audio length. Entirely in your browser using WebAssembly.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${syne.variable} ${inter.variable} ${spaceMono.variable}`}>
      <body className="bg-[var(--bg-base)] text-[var(--text-primary)] font-body antialiased">
        {children}
      </body>
    </html>
  );
}
