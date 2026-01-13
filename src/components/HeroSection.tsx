'use client';

import { memo } from 'react';
import Image from 'next/image';
import { HeroSection as HeroSectionType } from '@/types/api';
import { getLocalizedText } from '@/i18n/config';
import { useLocale } from '@/context/LocaleContext';

interface HeroSectionProps {
  data: HeroSectionType;
  accentColor?: string;
  logo?: string;
}

function HeroMedia({ type, src }: { type: 'video' | 'image' | undefined, src: string }) {
  if (type === 'video' && src) {
    return (
      <video
        autoPlay
        muted
        loop
        playsInline
        className="absolute inset-0 w-full h-full object-cover"
        aria-hidden="true"
      >
        <source src={src} type="video/mp4" />
      </video>
    );
  }

  if (type === 'image' && src) {
    return (
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${src})` }}
        aria-hidden="true"
      />
    );
  }

  return (
    <div
      className="absolute inset-0 bg-linear-to-br from-sky-600 to-blue-900"
      aria-hidden="true"
    />
  );
}

/**
 * Componente de sección hero con video o imagen de fondo.
 * Uso memo() para evitar re-renders innecesarios.
 */
const HeroSection = memo(function HeroSection({ data, accentColor = '#0284c7', logo }: HeroSectionProps) {
  const { locale, messages } = useLocale();
  
  const heroMedia = data.heroMultimedia?.[0];
  const claim = messages.home?.heroTitle;
  const searchPlaceholder = getLocalizedText(
    data.searchEngine?.placeholder,
    locale,
    messages.home?.searchPlaceholder || '¿Dónde quieres viajar?'
  );
  const ctaText = messages.home?.ctaButton;

  return (
    <section
      className="relative h-[50vh] min-h-[400px] max-h-[550px] flex items-center justify-center overflow-hidden"
      aria-label={messages.accessibility?.heroVideo || 'Sección principal'}
    >
      <HeroMedia type={heroMedia?.type} src={heroMedia?.src || ''} />

      <div className="absolute inset-0 bg-black/40" aria-hidden="true" />

      <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
        {logo && (
          <div className="mb-6">
            <Image
              src={logo}
              alt="Smart Tourism"
              width={80}
              height={80}
              className="mx-auto"
              priority
            />
          </div>
        )}

        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-8 tracking-tight drop-shadow-lg text-balance">
          {claim}
        </h1>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 max-w-2xl mx-auto">
          <div className="relative flex-1 w-full sm:w-auto">
            <input
              type="search"
              placeholder={searchPlaceholder}
              className="w-full sm:min-w-sm min-w-auto px-6 py-4 pr-14 rounded-full bg-white text-gray-800 placeholder-gray-500 shadow-xl focus:outline-none focus:ring-4 focus:ring-sky-400/50 text-base sm:text-lg"
              aria-label={searchPlaceholder}
            />
            <button
              type="button"
              className="absolute right-2 top-1/2 -translate-y-1/2 p-3 rounded-full text-white transition-opacity hover:bg-blue-700! focus:outline-none focus-visible:ring-2 focus-visible:ring-white cursor-pointer"
              style={{ backgroundColor: accentColor }}
              aria-label={messages.common?.search || 'Buscar'}
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </button>
          </div>

          <button
            type="button"
            className="px-6 py-4 text-white hover:bg-blue-700! font-semibold rounded-full shadow-xl transition-opacity focus:outline-none focus-visible:ring-4 focus-visible:ring-white/50 whitespace-nowrap text-sm sm:text-base uppercase tracking-wide cursor-pointer"
            style={{ backgroundColor: accentColor }}
          >
            {ctaText}
          </button>
        </div>
      </div>
    </section>
  );
});

export default HeroSection;
