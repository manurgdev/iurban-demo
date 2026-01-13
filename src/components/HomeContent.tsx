'use client';

import { memo, useMemo } from 'react';
import { HeroSection as HeroSectionType, HomePointLight, PointItemLight } from '@/types/api';
import { useLocale } from '@/context/LocaleContext';
import HeroSection from './HeroSection';
import CategorySection from './CategorySection';
import AgendaSection from './AgendaSection';
import EmptyState from './EmptyState';

interface HomeContentProps {
  heroSection: HeroSectionType;
  homePoints: HomePointLight[];
  agendaEvents: PointItemLight[];
  corpColor1: string;
  corpColor2: string;
  heroLogo?: string;
}

/**
 * Componente de contenido principal de la home.
 */
const HomeContent = memo(function HomeContent({
  heroSection,
  homePoints,
  agendaEvents,
  corpColor1,
  corpColor2,
  heroLogo,
}: HomeContentProps) {
  const { messages } = useLocale();

  const hasPoints = homePoints && homePoints.length > 0;

  const { eventsSection, categoriesSections } = useMemo(() => ({
    eventsSection: homePoints.find((hp) => hp.type === 'events'),
    categoriesSections: homePoints.filter((hp) => hp.type !== 'events'),
  }), [homePoints]);

  return (
    <>
      <HeroSection data={heroSection} accentColor={corpColor1} logo={heroLogo} />

      {hasPoints ? (
        <div>
          <h2 className="sr-only">
            {messages.home?.pointsOfInterest || 'Puntos de Interés'}
          </h2>

          {eventsSection && (
            <div
              className="py-8"
              style={{ backgroundColor: corpColor1 }}
            >
              <div className="container mx-auto px-4">
                <CategorySection
                  homePoint={eventsSection}
                  isFirst={true}
                  isDarkBackground={true}
                />
              </div>
            </div>
          )}

          {agendaEvents.length > 0 && (
            <AgendaSection
              events={agendaEvents}
              accentColor={corpColor2}
            />
          )}

          {categoriesSections.map((homePoint, index) => {
            const uniqueKey = `${index}-${homePoint.id}`;
            
            return (
              <div
                key={uniqueKey}
                className="py-8 bg-gray-100"
              >
                <div className="container mx-auto px-4">
                  <CategorySection
                    homePoint={homePoint}
                    isFirst={false}
                    isDarkBackground={false}
                    accentColor={corpColor2}
                  />
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="container mx-auto px-4 py-12">
          <EmptyState
            title={messages.common?.noResults || 'No hay resultados'}
            message={
              messages.common?.noPointsOfInterestResults || 'No se encontraron puntos de interés para mostrar.'
            }
          />
        </div>
      )}
    </>
  );
});

export default HomeContent;
