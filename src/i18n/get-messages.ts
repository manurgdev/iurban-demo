import { Locale } from '@/types/api';

type Messages = Record<string, Record<string, string>>;

const messagesCache: Partial<Record<Locale, Messages>> = {};

// Mensajes importados estáticamente para el provider
import esMessages from '../../messages/es.json';
import enMessages from '../../messages/en.json';

/**
 * Objeto con todos los mensajes para pasar al LocaleProvider.
 */
export const allMessages: Record<Locale, Messages> = {
  es: esMessages,
  en: enMessages,
};

/**
 * Carga los mensajes de traducción para un locale específico.
 * Utiliza caché en memoria para evitar importaciones repetidas.
 */
export async function getMessages(locale: Locale): Promise<Messages> {
  if (messagesCache[locale]) {
    return messagesCache[locale]!;
  }

  let messages: Messages;

  switch (locale) {
    case 'en':
      messages = (await import('../../messages/en.json')).default;
      break;
    case 'es':
    default:
      messages = (await import('../../messages/es.json')).default;
      break;
  }

  messagesCache[locale] = messages;
  return messages;
}

/**
 * Función helper para obtener un mensaje específico.
 * Soporta interpolación básica con {key}.
 */
export function t(
  messages: Messages,
  key: string,
  params?: Record<string, string>
): string {
  const keys = key.split('.');
  let value: unknown = messages;

  for (const k of keys) {
    if (value && typeof value === 'object' && k in value) {
      value = (value as Record<string, unknown>)[k];
    } else {
      return key; // Retorna la key si no encuentra el mensaje
    }
  }

  if (typeof value !== 'string') return key;

  if (params) {
    return value.replace(/\{(\w+)\}/g, (_, paramKey) => params[paramKey] || `{${paramKey}}`);
  }

  return value;
}
