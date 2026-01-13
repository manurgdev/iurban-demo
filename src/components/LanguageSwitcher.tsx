'use client';

import { useState, useRef, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { locales } from '@/i18n/config';
import { Locale } from '@/types/api';
import { useLocale } from '@/context/LocaleContext';

// Defino las banderas como emojis por agilidad en la demo
const localeFlags: Record<Locale, { flag: string; name: string }> = {
  es: { flag: '🇪🇸', name: 'Español' },
  en: { flag: '🇬🇧', name: 'English' },
};

/**
 * Componente dropdown para cambiar de idioma.
 */
export default function LanguageSwitcher() {
  const { locale, setLocale, messages } = useLocale();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    function handleEscape(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        setIsOpen(false);
      }
    }

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, []);

  const getPathWithoutLocale = () => {
    const segments = pathname.split('/').filter(Boolean);
    if (locales.includes(segments[0] as Locale)) {
      return '/' + segments.slice(1).join('/');
    }
    return pathname;
  };

  const pathWithoutLocale = getPathWithoutLocale();
  const currentLocale = localeFlags[locale];

  const handleLocaleChange = (newLocale: Locale) => {
    if (newLocale === locale) {
      setIsOpen(false);
      return;
    }

    setIsOpen(false);

    setLocale(newLocale);

    const newPath = `/${newLocale}${pathWithoutLocale}`;
    window.history.replaceState(null, '', newPath);
  };

  return (
    <div
      ref={dropdownRef}
      className="relative"
      role="navigation"
      aria-label={messages.accessibility?.languageSelector || 'Selector de idioma'}
    >
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-white cursor-pointer"
        aria-expanded={isOpen}
        aria-haspopup="listbox"
        aria-label={`${currentLocale.name}. ${messages.accessibility?.languageSelector || 'Cambiar idioma'}`}
      >
        <span className="text-2xl" role="img" aria-hidden="true">
          {currentLocale.flag}
        </span>
        <svg
          className={`w-4 h-4 text-white transition-transform ${isOpen ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <div
          className="absolute right-0 mt-2 py-2 w-40 bg-white rounded-xl shadow-xl z-50 border border-gray-100"
          role="listbox"
          aria-label={messages.accessibility?.languageSelector || 'Idiomas disponibles'}
        >
          {locales.map((loc) => {
            const isActive = loc === locale;
            const { flag, name } = localeFlags[loc];

            return (
              <button
                key={loc}
                onClick={() => handleLocaleChange(loc)}
                className={`
                  w-full flex items-center gap-3 px-4 py-2.5 text-gray-700 hover:bg-gray-50 transition-colors cursor-pointer
                  ${isActive ? 'bg-sky-50 text-sky-700 font-medium' : ''}
                `}
                role="option"
                aria-selected={isActive}
                lang={loc}
              >
                <span className="text-xl" role="img" aria-hidden="true">
                  {flag}
                </span>
                <span>{name}</span>
                {isActive && (
                  <svg
                    className="w-4 h-4 ml-auto text-sky-600"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    aria-hidden="true"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                )}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
