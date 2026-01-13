'use client';

import { createContext, useContext, useState, useEffect, useCallback, useRef, ReactNode } from 'react';
import { Locale } from '@/types/api';
import { defaultLocale } from '@/i18n/config';

const LOCALE_COOKIE_NAME = 'NEXT_LOCALE';
const COOKIE_MAX_AGE = 60 * 60 * 24 * 365;

interface LocaleContextType {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  messages: Record<string, Record<string, string>>;
}

const LocaleContext = createContext<LocaleContextType | null>(null);

/**
 * Guarda el idioma en la cookie (en la demo se usa una cookie de ejemplo)
 */
function setLocaleCookie(locale: Locale): void {
  if (typeof document === 'undefined') return;
  document.cookie = `${LOCALE_COOKIE_NAME}=${locale};path=/;max-age=${COOKIE_MAX_AGE};SameSite=Lax`;
}

interface LocaleProviderProps {
  children: ReactNode;
  initialLocale?: Locale;
  initialMessages: Record<string, Record<string, string>>;
  allMessages: Record<Locale, Record<string, Record<string, string>>>;
}

/**
 * Provider que gestiona el idioma de la aplicación.
 * - La RUTA tiene prioridad sobre la cookie al navegar.
 * - El switcher permite cambio instantáneo sin navegación.
 */
export function LocaleProvider({ 
  children, 
  initialLocale,
  initialMessages,
  allMessages,
}: LocaleProviderProps) {
  const [locale, setLocaleState] = useState<Locale>(initialLocale || defaultLocale);
  const [messages, setMessages] = useState(initialMessages);
  
  const prevInitialLocaleRef = useRef(initialLocale);

  // Sincronizar cuando la RUTA cambia (navegación real)
  useEffect(() => {
    if (initialLocale && initialLocale !== prevInitialLocaleRef.current) {
      prevInitialLocaleRef.current = initialLocale;
      setLocaleState(initialLocale);
      setMessages(allMessages[initialLocale]);
      setLocaleCookie(initialLocale);
    }
  }, [initialLocale, allMessages]);

  const setLocale = useCallback((newLocale: Locale) => {
    if (newLocale === locale) return;
    
    setLocaleCookie(newLocale);
    setLocaleState(newLocale);
    setMessages(allMessages[newLocale]);
    
    if (typeof document !== 'undefined') {
      const newMessages = allMessages[newLocale];
      const currentTitle = document.title;
      
      const pathname = window.location.pathname;
      const isHome = pathname === `/${newLocale}` || pathname === `/${newLocale}/` || pathname === `/${locale}` || pathname === `/${locale}/` || pathname === '/';
      
      if (isHome) {
        // Para home: usar el título del nuevo idioma
        document.title = newMessages.home?.title + ' | Madrid Turismo' || 'Madrid Turismo';
        document.head.querySelector('meta[name="description"]')?.setAttribute('content', newMessages.home?.metaDescription || 'Descubre Madrid');
      } else {
        // Para detalle: mantener el nombre del punto, actualizar sufijo si existe
        const suffixPatterns = [' | Madrid Turismo', ' | Madrid Tourism'];
        let baseName = currentTitle;
        
        for (const suffix of suffixPatterns) {
          if (currentTitle.endsWith(suffix)) {
            baseName = currentTitle.replace(suffix, '');
            break;
          }
        }
        
        // El sufijo siempre será "Madrid Turismo"
        document.title = `${baseName} | Madrid Turismo`;
      }
    }
  }, [locale, allMessages]);

  return (
    <LocaleContext.Provider value={{ locale, setLocale, messages }}>
      {children}
    </LocaleContext.Provider>
  );
}

/**
 * Hook para acceder al contexto de idioma
 */
export function useLocale(): LocaleContextType {
  const context = useContext(LocaleContext);
  if (!context) {
    throw new Error('useLocale must be used within a LocaleProvider');
  }
  return context;
}