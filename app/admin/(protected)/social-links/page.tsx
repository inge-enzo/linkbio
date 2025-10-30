import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { Plus, Instagram, Youtube, Music, ExternalLink } from 'lucide-react';

async function getSocialLinks(userId: string) {
  const links = await prisma.socialLink.findMany({
    where: { userId },
    orderBy: { order: 'asc' },
  });

  return links;
}

export default async function SocialLinksPage() {
  const session = await auth();
  const socialLinks = await getSocialLinks(session!.user.id);

  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            Redes Sociales
          </h2>
          <p className="text-gray-600">
            Gestiona tus enlaces de redes sociales
          </p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg font-semibold hover:bg-primary-700 transition-colors">
          <Plus className="w-5 h-5" />
          Agregar Red Social
        </button>
      </div>

      <div className="max-w-4xl">
        {socialLinks.length > 0 ? (
          <div className="space-y-4">
            {socialLinks.map((link) => (
              <div
                key={link.id}
                className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-primary-700 rounded-lg flex items-center justify-center">
                      {link.platform === 'Instagram' && (
                        <Instagram className="w-6 h-6 text-white" />
                      )}
                      {link.platform === 'YouTube' && (
                        <Youtube className="w-6 h-6 text-white" />
                      )}
                      {link.platform === 'TikTok' && (
                        <Music className="w-6 h-6 text-white" />
                      )}
                      {!['Instagram', 'YouTube', 'TikTok'].includes(
                        link.platform
                      ) && <ExternalLink className="w-6 h-6 text-white" />}
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-800">
                        {link.platform}
                      </h3>
                      <p className="text-sm text-gray-600">{link.url}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
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
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <ExternalLink className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">
              No hay redes sociales
            </h3>
            <p className="text-gray-600 mb-6">
              Agrega tus primeros enlaces de redes sociales
            </p>
            <button className="px-6 py-3 bg-primary-600 text-white rounded-lg font-semibold hover:bg-primary-700 transition-colors">
              Agregar Red Social
            </button>
          </div>
        )}

        {/* Coming Soon Badge */}
        <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
          <p className="text-blue-800 text-sm">
            🚧 <strong>Próximamente:</strong> CRUD completo para gestionar
            redes sociales con drag & drop para ordenar.
          </p>
        </div>
      </div>
    </div>
  );
}
