'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useLocale } from '@/context/LocaleContext';
import LanguageSwitcher from './LanguageSwitcher';

interface HeaderClientProps {
  backgroundColor: string;
  logoUrl: string;
}

/**
 * Componente de encabezado que usa el contexto de idioma.
 */
export default function HeaderClient({ backgroundColor, logoUrl }: HeaderClientProps) {
  const { locale, messages } = useLocale();

  return (
    <header
      className="sticky top-0 z-50 shadow-md"
      style={{ backgroundColor }}
      role="banner"
    >
      <nav
        className="container mx-auto px-4 py-1 flex items-center justify-between"
        aria-label={messages.accessibility?.mainNavigation || 'Navegación principal'}
      >
        <Link
          href={`/${locale}`}
          className="flex items-center gap-3 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-transparent rounded-lg"
          aria-label={messages.header?.home || 'Inicio'}
        >
          {logoUrl && (
            <Image
              src={logoUrl}
              alt=""
              width={48}
              height={48}
              className="h-10 w-auto"
              priority
            />
          )}
        </Link>

        <LanguageSwitcher />
      </nav>
    </header>
  );
}
