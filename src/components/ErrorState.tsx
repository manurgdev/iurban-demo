'use client';

interface ErrorStateProps {
  message?: string;
  retryLabel?: string;
  onRetry?: () => void;
}

/**
 * Componente de estado de error con opción de reintentar.
 */
export default function ErrorState({
  message = 'Ha ocurrido un error',
  retryLabel = 'Reintentar',
  onRetry,
}: ErrorStateProps) {
  return (
    <div
      className="flex flex-col items-center justify-center min-h-[400px] p-8 text-center"
      role="alert"
    >
      <div className="w-20 h-20 rounded-full bg-red-100 flex items-center justify-center mb-6">
        <svg
          className="w-10 h-10 text-red-600"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
          />
        </svg>
      </div>

      <h2 className="text-xl font-semibold text-gray-900 mb-2">
        ¡Ups! Algo salió mal
      </h2>
      <p className="text-gray-600 max-w-md mb-6">{message}</p>

      {onRetry && (
        <button
          onClick={onRetry}
          className="px-6 py-3 bg-sky-600 hover:bg-sky-700 text-white font-medium rounded-full transition-colors focus:outline-none focus-visible:ring-4 focus-visible:ring-sky-400 focus-visible:ring-offset-2"
        >
          {retryLabel}
        </button>
      )}
    </div>
  );
}
