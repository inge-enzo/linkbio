import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { Plus, Package, Eye } from 'lucide-react';
import Image from 'next/image';

async function getProducts(userId: string) {
  const products = await prisma.product.findMany({
    where: { userId },
    orderBy: { createdAt: 'desc' },
  });

  return products;
}

export default async function ProductsPage() {
  const session = await auth();
  const products = await getProducts(session!.user.id);

  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Productos</h2>
          <p className="text-gray-600">Gestiona tus productos y servicios</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg font-semibold hover:bg-primary-700 transition-colors">
          <Plus className="w-5 h-5" />
          Agregar Producto
        </button>
      </div>

      {products.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product) => (
            <div
              key={product.id}
              className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow"
            >
              {product.imageUrl && (
                <div className="relative w-full aspect-square bg-gray-100">
                  <Image
                    src={product.imageUrl}
                    alt={product.name}
                    fill
                    className="object-cover"
                  />
                </div>
              )}
              <div className="p-6">
                <h3 className="font-semibold text-gray-800 mb-2">
                  {product.name}
                </h3>
                {product.description && (
                  <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                    {product.description}
                  </p>
                )}
                <div className="flex items-center justify-between mb-4">
                  {product.price !== null && (
                    <span className="text-2xl font-bold text-primary-600">
                      ${product.price.toFixed(2)}
                    </span>
                  )}
                  <div className="flex items-center gap-1 text-gray-500">
                    <Eye className="w-4 h-4" />
                    <span className="text-sm">{product.views} vistas</span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button className="flex-1 px-4 py-2 text-primary-600 hover:bg-primary-50 rounded-lg transition-colors text-sm font-medium">
                    Editar
                  </button>
                  <button className="flex-1 px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors text-sm font-medium">
                    Eliminar
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Package className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-semibold text-gray-800 mb-2">
            No hay productos
          </h3>
          <p className="text-gray-600 mb-6">
            Agrega tus primeros productos o servicios
          </p>
          <button className="px-6 py-3 bg-primary-600 text-white rounded-lg font-semibold hover:bg-primary-700 transition-colors">
            Agregar Producto
          </button>
        </div>
      )}

      {/* Coming Soon Badge */}
      <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4 max-w-4xl">
        <p className="text-blue-800 text-sm">
          🚧 <strong>Próximamente:</strong> CRUD completo para productos con
          carga de imágenes y gestión de precios.
        </p>
      </div>
    </div>
  );
}
