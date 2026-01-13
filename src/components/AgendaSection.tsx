'use client';

import { useState, useMemo, useRef, memo } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Calendar, MapPin } from 'lucide-react';
import { PointItemLight, Locale } from '@/types/api';
import { getLocalizedText } from '@/i18n/config';
import { useLocale } from '@/context/LocaleContext';

interface AgendaSectionProps {
  events: PointItemLight[];
  accentColor?: string;
}

/**
 * Obtiene los días del mes actual en formato de calendario.
 */
function getCalendarDays(year: number, month: number) {
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const daysInMonth = lastDay.getDate();
  const startingDay = firstDay.getDay();

  // Ajusto el primer día de la semana para que empiece en lunes (0 = lunes)
  const adjustedStartingDay = startingDay === 0 ? 6 : startingDay - 1;

  const days: (number | null)[] = [];

  // Añado días vacíos antes del primer día del mes
  for (let i = 0; i < adjustedStartingDay; i++) {
    days.push(null);
  }

  // Añado los días del mes
  for (let i = 1; i <= daysInMonth; i++) {
    days.push(i);
  }

  return days;
}

/**
 * Obtengo el nombre del mes en español/inglés.
 */
function getMonthName(month: number, locale: Locale): string {
  const months: Record<Locale, string[]> = {
    es: ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'],
    en: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
  };
  return months[locale][month];
}

/**
 * Obtengo los días de la semana abreviados.
 */
function getWeekDays(locale: Locale): string[] {
  return locale === 'es'
    ? ['L', 'M', 'X', 'J', 'V', 'S', 'D']
    : ['M', 'T', 'W', 'T', 'F', 'S', 'S'];
}

/**
 * Verifico si un evento está disponible en una fecha dada.
 */
function isEventAvailableOnDate(event: PointItemLight, date: Date): boolean {
  // Si no tiene fechas, asumo que está siempre disponible
  if (!event.start && !event.end) return true;
  
  const dateOnly = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  
  if (event.start) {
    const startDate = new Date(event.start);
    const startOnly = new Date(startDate.getFullYear(), startDate.getMonth(), startDate.getDate());
    if (dateOnly < startOnly) return false;
  }
  
  if (event.end) {
    const endDate = new Date(event.end);
    const endOnly = new Date(endDate.getFullYear(), endDate.getMonth(), endDate.getDate());
    if (dateOnly > endOnly) return false;
  }
  
  return true;
}

/**
 * Obtengo los días del mes que tienen eventos disponibles.
 */
function getDaysWithEvents(events: PointItemLight[], year: number, month: number): Set<number> {
  const daysWithEvents = new Set<number>();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  
  for (let day = 1; day <= daysInMonth; day++) {
    const date = new Date(year, month, day);
    const hasEvents = events.some(event => isEventAvailableOnDate(event, date));
    if (hasEvents) {
      daysWithEvents.add(day);
    }
  }
  
  return daysWithEvents;
}

// Defino el número de eventos a mostrar por "página" en el scroll de la agenda
const EVENTS_PER_PAGE = 6;

/**
 * Componente de Agenda con calendario y lista de eventos.
 * Podría reducirse la complejidad en siguientes iteraciones.
 * Memoizado para evitar re-renders innecesarios.
 */
const AgendaSection = memo(function AgendaSection({ events, accentColor = '#1e3a5f' }: AgendaSectionProps) {
  const { locale, messages } = useLocale();
  const today = new Date();
  const [selectedDay, setSelectedDay] = useState(today.getDate());
  const [visibleCount, setVisibleCount] = useState(EVENTS_PER_PAGE);
  const eventsListRef = useRef<HTMLDivElement>(null);
  const currentMonth = today.getMonth();
  const currentYear = today.getFullYear();

  const calendarDays = getCalendarDays(currentYear, currentMonth);
  const monthName = getMonthName(currentMonth, locale);
  const weekDays = getWeekDays(locale);

  const daysWithEvents = useMemo(
    () => getDaysWithEvents(events, currentYear, currentMonth),
    [events, currentYear, currentMonth]
  );

  const eventsForSelectedDay = useMemo(() => {
    const selectedDate = new Date(currentYear, currentMonth, selectedDay);
    return events.filter(event => isEventAvailableOnDate(event, selectedDate));
  }, [events, currentYear, currentMonth, selectedDay]);

  const visibleEvents = eventsForSelectedDay.slice(0, visibleCount);
  const hasMoreEvents = eventsForSelectedDay.length > visibleCount;
  const remainingCount = eventsForSelectedDay.length - visibleCount;

  const title = messages.agenda?.title || 'Agenda';
  const eventsCountText = messages.agenda?.eventsCountText?.replace('{count}', eventsForSelectedDay.length.toString()) || `Hay ${eventsForSelectedDay.length} eventos disponibles el día`;
  const dayText = messages.agenda?.dayText?.replace('{month}', monthName).replace('{day}', selectedDay.toString()) || `${monthName} ${selectedDay}`;
  const noEventsText = messages.agenda?.noEventsText || 'No hay eventos disponibles este día';

  const handleDayClick = (day: number) => {
    const clickedDate = new Date(currentYear, currentMonth, day);
    const todayDate = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    
    // Solo permito seleccionar días que no han pasado
    if (clickedDate >= todayDate) {
      setSelectedDay(day);
      setVisibleCount(EVENTS_PER_PAGE);
      eventsListRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleLoadMore = () => {
    setVisibleCount(prev => prev + EVENTS_PER_PAGE);
  };

  return (
    <section className="py-8 bg-gray-100" aria-labelledby="agenda-heading">
      <div className="container mx-auto px-4">
        <h2 
          id="agenda-heading" 
          className="text-xl md:text-2xl font-bold mb-6"
          style={{ color: accentColor }}
        >
          {title}
        </h2>

        <div className="bg-white rounded-2xl shadow-lg p-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-1">
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm font-medium text-gray-600 uppercase">
                  {monthName.substring(0, 3)} {currentYear}
                </span>
                <div className="flex gap-1">
                  <button 
                    className="p-1 text-gray-300 cursor-not-allowed"
                    aria-label={messages.agenda?.previousMonth || 'Mes anterior'}
                    disabled
                  >
                    ‹
                  </button>
                  <button 
                    className="p-1 text-gray-300 cursor-not-allowed"
                    aria-label={messages.agenda?.nextMonth || 'Mes siguiente'}
                    disabled
                  >
                    ›
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-7 gap-1 mb-2">
                {weekDays.map((day, index) => (
                  <div 
                    key={index} 
                    className="text-center text-xs font-medium text-gray-500 py-1"
                  >
                    {day}
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-7 gap-1">
                {calendarDays.map((day, index) => {
                  if (day === null) {
                    return <div key={index} className="aspect-square" />;
                  }

                  const isSelected = day === selectedDay;
                  const isWeekend = (index % 7) >= 5;
                  const hasEvents = daysWithEvents.has(day);
                  
                  // Verifico si el día ya pasó
                  const dayDate = new Date(currentYear, currentMonth, day);
                  const todayDate = new Date(today.getFullYear(), today.getMonth(), today.getDate());
                  const isPast = dayDate < todayDate;

                  return (
                    <button
                      key={index}
                      onClick={() => handleDayClick(day)}
                      disabled={isPast}
                      className={`
                        relative aspect-square flex items-center justify-center text-sm rounded-full
                        transition-colors
                        ${isPast 
                          ? 'text-gray-300 cursor-not-allowed' 
                          : isSelected 
                            ? 'text-white font-bold cursor-pointer' 
                            : isWeekend 
                              ? 'text-sky-500 hover:bg-gray-100 cursor-pointer' 
                              : 'text-gray-700 hover:bg-gray-100 cursor-pointer'
                        }
                      `}
                      style={isSelected && !isPast ? { backgroundColor: accentColor } : undefined}
                      aria-label={`${day} ${monthName}${hasEvents ? (messages.agenda?.hasEventsText || ' - has events') : ''}`}
                      aria-pressed={isSelected}
                      aria-disabled={isPast}
                    >
                      {day}
                      {hasEvents && !isSelected && !isPast && (
                        <span 
                          className="absolute bottom-0.5 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full"
                          style={{ backgroundColor: accentColor }}
                          aria-hidden="true"
                        />
                      )}
                    </button>
                  );
                })}
              </div>

              <div className="mt-4 flex items-center gap-4 text-xs text-gray-500">
                <div className="flex items-center gap-1">
                  <span 
                    className="w-2 h-2 rounded-full"
                    style={{ backgroundColor: accentColor }}
                  />
                  <span>{messages.agenda?.hasEventsLegend || 'Con eventos'}</span>
                </div>
              </div>
            </div>

            <div className="lg:col-span-2">
              <p className="text-gray-700 mb-4">
                {eventsCountText}{' '}
                <span 
                  className="inline-block px-2 py-0.5 border rounded text-sm font-medium"
                  style={{ borderColor: accentColor, color: accentColor }}
                >
                  {dayText}
                </span>
              </p>

              {eventsForSelectedDay.length > 0 ? (
                <div 
                  ref={eventsListRef}
                  className="space-y-4 max-h-[400px] overflow-y-auto pr-2"
                >
                  {visibleEvents.map((event) => (
                    <Link
                      key={event.id}
                      href={`/${locale}/event/${event.id}/${getLocalizedText(event.nameSlug, locale, '')}`}
                      className="flex gap-4 p-3 rounded-xl hover:bg-gray-50 transition-colors group"
                    >
                      <div className="relative w-24 h-20 shrink-0 rounded-lg overflow-hidden">
                        {event.image ? (
                          <Image
                            src={event.image}
                            alt=""
                            fill
                            className="object-cover"
                            sizes="96px"
                            loading="lazy"
                          />
                        ) : (
                          <div className="absolute inset-0 bg-gray-200 flex items-center justify-center">
                            <Calendar className="w-6 h-6 text-gray-400" />
                          </div>
                        )}
                      </div>

                      <div className="flex-1 min-w-0">
                        <h3 
                          className="font-semibold text-gray-900 group-hover:underline truncate"
                          style={{ color: accentColor }}
                        >
                          {getLocalizedText(event.name, locale, 'Evento')}
                        </h3>
                        <div className="flex items-center gap-1 text-sm text-gray-500 mt-1">
                          <Calendar className="w-4 h-4" />
                          <span>{event.durationc || (messages.agenda?.availableText || 'Disponible')}</span>
                        </div>
                        {event.location && (
                          <div className="flex items-center gap-1 text-sm text-gray-500 mt-0.5">
                            <MapPin className="w-4 h-4" />
                            <span className="truncate">{event.location}</span>
                          </div>
                        )}
                      </div>
                    </Link>
                  ))}

                  {hasMoreEvents && (
                    <button
                      onClick={handleLoadMore}
                      className="w-full py-3 text-sm font-medium rounded-lg border-2 transition-colors hover:bg-gray-50"
                      style={{ borderColor: accentColor, color: accentColor }}
                    >
                      {messages.agenda?.showMoreEventsText?.replace('{count}', remainingCount.toString()) || 'Ver más eventos ({count} restantes)'}
                    </button>
                  )}
                </div>
              ) : (
                <div className="text-center py-12 text-gray-500">
                  <Calendar className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                  <p>{noEventsText}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
});

export default AgendaSection;
