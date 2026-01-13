'use client';

import ErrorState from '@/components/ErrorState';

interface ErrorPageProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function ErrorPage({ error, reset }: ErrorPageProps) {
  return (
    <div className="container mx-auto px-4 py-12">
      <ErrorState
        message={error.message || 'Ha ocurrido un error inesperado'}
        onRetry={reset}
      />
    </div>
  );
}
