'use client';

import { useRef, useState, useEffect, useCallback, memo, ReactNode } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface CarouselProps {
  children: ReactNode;
  buttonColor?: string;
  isDarkBackground?: boolean;
  scrollAmount?: number;
  className?: string;
  ariaLabel?: string;
  onNearEnd?: () => void;
  nearEndThreshold?: number;
  centered?: boolean;
}

/**
 * Componente de carrusel horizontal reutilizable.
 */
const Carousel = memo(function Carousel({
  children,
  buttonColor = '#0284c7',
  isDarkBackground = false,
  scrollAmount = 600,
  className = '',
  ariaLabel,
  onNearEnd,
  nearEndThreshold = 600,
  centered = false,
}: CarouselProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const [hasOverflow, setHasOverflow] = useState(true);

  // Verifico si se puede hacer scroll en cada dirección
  const checkScrollability = useCallback(() => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      const canScroll = scrollWidth > clientWidth;
      
      setHasOverflow(canScroll);
      setCanScrollLeft(scrollLeft > 5);
      setCanScrollRight(canScroll && scrollLeft < scrollWidth - clientWidth - 5);

      if (onNearEnd && scrollLeft > scrollWidth - clientWidth - nearEndThreshold) {
        onNearEnd();
      }
    }
  }, [onNearEnd, nearEndThreshold]);

  useEffect(() => {
    checkScrollability();
    const resizeObserver = new ResizeObserver(checkScrollability);
    if (scrollRef.current) {
      resizeObserver.observe(scrollRef.current);
    }
    return () => resizeObserver.disconnect();
  }, [checkScrollability, children]);

  const handleScrollLeft = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
    }
  };

  const handleScrollRight = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  const handleScroll = () => {
    checkScrollability();
  };

  const bgColor = isDarkBackground ? 'white' : buttonColor;
  const iconColor = isDarkBackground ? buttonColor : 'white';

  const shouldCenter = centered && !hasOverflow;

  return (
    <div className={`relative ${className}`} role="region" aria-label={ariaLabel}>
      <div
        ref={scrollRef}
        onScroll={handleScroll}
        className={`flex gap-4 overflow-x-auto scrollbar-hide pb-2 scroll-smooth ${
          shouldCenter ? 'justify-center' : ''
        }`}
        style={{
          scrollbarWidth: 'none',
          msOverflowStyle: 'none',
        }}
      >
        {children}
      </div>

      {hasOverflow && (
        <>
          <button
            onClick={handleScrollLeft}
            disabled={!canScrollLeft}
            className={`
              absolute left-0 top-1/2 -translate-y-1/2 w-10 h-10 
              rounded-lg shadow-lg flex items-center justify-center 
              transition-all z-10
              focus:outline-none focus-visible:ring-2 focus-visible:ring-white/50
              ${canScrollLeft
                ? 'hover:brightness-110 cursor-pointer'
                : 'opacity-40 cursor-not-allowed'
              }
            `}
            style={{
              backgroundColor: bgColor,
              color: iconColor,
            }}
            aria-label="Anterior"
            aria-disabled={!canScrollLeft}
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          <button
            onClick={handleScrollRight}
            disabled={!canScrollRight}
            className={`
              absolute right-0 top-1/2 -translate-y-1/2 w-10 h-10 
              rounded-lg shadow-lg flex items-center justify-center 
              transition-all z-10
              focus:outline-none focus-visible:ring-2 focus-visible:ring-white/50
              ${canScrollRight
                ? 'hover:brightness-110 cursor-pointer'
                : 'opacity-40 cursor-not-allowed'
              }
            `}
            style={{
              backgroundColor: bgColor,
              color: iconColor,
            }}
          aria-label="Siguiente"
          aria-disabled={!canScrollRight}
        >
          <ChevronRight className="w-5 h-5" />
        </button>
        </>
      )}
    </div>
  );
});

export default Carousel;
