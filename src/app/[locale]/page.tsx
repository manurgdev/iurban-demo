import { Metadata } from 'next';
import { fetchHomeData, fetchCommonConfig } from '@/lib/api';
import { getMessages } from '@/i18n/get-messages';
import { Locale } from '@/types/api';
import { locales } from '@/i18n/config';
import HomeContent from '@/components/HomeContent';
import { WebsiteStructuredData } from '@/components/StructuredData';

// ============================================================================
// SSG + ISR (Incremental Static Regeneration)
// ============================================================================
// La página se genera como HTML estático en build time.
// Después de 60 segundos, la siguiente request regenera la página en background.
// Esto combina lo mejor de SSG (velocidad) con datos actualizados.

/**
 * Tiempo de revalidación para ISR.
 * - La página se sirve desde cache estático
 * - Después de 60s, la siguiente request regenera en background
 * - El usuario recibe la versión cacheada (instantáneo)
 */
export const revalidate = 60; // Revalidar cada 60 segundos (aumentable en un producto real)
export const dynamic = 'force-static'; // Forzar generación estática

export async function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

interface HomePageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: HomePageProps): Promise<Metadata> {
  const { locale } = await params;
  const messages = await getMessages(locale as Locale);

  return {
    title: messages.home?.title || 'Descubre Madrid',
    description: messages.home?.metaDescription || 'Descubre los mejores puntos de interés de Madrid.',
    openGraph: {
      title: messages.home?.title || 'Descubre Madrid',
      description: messages.home?.metaDescription || 'Descubre los mejores puntos de interés de Madrid.',
      type: 'website',
      locale: locale,
    },
  };
}

export default async function HomePage({ params }: HomePageProps) {
  const { locale } = await params;
  const localeTyped = locale as Locale;
  
  const [homeData, commonConfig] = await Promise.all([
    fetchHomeData(),
    fetchCommonConfig(),
  ]);

  // Colores y logos corporativos desde el endpoint especificado para el branding
  const { corpColor1, corpColor2, logoList } = commonConfig.appStyle;
  const heroLogo = logoList?.secondaryLogo?.value;

  return (
    <>
      <WebsiteStructuredData locale={localeTyped} />
      
      <HomeContent
        heroSection={homeData.heroSection}
        homePoints={homeData.homePoints}
        agendaEvents={homeData.agendaEvents}
        corpColor1={corpColor1}
        corpColor2={corpColor2}
        heroLogo={heroLogo}
      />
    </>
  );
}
