import {
  CommonConfig,
  HomeData,
  HomeDataLight,
  PointDetail,
  PointItemLight,
  HomePointLight,
} from '@/types/api';

const BASE_URL = 'https://cicerone.cms-iurban.com/api';

// ============================================================================
// API FUNCTIONS
// ============================================================================
// Con SSG + ISR, el cache lo maneja Next.js a nivel de página:
// - Build time: fetch de datos → generar HTML estático
// - Runtime: servir HTML estático (instantáneo)
// - Revalidación: regenerar en background cada X segundos

/**
 * Obtiene la configuración común/branding de la aplicación.
 * El cache se gestiona a nivel de página con ISR.
 */
export async function fetchCommonConfig(): Promise<CommonConfig> {
  const response = await fetch(`${BASE_URL}/get-common-app/emt`, {
    cache: 'no-store',
  });

  if (!response.ok) {
    throw new Error(`Error fetching common config: ${response.status}`);
  }

  return response.json();
}

/**
 * Transforma los datos pesados de la API a una versión ligera.
 * Solo extrae los campos necesarios para renderizar la UI de la Home.
 * Para las imágenes uso lazy loading, por lo que puedo incluir todos los items.
 * Reduce el tamaño de los datos cacheados (~9MB → ~500KB)
 */
function transformToLightData(data: HomeData): HomeDataLight {
  // Interesan eventos y categorías para la demo
  const supportedPoints = data.homePoints
    .filter((hp) => hp.type === 'events' || hp.type === 'categories')
    .sort((a, b) => {
      if (a.type === 'events' && b.type !== 'events') return -1;
      if (a.type !== 'events' && b.type === 'events') return 1;
      return 0;
    });

  const eventsSection = data.homePoints.find((hp) => hp.type === 'events');
  const allEvents = eventsSection?.events || [];
  const agendaEvents: PointItemLight[] = allEvents.map((item): PointItemLight => ({
    id: item.id,
    itemType: 'event',
    name: item.name,
    image: item.image,
    nameSlug: item.nameSlug,
    location: item.location,
    price: item.price || '',
    durationc: item.durationc,
    start: item.start,
    end: item.end,
  }));

  return {
    status: data.status,
    heroSection: data.heroSection,
    agendaEvents,
    homePoints: supportedPoints.map((homePoint): HomePointLight => {
      // Para eventos: tenemos una estructura diferente a las categorías
      if (homePoint.type === 'events') {
        const eventItems = homePoint.events || [];
        return {
          id: typeof homePoint.id === 'string' ? 0 : homePoint.id, // Normalizo id
          type: 'events',
          category: {
            id: 0,
            icon: homePoint.icon || 'eventos',
            name: { es: 'Eventos', en: 'Events' },
            nameSlug: { es: 'eventos', en: 'events' },
            image: '',
          },
          items: eventItems.map((item): PointItemLight => ({
            id: item.id,
            itemType: 'event',
            name: item.name,
            image: item.image,
            nameSlug: item.nameSlug,
            location: item.location,
            price: item.price || '',
            durationc: item.durationc,
            start: item.start,
            end: item.end,
          })),
        };
      }

      // Para categorías: estructura estándar (primera iteración)
      return {
        id: typeof homePoint.id === 'string' ? 0 : homePoint.id,
        type: homePoint.type,
        category: homePoint.category!,
        items: (homePoint.items || []).map((item): PointItemLight => ({
          id: item.id,
          itemType: 'point',
          name: item.name,
          image: item.image,
          nameSlug: item.nameSlug,
          location: item.location,
          price: item.price,
          durationc: item.durationc,
          start: item.start,
          end: item.end,
        })),
      };
    }),
  };
}

/**
 * Obtiene los datos necesarios para la Home.
 * 
 * Estrategia con SSG + ISR:
 * - El endpoint devuelve varios MB, superando el límite de 2MB de Next.js fetch cache, que fue mi primera opción.
 * - Procesamos los datos para extraer solo campos necesarios (~500KB)
 * - El cache lo gestiona Next.js a nivel de página (revalidate en page.tsx)
 * 
 * Build time: fetch (~5s) + procesamiento → HTML estático
 * Runtime: servir HTML estático (instantáneo)
 */
export async function fetchHomeData(): Promise<HomeDataLight> {
  console.log('[API] Fetching home data from external API...');
  
  const response = await fetch(`${BASE_URL}/get-home-app-data/emt`, {
    cache: 'no-store', // No uso fetch cache, ya que es demasiado grande (>2MB)
  });

  if (!response.ok) {
    throw new Error(`Error fetching home data: ${response.status}`);
  }

  const rawData: HomeData = await response.json();
  const lightData = transformToLightData(rawData);
  
  console.log('[API] Home data processed successfully');
  return lightData;
}

/**
 * Obtiene los detalles de un punto específico.
 * @param pointId - ID del punto a consultar
 */
export async function fetchPointDetail(pointId: string | number): Promise<PointDetail> {
  const response = await fetch(`${BASE_URL}/get-point-app-details/${pointId}`, {
    next: { revalidate: 300 }, // Cacheo por 5 minutos
  });

  if (!response.ok) {
    throw new Error(`Error fetching point detail: ${response.status}`);
  }

  return response.json();
}

/**
 * Obtiene los detalles de un evento específico.
 * Los eventos usan un endpoint diferente a los puntos. (Encontrado haciendo un poco de ingeniería inversa con ensayo/error)
 * @param eventId - ID del evento a consultar
 */
export async function fetchEventDetail(eventId: string | number): Promise<PointDetail> {
  const response = await fetch(`${BASE_URL}/get-event-app-details/${eventId}`, {
    next: { revalidate: 300 }, // Igual que con los puntos, cacheo por 5 minutos
  });

  if (!response.ok) {
    throw new Error(`Error fetching event detail: ${response.status}`);
  }

  return response.json();
}
