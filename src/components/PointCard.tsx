'use client';

import { useState, memo } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { PointItemLight } from '@/types/api';
import { getLocalizedText } from '@/i18n/config';
import { useLocale } from '@/context/LocaleContext';

interface PointCardProps {
  point: PointItemLight;
  priority?: boolean;
}

/**
 * Componente de tarjeta de punto de interés.
 */
const PointCard = memo(function PointCard({
  point,
  priority = false,
}: PointCardProps) {
  const { locale, messages } = useLocale();
  const [isFavorite, setIsFavorite] = useState(false);
  const name = getLocalizedText(point.name, locale, 'Punto de interés');
  const slug = getLocalizedText(point.nameSlug, locale, point.id.toString());
  
  const detailPath = point.itemType === 'event'
    ? `/${locale}/event/${point.id}/${slug}`
    : `/${locale}/point/${point.id}/${slug}`;

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsFavorite(!isFavorite);
  };

  return (
    <article className="group relative">
      <Link
        href={detailPath}
        className="block bg-white rounded-xl shadow-md overflow-hidden transition-all duration-300 hover:shadow-xl focus:outline-none focus-visible:ring-4 focus-visible:ring-sky-400 focus-visible:ring-offset-2"
      >
        <div className="relative aspect-4/3 overflow-hidden">
          <div className="absolute inset-0 scale-110 transition-transform duration-300 ease-in-out group-hover:scale-100">
            {point.image ? (
              <Image
                src={point.image}
                alt={messages.accessibility?.pointImage?.replace('{name}', name) || `Imagen de ${name}`}
                fill
                sizes="280px"
                className="object-cover"
                priority={priority}
                loading={priority ? undefined : 'lazy'}
              />
            ) : (
              <div className="absolute inset-0 bg-linear-to-br from-gray-200 to-gray-300 flex items-center justify-center">
                <svg
                  className="w-12 h-12 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                  />
                </svg>
              </div>
            )}
          </div>
        </div>

        <div className="p-3">
          <h3 className="font-semibold text-gray-900 text-base leading-snug line-clamp-2 min-h-11">
            {name}
          </h3>
        </div>
      </Link>

      <button
        onClick={handleFavoriteClick}
        className={`
          absolute top-2 right-2 w-8 h-8 rounded-full bg-white/90 backdrop-blur-sm shadow-md
          flex items-center justify-center transition-all duration-200 cursor-pointer
          hover:scale-110 focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-400
          ${isFavorite ? 'text-red-500' : 'text-gray-400 hover:text-gray-600'}
        `}
        aria-label={isFavorite 
          ? (messages.common?.removeFromFavorites || 'Quitar de favoritos')
          : (messages.common?.addToFavorites || 'Añadir a favoritos')
        }
        aria-pressed={isFavorite}
      >
        <svg
          className="w-5 h-5"
          fill={isFavorite ? 'currentColor' : 'none'}
          stroke="currentColor"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
          />
        </svg>
      </button>
    </article>
  );
});

export default PointCard;
