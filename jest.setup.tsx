import React from 'react';
import '@testing-library/jest-dom';

// Mock de ResizeObserver (no disponible en jsdom)
global.ResizeObserver = class ResizeObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
};

// Mock de next/navigation
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
    prefetch: jest.fn(),
    back: jest.fn(),
  }),
  usePathname: () => '/es',
  useSearchParams: () => new URLSearchParams(),
}));

// Mock de next/image - Filtramos las props que no son válidas para img nativo
jest.mock('next/image', () => ({
  __esModule: true,
  default: ({ src, alt, priority, fill, loading, ...rest }: {
    src: string;
    alt: string;
    priority?: boolean;
    fill?: boolean;
    loading?: 'lazy' | 'eager';
    [key: string]: unknown;
  }) => {
    return (
      <img
        src={src}
        alt={alt}
        loading={loading}
        data-priority={priority ? 'true' : 'false'}
        data-fill={fill ? 'true' : 'false'}
        {...rest}
      />
    );
  },
}));
