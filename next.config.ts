import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // Configuración de imágenes para permitir dominios externos
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cicerone.cms-iurban.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'cms-iurban.com',
        pathname: '/uploads/**',
      },
      {
        protocol: 'https',
        hostname: 'estaticos.esmadrid.com',
        pathname: '/**',
      },
    ],
  },

  async headers() {
    return [
      {
        // Home pages (es, en)
        source: '/:locale(es|en)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=60, stale-while-revalidate=300',
          },
        ],
      },
      {
        // Detail pages (tanto eventos como puntos)
        source: '/:locale(es|en)/:itemType(point|event)/:id/:slug',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=120, stale-while-revalidate=600',
          },
        ],
      },
    ];
  },
};

export default nextConfig;
