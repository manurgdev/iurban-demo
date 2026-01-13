# Madrid Turismo - Demo iUrban

Una aplicación web turística construida con Next.js 16, diseñada como prueba técnica de desarrollo frontend, rendimiento, SEO y accesibilidad.

## 🚀 Inicio Rápido

### Requisitos Previos

- Node.js 18.18 o superior
- npm, yarn, pnpm o bun

### Instalación

```bash
# Clonar el repositorio
git clone git@github.com:manurgdev/iurban-demo.git
cd iurban-demo

# Instalar dependencias
npm install

# Iniciar servidor de desarrollo
npm run dev

# ó Inicializar servidor de producción
npm run build
npm run start
```

Abrir [http://localhost:3000](http://localhost:3000) en el navegador.

### Scripts Disponibles

```bash
npm run dev           # Servidor de desarrollo con hot reload
npm run build         # Build de producción
npm run start         # Servidor de producción
npm run lint          # Ejecutar ESLint
npm test              # Tests unitarios (Jest)
npm run test:e2e      # Tests E2E (Playwright) - Probado chromium
npm run test:all      # Todos los tests
```

---

## 🏗️ Arquitectura y Estructura del Proyecto

```
src/
├── app/                          # App Router de Next.js
│   ├── [locale]/                 # Rutas internacionalizadas
│   │   ├── layout.tsx            # Layout con Header y Footer
│   │   ├── page.tsx              # Página Home (SSG + ISR)
│   │   ├── error.tsx             # Manejo de errores
│   │   ├── not-found.tsx         # Página 404
│   │   └── [itemType]/[id]/[slug]/ # Detalle unificado (point/event)
│   ├── globals.css               # Estilos globales + Tailwind
│   └── layout.tsx                # Root layout
├── components/                   # Componentes reutilizables
│   ├── Header.tsx                # Navegación principal (Server Component)
│   ├── HeaderClient.tsx          # Navegación (Client Component con useLocale)
│   ├── HeroSection.tsx           # Hero con video/imagen (memoizado)
│   ├── HomeContent.tsx           # Contenido principal home (memoizado)
│   ├── DetailContent.tsx         # Contenido detalle (Client Component)
│   ├── Carousel.tsx              # Carrusel horizontal reutilizable (memoizado)
│   ├── CategorySection.tsx       # Sección de categoría (usa Carousel)
│   ├── AgendaSection.tsx         # Calendario de eventos (memoizado)
│   ├── PointCard.tsx             # Tarjeta de punto (memoizado)
│   ├── CategoryIcon.tsx          # Iconos de categoría (Lucide React)
│   ├── LanguageSwitcher.tsx      # Selector de idioma (cambio instantáneo)
│   ├── StructuredData.tsx        # JSON-LD para SEO
│   ├── LoadingState.tsx          # Skeleton loading (en desuso para demo)
│   ├── ErrorState.tsx            # Estado de error
│   └── EmptyState.tsx            # Estado vacío
├── context/
│   └── LocaleContext.tsx         # Contexto de idioma (ruta + cookie)
├── lib/
│   └── api.ts                    # Funciones de fetch + transformación
├── i18n/
│   ├── config.ts                 # Configuración de idiomas
│   └── get-messages.ts           # Carga de traducciones
├── types/
│   └── api.ts                    # Tipos TypeScript para API
└── messages/                     # Archivos de traducción
    ├── es.json
    └── en.json
```

### Decisiones de Stack

| Tecnología | Justificación |
|------------|---------------|
| **Next.js 16** | SSR/SSG nativo, App Router, optimización de imágenes (buen rendimiento & SEO friendly) |
| **React 19** | Última versión estable con mejoras de rendimiento (mejora DX) |
| **TypeScript** | Tipado estático para mejor DX y menos errores en runtime |
| **Tailwind CSS 4** | Utility-first CSS, purging automático, excelente para responsive |
| **Lucide React** | Iconos SVG optimizados, tree-shaking, consistencia visual |
| **Sin librerías i18n externas** | Implementación ligera y sin overhead, aprovechando rutas dinámicas de Next.js |

### Por qué Next.js con SSG/SSR híbrido

1. **SEO óptimo**: HTML completo desde el servidor, disponible inmediatamente para crawlers
2. **Mejor LCP**: Con SSG, el TTFB es <100ms (HTML pre-generado)
3. **Caching inteligente**: SSG + ISR para home, SSR + Cache para detalle
4. **URLs limpias**: Rutas dinámicas como `/es/point/123/museo-del-prado`
5. **Escalabilidad**: No pre-generamos cientos de páginas de detalle, se generan on-demand

---

## 🌍 Internacionalización (i18n)

### Enfoque Implementado

Opté por una solución **sin librerías externas** aprovechando el routing dinámico de Next.js:

```
/[locale]/              → Home en el idioma seleccionado
/[locale]/point/...     → Detalle de punto de interés
/[locale]/event/...     → Detalle de evento
```

Podría haber traducido cada ruta, pero creo que para la demo con esto era más que suficiente.

### Estructura de Traducciones

```typescript
// messages/es.json
{
  "common": {
    "loading": "Cargando...",
    "error": "Ha ocurrido un error"
  },
  "home": {
    "title": "Descubre Madrid",
    "metaDescription": "Descubre los mejores puntos de interés..."
  },
  "detail": {
    "duration": "Duración",
    "location": "Ubicación"
  },
  "accessibility": {
    "mainNavigation": "Navegación principal",
    "pointImage": "Imagen de {name}"
  }
}
```

En la demo se engloban todos los textos en el mismo fichero. Para proyectos reales / de mayor longitud, sería conveniente separar los contextos en diferentes ficheros y cargarlos bajo demanda.

### Cómo Añadir un Nuevo Idioma

1. Crear archivo `messages/fr.json` con las traducciones
2. Añadir el locale a `src/i18n/config.ts`:

```typescript
export const locales: Locale[] = ['es', 'en', 'fr'];
export const localeNames: Record<Locale, string> = {
  es: 'Español',
  en: 'English',
  fr: 'Français',
};
```

3. Actualizar el tipo `Locale` en `src/types/api.ts`

### Datos Multiidioma de la API

La API devuelve textos localizados como objetos:

```json
{
  "name": { "es": "Museo del Prado", "en": "Museo del Prado" }
}
```

En un entorno ideal, los nuevos textos dinámicos vendrían traducidos en todos los idiomas (o se le podría especificar a la API el locale para obtener los datos en el idioma deseado directamente).

Utilizo `getLocalizedText()` para extraer el idioma correcto con fallback.

### Cambio de Idioma Instantáneo (Híbrido Ruta + Cookie)

He implementado un sistema híbrido que combina **rutas para SEO** con **cookie para cambio instantáneo**:

```
┌─────────────────────────────────────────────────────────┐
│  PRIORIDAD: RUTA > COOKIE                               │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  1. Usuario navega a /es → Ruta define locale           │
│  2. LocaleProvider sincroniza cookie con ruta           │
│  3. Usuario cambia idioma con switcher:                 │
│     - Cookie se actualiza instantáneamente              │
│     - Contexto React actualiza UI sin navegación        │
│     - URL se actualiza con history.replaceState()       │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

**Beneficios:**
- ✅ **SEO preservado**: URLs indexables por idioma (`/es`, `/en`)
- ✅ **Cambio instantáneo**: Sin recarga de página ni fetch adicional
- ✅ **hreflang correcto**: Cada idioma tiene su URL canónica
- ✅ **URLs compartibles**: Enlaces mantienen el idioma

---

## 🎭 Eventos vs Puntos de Interés

### El Problema

La API de iUrban distingue entre **eventos** y **puntos de interés** (categorías), usando endpoints diferentes:

| Tipo | Endpoint de Listado | Endpoint de Detalle |
|------|---------------------|---------------------|
| Puntos | `get-home-app-data/emt` → `homePoints[].items` | `get-point-app-details/{id}` |
| Eventos | `get-home-app-data/emt` → `homePoints[].events` | `get-event-app-details/{id}` |

**Importante**: Los IDs pueden colisionar entre eventos y puntos. El ID `12853` existe tanto como evento ("Julia, de Jaume Plensa") como punto ("Centro Comercial Guadalmina").

### Estructura de Datos Diferente

```typescript
// type: "categories" - Puntos de interés
{
  id: 123,
  type: "categories",
  category: { id, icon, name },  // Metadata de la categoría
  items: [...]                    // Los items están aquí
}

// type: "events" - Eventos
{
  id: "EMT",
  type: "events",
  icon: "eventos",               // Metadata dispersa
  events: [...]                  // Los items están en 'events', NO en 'items'
}
```

### Solución Implementada

#### 1. Normalización de Datos (`src/lib/api.ts`)

```typescript
function transformToLightData(data: HomeData): HomeDataLight {
  // Filtrar y ordenar: eventos primero
  const supportedPoints = data.homePoints
    .filter((hp) => hp.type === 'events' || hp.type === 'categories')
    .sort((a, b) => (a.type === 'events' ? -1 : 1));

  return {
    homePoints: supportedPoints.map((homePoint) => {
      if (homePoint.type === 'events') {
        return {
          type: 'events',
          category: {
            name: { es: 'Eventos', en: 'Events' }, // Categoría sintética
          },
          items: homePoint.events.map(item => ({
            ...item,
            itemType: 'event', // Marcar como evento
          })),
        };
      }
      // Para categorías: estructura normal
      return {
        type: homePoint.type,
        category: homePoint.category,
        items: homePoint.items.map(item => ({
          ...item,
          itemType: 'point', // Marcar como punto
        })),
      };
    }),
  };
}
```

#### 2. Campo `itemType` en Cada Item

```typescript
interface PointItemLight {
  id: number;
  itemType: 'point' | 'event'; // Determina qué endpoint usar
  name: LocalizedString;
  image: string;
  // ...
}
```

#### 3. Generación de URLs en `PointCard`

```typescript
const detailPath = point.itemType === 'event'
  ? `/${locale}/event/${point.id}/${slug}`
  : `/${locale}/point/${point.id}/${slug}`;
```

#### 4. Ruta Unificada (`src/app/[locale]/[itemType]/[id]/[slug]/page.tsx`)

```typescript
type ItemType = 'point' | 'event';

async function fetchItemData(itemType: ItemType, id: string) {
  if (itemType === 'event') {
    return fetchEventDetail(id);  // get-event-app-details
  }
  return fetchPointDetail(id);    // get-point-app-details
}

export default async function DetailPage({ params }) {
  const { itemType, id } = await params;
  
  if (!['point', 'event'].includes(itemType)) {
    notFound();
  }
  
  const itemData = await fetchItemData(itemType, id);
  // Renderizar página de detalle unificada
}
```

### Resultado

```
/es/event/12853/julia-de-jaume-plensa  →  fetchEventDetail(12853)  →  "Julia, de Jaume Plensa"
/es/point/12853/centro-comercial       →  fetchPointDetail(12853)  →  "Centro Comercial Guadalmina"
```

Ambas rutas comparten el mismo componente de página, pero llaman a endpoints diferentes según el tipo.

---

## 🔍 SEO

### Implementación

| Aspecto | Solución |
|---------|----------|
| **Meta tags dinámicos** | `generateMetadata()` en cada página |
| **Open Graph** | Título, descripción por página |
| **Canonical URLs** | Configurado en metadata con alternates |
| **hreflang** | URLs alternativas para cada idioma |
| **Structured Data** | JSON-LD para WebSite, TouristAttraction, BreadcrumbList |
| **Robots** | Configurado para indexación completa |
| **Semántica HTML** | h1/h2/h3 correctamente anidados, article, section, aside |
| **URLs amigables** | `/es/point/123/museo-del-prado` en lugar de `/point?id=123` |

---

## ⚡ Estrategia de Performance

### Arquitectura de Rendering

| Página | Estrategia | Revalidación | Primera visita | Siguientes |
|--------|------------|--------------|----------------|------------|
| **Home** (`/es`, `/en`) | SSG + ISR | 60s | Build time | <100ms |
| **Detalle Punto** (`/es/point/...`) | SSR + Cache | 300s (5min) | ~500ms | <100ms |
| **Detalle Evento** (`/es/event/...`) | SSR + Cache | 300s (5min) | ~500ms | <100ms |

#### SSG + ISR para Home (Static Site Generation + Incremental Static Regeneration)

```typescript
// src/app/[locale]/page.tsx

// Revalidar cada 60 segundos
export const revalidate = 60;

// Forzar generación estática
export const dynamic = 'force-static';

// Pre-generar páginas para todos los locales
export async function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}
```

**Flujo:**
```
BUILD TIME:  fetch API (~5s) → generar HTML → /es.html, /en.html
RUNTIME:     servir HTML estático (<100ms)
REVALIDATE:  después de 60s, regenerar en background
```

#### SSR + Cache para Detalle (Puntos y Eventos)

```typescript
// src/app/[locale]/[itemType]/[id]/[slug]/page.tsx
// Ruta unificada para point/ y event/

// Cachear respuesta SSR por 5 minutos
export const revalidate = 300;

// Permitir rutas dinámicas (no pre-generadas)
export const dynamicParams = true;

// Validar tipo y llamar al endpoint correcto
async function fetchItemData(itemType: 'point' | 'event', id: string) {
  if (itemType === 'event') {
    return fetchEventDetail(id);  // get-event-app-details/{id}
  }
  return fetchPointDetail(id);    // get-point-app-details/{id}
}
```

**Flujo:**
```
PRIMERA VISITA:  SSR (~500ms) → cachear HTML
SIGUIENTES:      servir desde cache (<100ms)
REVALIDATE:      después de 5min, regenerar en background
```

### Manejo de API con payload grande

La API de home devuelve ~9MB (supera el límite de 2MB del cache de Next.js). Solución implementada:

```typescript
// src/lib/api.ts

// 1. Fetch sin cache de Next.js
const response = await fetch(url, { cache: 'no-store' });

// 2. Transformar a datos ligeros (~200KB)
function transformToLightData(data: HomeData): HomeDataLight {
  return {
    heroSection: data.heroSection,
    homePoints: data.homePoints.map(point => ({
      id: point.id,
      category: point.category,
      items: point.items.slice(0, 4).map(item => ({
        id: item.id,
        name: item.name,
        image: item.image,
        // Solo campos necesarios para la UI
      })),
    })),
  };
}
```

### Memoización de Componentes

Todos los componentes principales están envueltos en `React.memo()` para evitar re-renders innecesarios:

| Componente | Memoización | Notas |
|------------|-------------|-------|
| `PointCard` | `memo()` | Re-renderiza solo si cambia `point` o `locale` |
| `CategorySection` | `memo()` + `useMemo` | `useMemo` para items virtualizados |
| `AgendaSection` | `memo()` | Estado interno para paginación |
| `HeroSection` | `memo()` | Props estables (datos del servidor) |
| `HomeContent` | `memo()` + `useMemo` | `useMemo` para separar eventos/categorías |
| `DetailContent` | Sin memo | Necesita re-render en cambio de idioma |

```typescript
// Componente memoizado
const PointCard = memo(function PointCard({ point, priority }: Props) {
  const { locale, messages } = useLocale();
  // ...
});
```

**Nota importante**: `DetailContent` NO usa `memo()` porque necesita re-renderizarse cuando el contexto de idioma cambia. Con `memo()`, las props (`itemData`) no cambian y React no re-renderiza.

### Virtualización de Carruseles

Los carruseles de categorías implementan virtualización progresiva para reducir el DOM inicial:

```typescript
// Solo renderizar elementos visibles + buffer
const INITIAL_VISIBLE = 8;
const LOAD_MORE_COUNT = 8;

const [visibleCount, setVisibleCount] = useState(INITIAL_VISIBLE);

// Cargar más al acercarse al final
const checkScrollability = useCallback(() => {
  if (hasMoreItems && scrollLeft > scrollWidth - clientWidth - 600) {
    setVisibleCount(prev => Math.min(prev + LOAD_MORE_COUNT, totalItems));
  }
}, [hasMoreItems, totalItems]);

// Solo renderizar items visibles
const visibleItems = useMemo(() => 
  homePoint.items?.slice(0, visibleCount) || [],
  [homePoint.items, visibleCount]
);
```

**Beneficios:**
- ✅ DOM inicial reducido ~60% por categoría
- ✅ Lazy loading automático al hacer scroll
- ✅ Sin librería externa (implementación nativa)

### Branding Dinámico desde API

La aplicación consume la API de branding (`get-common-app/emt`) para aplicar colores y logos corporativos dinámicamente:

```typescript
// src/app/[locale]/page.tsx
const { appStyle } = await fetchCommonConfig();

// Colores corporativos
const { corpColor1, corpColor2, backgroundColor, logoList } = appStyle;
```

**Propiedades utilizadas:**

| Propiedad | Uso | Componente |
|-----------|-----|------------|
| `backgroundColor` | Fondo del header | `Header.tsx` |
| `corpColor1` | Botones CTA, fondo de eventos | `HeroSection.tsx`, `page.tsx` |
| `corpColor2` | Títulos de categorías | `CategorySection.tsx` |
| `logoList.secondaryLogo` | Logo en el hero | `HeroSection.tsx` |
| `logoList.primaryLogo` | Logo en el header | `Header.tsx` |

**Beneficios:**
- ✅ Cambios de marca sin redespliegue
- ✅ Consistencia con otras plataformas de la marca
- ✅ Flexibilidad para white-label
- ✅ Colores aplicados con `style={{ backgroundColor }}` para evitar clases CSS dinámicas

---

## 🎨 Componentes de UI

### Agenda de Eventos (`AgendaSection.tsx`)

Calendario interactivo que muestra eventos disponibles por día:

| Característica | Implementación |
|----------------|----------------|
| **Calendario mensual** | Grid de 7 columnas con días del mes actual |
| **Indicador de eventos** | Punto de color (`corpColor1`) en días con eventos |
| **Selección de día** | Click para filtrar eventos del día seleccionado |
| **Días pasados deshabilitados** | `opacity-40` y `cursor-not-allowed` |
| **Paginación de eventos** | 6 eventos iniciales + botón "Ver más" |
| **Scroll optimizado** | Reset automático al cambiar de día |

```typescript
// Eventos separados para la agenda (sin límite de 8)
agendaEvents: PointItemLight[]; // Todos los eventos

// Carrusel de eventos (limitado a 8)
homePoints[0].items: PointItemLight[]; // MAX_ITEMS_PER_CATEGORY = 8
```

**Paginación progresiva:**
- Carga inicial: 6 eventos en el DOM
- Botón "Ver más" dentro del contenedor con scroll
- Reset de scroll y paginación al cambiar de día
- Reduce DOM de ~344KB a ~45KB en carga inicial (~87% menos)

### Carrusel Reutilizable (`Carousel.tsx`)

Componente de carrusel horizontal usado en categorías y galería de detalle:

| Característica | Implementación |
|----------------|----------------|
| **Navegación bidireccional** | Botones izquierda/derecha siempre visibles |
| **Color configurable** | `buttonColor` prop para personalizar |
| **Desactivación visual** | `opacity-40` cuando no se puede navegar |
| **Scroll suave** | `scroll-smooth` con `scrollBy({ behavior: 'smooth' })` |
| **Detección de extremos** | `ResizeObserver` + evento `onScroll` |
| **Callback de fin** | `onNearEnd` para carga progresiva |
| **Centrado automático** | `centered` prop para centrar contenido cuando no hay overflow |

```tsx
// Uso en CategorySection
<Carousel
  buttonColor={accentColor}
  isDarkBackground={isDarkBackground}
  scrollAmount={1200}
  onNearEnd={handleNearEnd} // Carga más items
>
  {items.map((item) => <PointCard key={item.id} {...item} />)}
</Carousel>

// Uso en DetailContent (galería con centrado)
<Carousel
  buttonColor="#0284c7"
  scrollAmount={400}
  ariaLabel="Galería de imágenes"
  centered // Centra imágenes cuando no hay overflow
>
  {images.map((img) => <Image key={img.id} {...img} />)}
</Carousel>
```

**Beneficios de componentizar:**
- ✅ DRY: Lógica de scroll en un solo lugar
- ✅ Consistencia visual entre categorías y galería
- ✅ Fácil mantenimiento y testing
- ✅ Props configurables para diferentes contextos

---

### Headers de Cache HTTP

```typescript
// next.config.ts
async headers() {
  return [
    {
      source: '/:locale(es|en)',
      headers: [{
        key: 'Cache-Control',
        value: 'public, max-age=60, stale-while-revalidate=300',
      }],
    },
    {
      // Tanto /point/ como /event/ usan el mismo cache
      source: '/:locale(es|en)/:itemType(point|event)/:id/:slug',
      headers: [{
        key: 'Cache-Control',
        value: 'public, max-age=120, stale-while-revalidate=600',
      }],
    },
  ];
}
```

### Optimización de Imágenes

```tsx
<Image
  src={point.image}
  alt={`Imagen de ${name}`}
  fill
  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
  priority={isAboveFold}  // Solo para LCP
/>
```

- **next/image**: WebP automático, lazy loading, responsive srcset
- **sizes**: Indica al navegador qué tamaño cargar según viewport
- **priority**: Solo en imágenes above-the-fold para no bloquear

**Nota:** Hay que tener cuidado en entornos productivos con la optimización de imágenes por posibles sobrecostes.

### Iconos con Lucide React

Seleccioné **Lucide React** sobre SVGs inline u otras librerías por su bajo coste en bundle y su facilidad de implementación:

```typescript
// src/components/CategoryIcon.tsx
import { Mountain, Calendar, Landmark, ... } from 'lucide-react';

const iconMap: Record<string, LucideIcon> = {
  'eventos': Calendar,
  'aventura': Mountain,
  'patrimonio': Landmark,
  'restauracion': UtensilsCrossed,
  // ...
};

export default function CategoryIcon({ icon, isDark }) {
  const Icon = iconMap[icon] || MapPin;
  return <Icon className={isDark ? 'text-white' : 'text-sky-600'} />;
}
```

**Ventajas de Lucide:**
- **Tree-shaking**: Solo se incluyen los iconos importados (~1KB por icono)
- **Consistencia**: Todos los iconos tienen el mismo estilo y stroke-width
- **Accesibilidad**: `aria-hidden="true"` automático, semantica correcta
- **Rendimiento**: SVG inline (sin requests adicionales), optimizados
- **TypeScript**: Tipos completos incluidos

### Métricas Objetivo

| Métrica | Objetivo | Técnica |
|---------|----------|---------|
| **LCP** | < 2.5s | SSG, priority en hero |
| **FID** | < 100ms | Minimal JavaScript, SSR |
| **CLS** | < 0.1 | Aspect ratios fijos |
| **TTFB** | < 100ms (cached) | SSG + ISR, Cache headers |

---

## ♿ Accesibilidad

### Implementaciones

- **Skip link**: "Saltar al contenido principal" para navegación por teclado
- **Landmarks ARIA**: `role="banner"`, `aria-label` en navegación
- **Semántica**: `<article>`, `<section>`, `<aside>`, `<nav>`, `<main>`
- **Alt texts**: Descriptivos con interpolación de nombre
- **Focus visible**: `focus-visible:ring-4` en todos los elementos interactivos
- **Color contrast**: Ratios de contraste respetados en su mayoría
- **Labels accesibles**: `aria-label` en botones de icono
- **Responsive**: Diseño mobile-first, touch targets de 44px mínimo

### Navegación por Teclado

- `Tab`: Navega entre elementos interactivos
- `Enter/Space`: Activa enlaces y botones
- Skip link visible en focus para saltar header

---

## 🧪 Testing y Calidad

### Scripts de Testing

```bash
npm run lint           # ESLint con config de Next.js
npm test               # Tests unitarios (Jest)
npm run test:watch     # Tests unitarios en modo watch
npm run test:coverage  # Tests con cobertura de código
npm run test:e2e       # Tests E2E (Playwright, todos los navegadores)
npm run test:e2e:ui    # Tests E2E con interfaz gráfica
npm run test:e2e:headed # Tests E2E en modo visible
npm run test:all       # Ejecutar todos los tests
```

### Tests Unitarios (Jest + React Testing Library)

Ubicación: `src/__tests__/`

```
src/__tests__/
├── components/
│   ├── PointCard.test.tsx    # Tests del componente PointCard
│   └── Carousel.test.tsx     # Tests del componente Carousel
├── i18n/
│   └── config.test.ts        # Tests de getLocalizedText y config i18n
└── lib/
```

**Configuración:**
- `jest.config.ts` - Configuración de Jest con Next.js
- `jest.setup.tsx` - Setup con mocks (ResizeObserver, next/image, next/navigation)

**Cobertura de tests unitarios:**

| Módulo | Tests | Descripción |
|--------|-------|-------------|
| `getLocalizedText` | 6 | Fallbacks, null handling, locale switching |
| `PointCard` | 8 | Renderizado, favoritos, enlaces, lazy loading |
| `Carousel` | 6 | Navegación, accesibilidad, centrado |

### Tests E2E (Playwright)

Ubicación: `e2e/`

```
e2e/
├── home.spec.ts       # Tests de la página principal
├── detail.spec.ts     # Tests de la página de detalle
└── carousel.spec.ts   # Tests del carrusel
```

**Configuración:** `playwright.config.ts`

**Navegadores configurados:**
- Chromium (Desktop Chrome) - El testeado durante las pruebas
- Firefox (Desktop Firefox)
- WebKit (Desktop Safari)
- Mobile Chrome (Pixel 5)
- Mobile Safari (iPhone 12)

**Cobertura de tests E2E:**

| Suite | Tests | Descripción |
|-------|-------|-------------|
| Home Page | 5 | Hero, categorías, navegación |
| Language Switching | 3 | Cambio ES↔EN, título dinámico |
| Accessibility | 2 | Skip link, jerarquía de headings |
| Detail Page | 5 | Detalle, galería, back link, SEO |
| Carousel | 5 | Navegación, scroll, hover, mobile |

**Total: 23 tests unitarios + 20 tests E2E = 43 tests**

#### Ejecutar tests E2E en un navegador específico

```bash
npm run test:e2e -- --project=chromium
npm run test:e2e -- --project=firefox
npm run test:e2e -- --project=webkit
```

### Linting

Configuración en `eslint.config.mjs` con reglas de Next.js y TypeScript.

---

## 📝 Posibles mejoras futuras (Backlog)

1. **Búsqueda funcional**: Implementar filtrado de puntos desde el hero
2. **Mapa interactivo**: Mostrar ubicaciones con Leaflet o Mapbox
3. **PWA**: Service worker para funcionamiento offline
5. **Favoritos**: Guardar puntos en localStorage o sesión de usuario
6. **Filtros avanzados**: Por categoría, precio, duración
7. **Compartir en RRSS**: Botones de share nativos
8. **Lazy loading de secciones**: Intersection Observer para cargar más puntos
9. **Dark mode**: Toggle de tema claro/oscuro
10. **Analytics**: Integración con Google Analytics 4
11. **Reviews**: Sistema de valoraciones (requiere backend)
12. **Rutas turísticas**: Itinerarios recomendados

---

## 📊 Decisiones y Trade-offs

| Decisión | Beneficio | Trade-off |
|----------|-----------|-----------|
| **SSG + ISR para Home** | TTFB <100ms, SEO óptimo | Datos pueden estar hasta 60s desactualizados |
| **SSR + Cache para Detalle** | Sin pre-generar cientos de páginas | Primera visita ~500ms |
| **Ruta unificada `[itemType]`** | Código compartido para puntos y eventos | Validación extra del tipo en runtime |
| **Campo `itemType` en items** | Determina endpoint correcto en detalle | Añade un campo extra a cada item |
| **Normalizar eventos a estructura de categorías** | Código de renderizado uniforme | Lógica de transformación adicional |
| **Sin loading.tsx** | HTML completo para crawlers | Sin skeleton durante SSR (pantalla blanca) |
| **Sin next-intl** | Menos dependencias, bundle más pequeño | Menos features (plurales, formateo de fechas) |
| **Tailwind CSS** | DX excelente, CSS mínimo | Clases verbosas en JSX |
| **JSON-LD manual** | Control total, sin overhead | Más código a mantener |
| **Agenda con eventos separados** | Todos los eventos en calendario, carrusel limitado | Campo `agendaEvents` adicional |
| **Paginación en Agenda (6 eventos)** | DOM inicial ~87% menor, mejor rendimiento | Requiere interacción para ver más |
| **Botones de carrusel siempre visibles** | Mejor discoverability | Ocupa espacio visual permanente |
| **Virtualización de carruseles (8 items)** | DOM reducido ~60%, carga progresiva | Elementos adicionales cargan con delay |
| **Memoización con React.memo** | Evita re-renders innecesarios | Overhead de comparación shallow |
| **i18n híbrido (ruta + cookie)** | SEO + cambio instantáneo | Lógica de sincronización adicional |
| **LocaleContext sin localStorage** | SSR compatible, sin hydration mismatch | Cookie tiene límite de tamaño, aunque no preocupa en este caso |
| **history.replaceState para URL** | Más rápido que router.replace | URL no dispara navegación Next.js |
| **DetailContent sin memo()** | Re-render garantizado en cambio idioma | Pequeño overhead por render extra |
| **Jest + RTL para tests unitarios** | Integración nativa con Next.js, ecosystem maduro | Configuración inicial más verbosa que Vitest |
| **Playwright para E2E** | Multi-navegador, recomendado por Next.js, muy rápido | Binarios de navegadores (~250MB) |

---

## 🔧 Configuración Adicional

### Configuración de Imágenes Externas

```typescript
// next.config.ts
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cicerone.cms-iurban.com',
        pathname: '/uploads/**',
      },
    ],
  },
};
```

---