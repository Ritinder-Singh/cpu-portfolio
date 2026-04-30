import type { Metadata, Viewport } from 'next';
import './globals.css';

const BASE_URL = 'https://site.ritinder-singh.com';

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  title: 'Ritinder Singh — Portfolio',
  description: 'Backend Developer specializing in Flutter, Python, and scalable systems. Explore my projects, skills, and experience.',
  keywords: ['Ritinder Singh', 'Backend Developer', 'Flutter', 'Python', 'TypeScript', 'Portfolio'],
  authors: [{ name: 'Ritinder Singh', url: BASE_URL }],
  openGraph: {
    type: 'website',
    url: BASE_URL,
    siteName: 'Ritinder Singh',
    title: 'Ritinder Singh — Portfolio',
    description: 'Backend Developer specializing in Flutter, Python, and scalable systems.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Ritinder Singh — Portfolio',
    description: 'Backend Developer specializing in Flutter, Python, and scalable systems.',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
