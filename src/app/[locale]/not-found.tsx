import Link from 'next/link';

export default function NotFound() {
  // No he localizado la página de 404 por ser una demo.
  return (
    <div className="container mx-auto px-4 py-12 text-center min-h-[60vh] flex flex-col items-center justify-center">
      <div className="w-24 h-24 rounded-full bg-gray-100 flex items-center justify-center mb-6">
        <span className="text-4xl" role="img" aria-label="Confundido">
          🔍
        </span>
      </div>

      <h1 className="text-3xl font-bold text-gray-900 mb-4">
        Página no encontrada
      </h1>

      <p className="text-gray-600 max-w-md mb-8">
        Lo sentimos, no pudimos encontrar la página que buscas. Es posible que haya sido movida o eliminada.
      </p>

      <Link
        href="/es"
        className="px-6 py-3 bg-sky-600 hover:bg-sky-700 text-white font-medium rounded-full transition-colors focus:outline-none focus-visible:ring-4 focus-visible:ring-sky-400 focus-visible:ring-offset-2"
      >
        Volver al inicio
      </Link>
    </div>
  );
}
