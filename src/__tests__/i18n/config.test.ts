import { getLocalizedText, locales, defaultLocale, localeNames } from '@/i18n/config';

describe('i18n config', () => {
  describe('locales', () => {
    it('should have es and en locales', () => {
      expect(locales).toContain('es');
      expect(locales).toContain('en');
    });

    it('should have es as default locale', () => {
      expect(defaultLocale).toBe('es');
    });
  });

  describe('localeNames', () => {
    it('should have names for all locales', () => {
      expect(localeNames.es).toBe('Español');
      expect(localeNames.en).toBe('English');
    });
  });

  describe('getLocalizedText', () => {
    const translations = {
      es: 'Texto en español',
      en: 'Text in English',
    };

    it('should return text for the current locale', () => {
      expect(getLocalizedText(translations, 'es')).toBe('Texto en español');
      expect(getLocalizedText(translations, 'en')).toBe('Text in English');
    });

    it('should return fallback when object is null', () => {
      expect(getLocalizedText(null, 'es', 'Fallback')).toBe('Fallback');
    });

    it('should return fallback when object is undefined', () => {
      expect(getLocalizedText(undefined, 'es', 'Fallback')).toBe('Fallback');
    });

    it('should return empty string when no fallback provided', () => {
      expect(getLocalizedText(null, 'es')).toBe('');
    });

    it('should fallback to default locale when translation missing', () => {
      const partialTranslations = { es: 'Solo español' };
      expect(getLocalizedText(partialTranslations, 'en')).toBe('Solo español');
    });

    it('should return fallback when no translations available', () => {
      expect(getLocalizedText({}, 'es', 'Fallback')).toBe('Fallback');
    });
  });
});
