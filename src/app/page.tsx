import { redirect } from 'next/navigation';
import { defaultLocale } from '@/i18n/config';

/**
 * Página raíz que redirige al locale por defecto.
 * Esto asegura que siempre haya un locale en la URL.
 */
export default function RootPage() {
  redirect(`/${defaultLocale}`);
}
