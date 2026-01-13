import { Locale } from '@/types/api';

export const locales: Locale[] = ['es', 'en'];
export const defaultLocale: Locale = 'es';

export const localeNames: Record<Locale, string> = {
  es: 'Español',
  en: 'English',
};

/**
 * Obtiene el texto localizado de un objeto con traducciones.
 * @param obj - Objeto con claves de idioma (es, en, etc.)
 * @param locale - Código de idioma actual
 * @param fallback - Texto de respaldo si no existe la traducción
 */
export function getLocalizedText(
  obj: Record<string, string> | undefined | null,
  locale: Locale,
  fallback: string = ''
): string {
  if (!obj) return fallback;
  return obj[locale] || obj[defaultLocale] || obj['es'] || fallback;
}
