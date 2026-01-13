import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { fetchPointDetail, fetchEventDetail, fetchCommonConfig } from '@/lib/api';
import { getMessages } from '@/i18n/get-messages';
import { getLocalizedText } from '@/i18n/config';
import { Locale } from '@/types/api';
import { PlaceStructuredData, BreadcrumbStructuredData } from '@/components/StructuredData';
import DetailContent from '@/components/DetailContent';

// ============================================================================
// SSR + CACHE (ISR on-demand)
// ============================================================================
// Página unificada para puntos y eventos.

export const revalidate = 300; // 5 minutos
export const dynamicParams = true;

// ============================================================================

type ItemType = 'point' | 'event';

interface DetailPageProps {
  params: Promise<{
    locale: string;
    itemType: string;
    id: string;
    slug: string;
  }>;
}

/**
 * Obtiene los datos del item según su tipo
 */
async function fetchItemData(itemType: ItemType, id: string) {
  if (itemType === 'event') {
    return fetchEventDetail(id);
  }
  return fetchPointDetail(id);
}

/**
 * Valida que el tipo sea válido
 */
function isValidItemType(type: string): type is ItemType {
  return type === 'point' || type === 'event';
}

export async function generateMetadata({ params }: DetailPageProps): Promise<Metadata> {
  const { locale, itemType, id } = await params;

  if (!isValidItemType(itemType)) {
    return { title: 'No encontrado' };
  }

  try {
    const itemData = await fetchItemData(itemType, id);
    const name = getLocalizedText(itemData.name, locale as Locale, 'Punto de interés');
    const description = getLocalizedText(itemData.description, locale as Locale, '');
    const cleanDescription = description.replace(/<[^>]*>/g, '').substring(0, 160);

    return {
      title: name,
      description: cleanDescription || `Descubre ${name} en Madrid`,
      openGraph: {
        title: name,
        description: cleanDescription || `Descubre ${name} en Madrid`,
        type: 'article',
        locale: locale,
        images: itemData.multimedia?.[0]?.name
          ? [{ url: itemData.multimedia[0].name }]
          : undefined,
      },
    };
  } catch {
    return {
      title: itemType === 'event' ? 'Evento' : 'Punto de interés',
      description: 'Descubre este lugar en Madrid',
    };
  }
}

export default async function DetailPage({ params }: DetailPageProps) {
  const { locale, itemType, id } = await params;
  const localeTyped = locale as Locale;

   // SSR: El servidor devolverá toda la información necesaria para la página
   const [commonConfig] = await Promise.all([
    fetchCommonConfig(),
  ]);

  // Colores y logos corporativos desde la el endpoint especificado para branding
  const { corpColor2 } = commonConfig.appStyle;

  if (!isValidItemType(itemType)) {
    notFound();
  }

  let itemData;
  try {
    itemData = await fetchItemData(itemType, id);
  } catch {
    notFound();
  }

  const messages = await getMessages(localeTyped);

  const name = getLocalizedText(itemData.name, localeTyped, 'Punto de interés');
  const description = getLocalizedText(itemData.description, localeTyped, '');
  const categoryName = itemData.category?.[0]
    ? getLocalizedText(itemData.category[0].name, localeTyped, 'Categoría')
    : null;

  return (
    <>
      {/* Structured Data para SEO, mejorable en un producto real */}
      <PlaceStructuredData
        name={name}
        description={description}
        image={itemData.multimedia?.[0]?.name}
        address={itemData.location}
        coordinates={itemData.coordinates}
        locale={localeTyped}
      />
      <BreadcrumbStructuredData
        items={[
          { name: messages.header?.home || 'Inicio', href: `/${locale}` },
          { name: categoryName || (messages.detail?.category || 'Punto de interés'), href: `/${locale}` },
          { name: name, href: `/${locale}/${itemType}/${id}/${getLocalizedText(itemData.name, localeTyped, '')}` },
        ]}
      />

      <DetailContent itemData={itemData} accentColor={corpColor2}/>
    </>
  );
}
