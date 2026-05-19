import type { Metadata } from 'next';
import { Playfair_Display, Epilogue, IBM_Plex_Mono } from 'next/font/google';
import './globals.css';

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair',
  weight: ['400', '700', '900'],
});
const epilogue = Epilogue({
  subsets: ['latin'],
  variable: '--font-epilogue',
  weight: ['300', '400', '500', '600', '700'],
});
const ibmPlexMono = IBM_Plex_Mono({
  subsets: ['latin'],
  weight: ['300', '400', '500'],
  variable: '--font-ibm-mono',
});

export const metadata: Metadata = {
  title: 'LoopCast — In-Browser Video Looper',
  description: 'Loop any video to match any audio length. Entirely in your browser using WebAssembly.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${playfair.variable} ${epilogue.variable} ${ibmPlexMono.variable}`}>
      <body className="bg-[var(--paper)] text-[var(--ink)] font-body antialiased">
        {children}
      </body>
    </html>
  );
}
