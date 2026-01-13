'use client';

import { useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { PointDetail } from '@/types/api';
import { getLocalizedText } from '@/i18n/config';
import { useLocale } from '@/context/LocaleContext';
import { Clock } from 'lucide-react';
import Carousel from './Carousel';

interface DetailContentProps {
  itemData: PointDetail;
  accentColor: string;
}

/**
 * Componente de contenido de la página de detalle.
 * Usa contexto de idioma para cambios instantáneos.
 * No uso memo() aquí porque necesita re-renderizar cuando cambia el contexto.
 */
export default function DetailContent({ itemData, accentColor }: DetailContentProps) {
  const { locale, messages } = useLocale();

  const name = getLocalizedText(itemData.name, locale, 'Punto de interés');
  const description = getLocalizedText(itemData.description, locale, '');

  useEffect(() => {
    document.title = `${name} | Madrid Turismo`;
  }, [name]);

  const galleryImages = itemData.multimedia || [];

  return (
    <article className="pb-12 bg-white">
      <header className="bg-white border-b border-gray-100 sticky top-0 z-20">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link
              href={`/${locale}`}
              className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 rounded-lg p-1 -ml-1"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              <span className="sr-only">{messages.detail?.backToHome || 'Volver'}</span>
            </Link>

            <div className="flex items-center gap-3 flex-1 justify-center">
              <h1 className="text-xl md:text-2xl font-bold text-gray-900">{name}</h1>
              {itemData.durationc && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-gray-100 text-gray-700 text-sm font-medium rounded-full">
                  <Clock className="w-4 h-4" aria-hidden="true" />
                  {itemData.durationc}
                </span>
              )}
            </div>

            <div className="w-6" />
          </div>
        </div>
      </header>

      {galleryImages.length > 0 && (
        <section className="py-6 bg-white" aria-label={messages.detail?.gallery || 'Galería'}>
          <div className="container mx-auto px-4">
            <Carousel
              buttonColor={accentColor || '#0284c7'}
              scrollAmount={800}
              ariaLabel={messages.detail?.gallery || 'Galería de imágenes'}
              centered
            >
              {galleryImages.map((media, index) => (
                <div
                  key={media.name || index}
                  className="shrink-0 w-[300px] md:w-[400px] aspect-4/3 relative rounded-xl overflow-hidden bg-gray-100 shadow-sm"
                >
                  <Image
                    src={media.name}
                    alt={`${name} - ${messages.detail?.image || 'Imagen'} ${index + 1}`}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 300px, 400px"
                    priority={index === 0}
                    loading={index === 0 ? undefined : 'lazy'}
                  />
                </div>
              ))}
            </Carousel>
          </div>
        </section>
      )}

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <section aria-labelledby="description-heading">
              <h2 id="description-heading" className="text-2xl font-bold text-gray-900 mb-4">
                {messages.detail?.description || 'Descripción'}
              </h2>
              <div
                className="prose prose-lg max-w-none text-gray-700 prose-headings:text-gray-900 prose-a:text-sky-600"
                dangerouslySetInnerHTML={{ __html: description }}
              />
            </section>
          </div>

          <aside className="lg:col-span-1">
            <div className="bg-gray-50 rounded-2xl p-6 sticky top-24">
              {itemData.location && (
                <div className="mb-6">
                  <h3 className="text-lg font-bold text-gray-900 mb-2">
                    {messages.detail?.location || 'Dirección'}
                  </h3>
                  <p className="text-gray-700">{itemData.location}</p>
                </div>
              )}

              {itemData.opening_times && itemData.opening_times.length > 0 && (
                <div className="mb-6">
                  <h3 className="text-lg font-bold text-gray-900 mb-2">
                    {messages.detail?.schedule || 'Horario'}
                  </h3>
                  <ul className="space-y-1 text-sm">
                    {itemData.opening_times.map((schedule, index) => (
                      <li key={index} className="flex justify-between gap-2">
                        <span className="text-gray-600">{schedule.day}:</span>
                        <span className="text-gray-900 font-medium">
                          {schedule.time?.join(' - ') || messages.detail?.closed || 'Cerrado'}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {itemData.price && (
                <div className="mb-6">
                  <h3 className="text-lg font-bold text-gray-900 mb-2">
                    {messages.detail?.price || 'Precio'}
                  </h3>
                  <p
                    className="text-gray-700"
                    dangerouslySetInnerHTML={{
                      __html: itemData.price || 'N/A',
                    }}
                  />
                </div>
              )}
            </div>
          </aside>
        </div>
      </div>
    </article>
  );
}
