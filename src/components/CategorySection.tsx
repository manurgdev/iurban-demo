'use client';

import { useState, useCallback, memo, useMemo } from 'react';
import { HomePointLight } from '@/types/api';
import { getLocalizedText } from '@/i18n/config';
import { useLocale } from '@/context/LocaleContext';
import PointCard from './PointCard';
import CategoryIcon from './CategoryIcon';
import Carousel from './Carousel';

interface CategorySectionProps {
  homePoint: HomePointLight;
  isFirst?: boolean;
  isDarkBackground?: boolean;
  accentColor?: string;
}

// Defino el número de elementos visibles inicialmente
const INITIAL_VISIBLE = 8;
// Defino el número de elementos a añadir al cargar más
const LOAD_MORE_COUNT = 8;

/**
 * Componente de sección de categoría con carrusel horizontal de puntos.
 * Memoizada para evitar re-renders innecesarios.
 */
const CategorySection = memo(function CategorySection({
  homePoint,
  isFirst = false,
  isDarkBackground = false,
  accentColor,
}: CategorySectionProps) {
  const { locale } = useLocale();
  const [visibleCount, setVisibleCount] = useState(INITIAL_VISIBLE);

  const categoryName = getLocalizedText(
    homePoint.category?.name,
    locale,
    'Categoría'
  );

  const categoryIconSlug = homePoint.category?.icon || 'default';

  const totalItems = homePoint.items?.length || 0;
  const hasMoreItems = visibleCount < totalItems;

  const visibleItems = useMemo(
    () => homePoint.items?.slice(0, visibleCount) || [],
    [homePoint.items, visibleCount]
  );

  const handleNearEnd = useCallback(() => {
    if (hasMoreItems) {
      setVisibleCount((prev) => Math.min(prev + LOAD_MORE_COUNT, totalItems));
    }
  }, [hasMoreItems, totalItems]);

  if (!homePoint.items || homePoint.items.length === 0) {
    return null;
  }

  return (
    <section aria-labelledby={`category-${homePoint.id}`}>
      <div className="flex items-center justify-between mb-4">
        <h2
          id={`category-${homePoint.id}`}
          className="text-xl md:text-2xl font-bold flex items-center gap-2"
          style={{ color: isDarkBackground ? 'white' : accentColor }}
        >
          <CategoryIcon
            icon={categoryIconSlug}
            className="w-6 h-6"
            isDark={isDarkBackground}
          />
          <span>{categoryName}</span>
          <span
            className={isDarkBackground ? 'opacity-80' : ''}
            style={{ color: isDarkBackground ? 'white' : accentColor }}
            aria-hidden="true"
          >
            →
          </span>
        </h2>
      </div>

      <Carousel
        buttonColor={accentColor || '#0284c7'}
        isDarkBackground={isDarkBackground}
        scrollAmount={1200}
        onNearEnd={handleNearEnd}
        className="-mx-4 px-4"
      >
        {visibleItems.map((point, index) => (
          <div key={`${index}-${point.id}`} className="shrink-0 w-[260px] md:w-[280px]">
            <PointCard point={point} priority={isFirst && index < 6} />
          </div>
        ))}
      </Carousel>
    </section>
  );
});

export default CategorySection;
