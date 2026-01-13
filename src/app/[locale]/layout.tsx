import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { DM_Sans } from 'next/font/google';
import { locales } from '@/i18n/config';
import { Locale } from '@/types/api';
import { getMessages, allMessages } from '@/i18n/get-messages';
import { LocaleProvider } from '@/context/LocaleContext';
import Header from '@/components/Header';
import '../globals.css';

const dmSans = DM_Sans({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-dm-sans',
});

interface LocaleLayoutProps {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}

export async function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const messages = await getMessages(locale as Locale);

  // Genero URLs alternativas para hreflang
  const alternateLanguages: Record<string, string> = {};
  locales.forEach((loc) => {
    alternateLanguages[loc] = `/${loc}`;
  });

  return {
    title: {
      template: '%s | Madrid Turismo',
      default: messages.home?.title || 'Madrid Turismo',
    },
    description: messages.home?.metaDescription || 'Descubre Madrid',
    metadataBase: new URL('https://manurg.dev'),
    alternates: {
      canonical: `/${locale}`,
      languages: alternateLanguages,
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
    openGraph: {
      type: 'website',
      siteName: 'Madrid Turismo',
      locale: locale === 'es' ? 'es_ES' : 'en_US',
    },
    twitter: {
      card: 'summary_large_image',
    },
  };
}

export default async function LocaleLayout({ children, params }: LocaleLayoutProps) {
  const { locale } = await params;

  // Validar locale
  if (!locales.includes(locale as Locale)) {
    notFound();
  }

  const messages = await getMessages(locale as Locale);

  return (
    <html lang={locale} className={dmSans.variable}>
      <body className="font-sans antialiased bg-gray-50 text-gray-900 min-h-screen">
        <LocaleProvider
          initialLocale={locale as Locale}
          initialMessages={messages}
          allMessages={allMessages}
        >
          <a
            href="#main-content"
            className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-sky-600 focus:text-white focus:rounded-lg"
          >
            {messages.accessibility?.skipToMainContent || 'Saltar al contenido principal'}
          </a>

          <Header />

          <main id="main-content" tabIndex={-1}>
            {children}
          </main>

          <footer className="bg-gray-900 text-white py-8 mt-auto">
            <div className="container mx-auto px-4 text-center">
              <p className="text-gray-400 text-sm">
                {new Date().getFullYear()} iUrban Demo. Developed by ManuRGDev (Manu Rodríguez Gil)
              </p>
            </div>
          </footer>
        </LocaleProvider>
      </body>
    </html>
  );
}
