import { fetchCommonConfig } from '@/lib/api';
import HeaderClient from './HeaderClient';

/**
 * Componente de encabezado que obtiene el branding y pasa al cliente.
 */
export default async function Header() {
  const config = await fetchCommonConfig();
  const { appStyle } = config;

  return (
    <HeaderClient
      backgroundColor={appStyle.backgroundColor}
      logoUrl={appStyle.logo?.value || ''}
    />
  );
}
