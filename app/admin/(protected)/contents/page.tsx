import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { Plus, FileText, Eye, ExternalLink } from 'lucide-react';

async function getContents(userId: string) {
  const contents = await prisma.content.findMany({
    where: { userId },
    orderBy: { createdAt: 'desc' },
  });

  return contents;
}

export default async function ContentsPage() {
  const session = await auth();
  const contents = await getContents(session!.user.id);

  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Contenidos</h2>
          <p className="text-gray-600">
            Gestiona tus enlaces de contenido y recursos
          </p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg font-semibold hover:bg-primary-700 transition-colors">
          <Plus className="w-5 h-5" />
          Agregar Contenido
        </button>
      </div>

      {contents.length > 0 ? (
        <div className="max-w-4xl space-y-4">
          {contents.map((content) => (
            <div
              key={content.id}
              className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center">
                      <FileText className="w-5 h-5 text-primary-600" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-800">
                        {content.name}
                      </h3>
                      {content.description && (
                        <p className="text-sm text-gray-600 line-clamp-1">
                          {content.description}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-4 mt-3">
                    <a
                      href={content.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-primary-600 hover:text-primary-700 flex items-center gap-1"
                    >
                      <ExternalLink className="w-4 h-4" />
                      {content.link}
                    </a>
                    <div className="flex items-center gap-1 text-gray-500">
                      <Eye className="w-4 h-4" />
                      <span className="text-sm">{content.views} vistas</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2 ml-4">
                  <button className="px-4 py-2 text-primary-600 hover:bg-primary-50 rounded-lg transition-colors">
                    Editar
                  </button>
                  <button className="px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                    Eliminar
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center max-w-4xl">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <FileText className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-semibold text-gray-800 mb-2">
            No hay contenidos
          </h3>
          <p className="text-gray-600 mb-6">
            Agrega tus primeros enlaces de contenido
          </p>
          <button className="px-6 py-3 bg-primary-600 text-white rounded-lg font-semibold hover:bg-primary-700 transition-colors">
            Agregar Contenido
          </button>
        </div>
      )}

      {/* Coming Soon Badge */}
      <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4 max-w-4xl">
        <p className="text-blue-800 text-sm">
          🚧 <strong>Próximamente:</strong> CRUD completo para contenidos con
          detección automática de tipos de enlace.
        </p>
      </div>
    </div>
  );
}
