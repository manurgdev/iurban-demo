import { Locale } from '@/types/api';

interface WebsiteStructuredDataProps {
  locale: Locale;
  baseUrl?: string;
}

interface PlaceStructuredDataProps {
  name: string;
  description: string;
  image?: string;
  address?: string;
  coordinates?: string;
  locale: Locale;
}

/**
 * Datos estructurados para WebSite (Schema.org)
 * Puede mejorar el SEO al proporcionar información contextual a los motores de búsqueda
 */
export function WebsiteStructuredData({
  locale,
  baseUrl = 'https://iurban-demo.vercel.app', // URL de la web, en la demo se usa una de ejemplo
}: WebsiteStructuredDataProps) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: locale === 'es' ? 'Madrid Turismo' : 'Madrid Tourism',
    description:
      locale === 'es'
        ? 'Descubre los mejores puntos de interés de Madrid'
        : 'Discover the best points of interest in Madrid',
    url: `${baseUrl}/${locale}`,
    inLanguage: locale,
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${baseUrl}/${locale}/search?q={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
    publisher: {
      '@type': 'Organization',
      name: 'Madrid Turismo',
      logo: {
        '@type': 'ImageObject',
        url: `${baseUrl}/logo.png`,
      },
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}

/**
 * Datos estructurados para TouristAttraction (Schema.org)
 * Puede mejorar la visibilidad de puntos de interés en los resultados de búsqueda
 */
export function PlaceStructuredData({
  name,
  description,
  image,
  address,
  coordinates,
  locale,
}: PlaceStructuredDataProps) {
  let geo;
  if (coordinates) {
    const [lat, lng] = coordinates.split(',').map((c) => c.trim());
    if (lat && lng) {
      geo = {
        '@type': 'GeoCoordinates',
        latitude: parseFloat(lat),
        longitude: parseFloat(lng),
      };
    }
  }

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'TouristAttraction',
    name,
    description: description.replace(/<[^>]*>/g, '').substring(0, 500),
    ...(image && { image }),
    ...(address && {
      address: {
        '@type': 'PostalAddress',
        streetAddress: address,
        addressLocality: 'Madrid',
        addressCountry: 'ES',
      },
    }),
    ...(geo && { geo }),
    inLanguage: locale,
    isAccessibleForFree: false,
    touristType: {
      '@type': 'Audience',
      audienceType: locale === 'es' ? 'Turistas' : 'Tourists',
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}

/**
 * Datos estructurados para BreadcrumbList (Schema.org)
 * Puede mejorar la navegación en los resultados de búsqueda
 */
export function BreadcrumbStructuredData({
  items,
  baseUrl = 'https://iurban-demo.vercel.app', // URL de la web, en la demo se usa una de ejemplo
}: {
  items: Array<{ name: string; href: string }>;
  baseUrl?: string;
}) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: `${baseUrl}${item.href}`,
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}
