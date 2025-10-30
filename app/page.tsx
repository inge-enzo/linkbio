import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-500 to-primary-700">
      <div className="text-center text-white">
        <h1 className="text-6xl font-bold mb-4 animate-fade-in">
          Link in Bio
        </h1>
        <p className="text-xl mb-8 animate-slide-up">
          Tu página de enlaces personalizada
        </p>
        <div className="space-x-4 animate-slide-up">
          <Link
            href="/admin/login"
            className="inline-block bg-white text-primary-600 px-8 py-3 rounded-full font-semibold hover:bg-gray-100 transition-colors"
          >
            Iniciar Sesión
          </Link>
        </div>
      </div>
    </div>
  );
}
