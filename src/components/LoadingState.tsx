interface LoadingStateProps {
  message?: string;
}

/**
 * Componente de estado de carga con skeleton y spinner. (En desuso en la demo)
 */
export default function LoadingState({ message = 'Cargando...' }: LoadingStateProps) {
  return (
    <div
      className="flex flex-col items-center justify-center min-h-[400px] p-8"
      role="status"
      aria-live="polite"
    >
      <div className="relative">
        <div className="w-16 h-16 border-4 border-sky-200 rounded-full animate-pulse" />
        <div className="absolute top-0 left-0 w-16 h-16 border-4 border-transparent border-t-sky-600 rounded-full animate-spin" />
      </div>

      <p className="mt-6 text-gray-600 text-lg">{message}</p>

      <div className="mt-8 w-full max-w-4xl">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="bg-white rounded-2xl shadow-md overflow-hidden animate-pulse"
              aria-hidden="true"
            >
              <div className="aspect-4/3 bg-gray-200" />
              <div className="p-4 space-y-3">
                <div className="h-5 bg-gray-200 rounded w-3/4" />
                <div className="h-4 bg-gray-200 rounded w-1/2" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
