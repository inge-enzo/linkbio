import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { Eye, MousePointerClick, Link as LinkIcon, TrendingUp } from 'lucide-react';
import Link from 'next/link';

async function getDashboardStats(userId: string) {
  const [
    totalViews,
    totalClicks,
    productsCount,
    contentsCount,
    socialLinksCount,
    recentClicks,
  ] = await Promise.all([
    prisma.pageView.count({ where: { userId } }),
    prisma.clickEvent.count({ where: { userId } }),
    prisma.product.count({ where: { userId } }),
    prisma.content.count({ where: { userId } }),
    prisma.socialLink.count({ where: { userId } }),
    prisma.clickEvent.findMany({
      where: { userId },
      orderBy: { timestamp: 'desc' },
      take: 10,
      include: {
        user: {
          include: {
            products: true,
            contents: true,
            socialLinks: true,
          },
        },
      },
    }),
  ]);

  return {
    totalViews,
    totalClicks,
    totalLinks: productsCount + contentsCount + socialLinksCount,
    productsCount,
    contentsCount,
    socialLinksCount,
    recentClicks,
  };
}

export default async function DashboardPage() {
  const session = await auth();
  const stats = await getDashboardStats(session!.user.id);

  return (
    <div>
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Dashboard</h2>
        <p className="text-gray-600">
          Bienvenido de vuelta, aquí está tu resumen de actividad
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <Eye className="w-6 h-6 text-blue-600" />
            </div>
            <TrendingUp className="w-5 h-5 text-green-500" />
          </div>
          <h3 className="text-sm font-medium text-gray-500 mb-1">
            Vistas Totales
          </h3>
          <p className="text-3xl font-bold text-gray-800">
            {stats.totalViews}
          </p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <MousePointerClick className="w-6 h-6 text-purple-600" />
            </div>
            <TrendingUp className="w-5 h-5 text-green-500" />
          </div>
          <h3 className="text-sm font-medium text-gray-500 mb-1">
            Clics Totales
          </h3>
          <p className="text-3xl font-bold text-gray-800">
            {stats.totalClicks}
          </p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <LinkIcon className="w-6 h-6 text-green-600" />
            </div>
          </div>
          <h3 className="text-sm font-medium text-gray-500 mb-1">
            Enlaces Activos
          </h3>
          <p className="text-3xl font-bold text-gray-800">
            {stats.totalLinks}
          </p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-orange-600" />
            </div>
          </div>
          <h3 className="text-sm font-medium text-gray-500 mb-1">
            Tasa de Clics
          </h3>
          <p className="text-3xl font-bold text-gray-800">
            {stats.totalViews > 0
              ? ((stats.totalClicks / stats.totalViews) * 100).toFixed(1)
              : '0'}
            %
          </p>
        </div>
      </div>

      {/* Content Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            Resumen de Contenido
          </h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Productos</span>
              <span className="font-semibold text-gray-800">
                {stats.productsCount}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Contenidos</span>
              <span className="font-semibold text-gray-800">
                {stats.contentsCount}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Redes Sociales</span>
              <span className="font-semibold text-gray-800">
                {stats.socialLinksCount}
              </span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            Actividad Reciente
          </h3>
          {stats.recentClicks.length > 0 ? (
            <div className="space-y-3">
              {stats.recentClicks.slice(0, 5).map((click) => (
                <div
                  key={click.id}
                  className="flex items-center justify-between text-sm"
                >
                  <span className="text-gray-600">
                    Click en {click.itemType}
                  </span>
                  <span className="text-gray-400">
                    {new Date(click.timestamp).toLocaleDateString()}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-sm">
              No hay actividad reciente todavía
            </p>
          )}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-gradient-to-br from-primary-500 to-primary-700 rounded-xl shadow-lg p-8 text-white">
        <h3 className="text-2xl font-bold mb-4">Acciones Rápidas</h3>
        <p className="mb-6 opacity-90">
          Comienza a gestionar tu contenido desde aquí
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Link
            href="/admin/profile"
            className="bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-lg p-4 transition-all hover:scale-105"
          >
            <div className="text-center">
              <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-3">
                <Eye className="w-6 h-6" />
              </div>
              <p className="font-medium">Editar Perfil</p>
            </div>
          </Link>
          <Link
            href="/admin/products"
            className="bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-lg p-4 transition-all hover:scale-105"
          >
            <div className="text-center">
              <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-3">
                <LinkIcon className="w-6 h-6" />
              </div>
              <p className="font-medium">Agregar Producto</p>
            </div>
          </Link>
          <Link
            href="/admin/contents"
            className="bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-lg p-4 transition-all hover:scale-105"
          >
            <div className="text-center">
              <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-3">
                <LinkIcon className="w-6 h-6" />
              </div>
              <p className="font-medium">Agregar Contenido</p>
            </div>
          </Link>
          <Link
            href="/admin/social-links"
            className="bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-lg p-4 transition-all hover:scale-105"
          >
            <div className="text-center">
              <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-3">
                <LinkIcon className="w-6 h-6" />
              </div>
              <p className="font-medium">Gestionar Redes</p>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}
