import type { Metadata, Viewport } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: {
    template: '%s | Madrid Turismo',
    default: 'Madrid Turismo - Descubre la ciudad',
  },
  description:
    'Descubre los mejores puntos de interés de Madrid. Planifica tu visita con nuestra guía turística interactiva.',
  keywords: ['Madrid', 'turismo', 'puntos de interés', 'viajes', 'guía turística'],
  authors: [{ name: 'ManuRGDev' }],
  robots: 'index, follow',
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#08515d',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}
