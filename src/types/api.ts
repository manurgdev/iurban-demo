export interface AppStyle {
  corpColor1: string;
  corpColor2: string;
  backgroundColor: string;
  headerColor: string;
  corpCompl: string;
  logo: {
    type: string;
    value: string;
  };
  logoList: {
    primaryLogo: {
      type: string;
      value: string;
    };
    secondaryLogo: {
      type: string;
      value: string;
    };
  };
}

export interface CommonConfig {
  appId: number;
  location: {
    lat: string;
    lng: string;
    address: string;
    searchRadius: string;
  };
  type: string;
  appStyle: AppStyle;
  lang: {
    mainLanguage: string;
    styleLanguage: string;
    availableLanguages: string[];
    chatbot: string | null;
  };
}

export interface LocalizedString {
  es: string;
  en: string;
  [key: string]: string;
}

export interface HeroSection {
  heroMultimedia: Array<{
    duration?: number;
    src: string;
    type: 'video' | 'image';
  }>;
  headerName: LocalizedString;
  claim: LocalizedString;
  plannerButton: {
    text: LocalizedString;
  };
  searchEngine: {
    placeholder: LocalizedString;
  };
}

export interface PointItem {
  id: number;
  type: string;
  client_id: string[];
  name: LocalizedString;
  image: string;
  url: string | null;
  duration: number;
  durationc: string;
  num_clicks: number;
  coordinates: string;
  nameSlug: LocalizedString;
  subcategories: string[];
  accesibilities: string[];
  price: string;
  price_custom: string | null;
  priceFilter: string | null;
  popularity: number;
  start: string | null;
  end: string | null;
  categories: string[];
  opening_times: Array<{
    day: string;
    time: string[];
  }>;
  offers: unknown[];
  subCatString: string | null;
  location: string;
  labels: string[];
  always_open: number;
}

export interface HomeCategory {
  id: number;
  icon: string;
  nameSlug: LocalizedString;
  name: LocalizedString;
  image: string;
}

export interface HomePoint {
  id: number | string; // Puede ser número o string, aunque lo termino normalizando
  type: string; // "events" | "categories" | "hikings" (este último no usado en la demo)
  icon?: string;
  category?: HomeCategory;
  events?: PointItem[];
  items?: PointItem[];
}

export interface HomeData {
  status: string;
  heroSection: HeroSection;
  recommendedRoutesList: unknown[];
  homePoints: HomePoint[];
}

// Tipos reducidos para la Home (solo campos necesarios para la UI)
export interface PointItemLight {
  id: number;
  itemType: 'point' | 'event'; // Para determinar qué endpoint usar en detalle
  name: LocalizedString;
  image: string;
  nameSlug: LocalizedString;
  location: string;
  price: string;
  durationc: string;
  start: string | null;
  end: string | null;
}

export interface HomePointLight {
  id: number;
  type: string;
  category: HomeCategory; // Normalizado: uso 'category' para ambos casos
  items: PointItemLight[];
}

export interface HomeDataLight {
  status: string;
  heroSection: HeroSection;
  homePoints: HomePointLight[];
  agendaEvents: PointItemLight[];
}

// Detalle de punto
export interface PointDetail {
  id: number;
  type: string;
  name: LocalizedString;
  description: LocalizedString;
  durationc: string;
  duration: number;
  coordinates: string;
  location: string;
  multimedia: Array<{
    name: string;
    type: 'image' | 'video';
  }>;
  opening_times: Array<{
    day: string;
    time: string[];
  }>;
  price: string;
  price_custom: string | null;
  category: Array<{
    id: number;
    icon: string;
    name: LocalizedString;
  }>;
  links: LocalizedString;
  extra_fields: unknown[];
  files: unknown[];
  audioguides: unknown[];
  tags: unknown[];
  accesibility: unknown[];
  offers: unknown | null;
  client_id: string[];
  capacity_limit: number | null;
  start: string | null;
  end: string | null;
  register: boolean;
  speaker: unknown[];
  photo_360: string | null;
  gpx_file: string | null;
  difficulty_level: string | null;
}

export type Locale = 'es' | 'en';
