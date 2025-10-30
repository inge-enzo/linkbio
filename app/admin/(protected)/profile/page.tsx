import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { User, Mail, Camera } from 'lucide-react';
import Image from 'next/image';

async function getUserProfile(userId: string) {
  const profile = await prisma.profile.findUnique({
    where: { userId },
  });

  return profile;
}

export default async function ProfilePage() {
  const session = await auth();
  const profile = await getUserProfile(session!.user.id);

  return (
    <div>
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Mi Perfil</h2>
        <p className="text-gray-600">
          Gestiona tu información personal y foto de perfil
        </p>
      </div>

      <div className="max-w-4xl">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
          {/* Profile Photo */}
          <div className="flex items-center gap-6 mb-8 pb-8 border-b border-gray-200">
            <div className="relative">
              {profile?.photoUrl ? (
                <div className="relative w-24 h-24">
                  <Image
                    src={profile.photoUrl}
                    alt={profile.name}
                    fill
                    className="rounded-full object-cover border-4 border-gray-100"
                  />
                </div>
              ) : (
                <div className="w-24 h-24 rounded-full bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center">
                  <User className="w-12 h-12 text-white" />
                </div>
              )}
              <button className="absolute bottom-0 right-0 bg-white rounded-full p-2 shadow-lg border border-gray-200 hover:bg-gray-50">
                <Camera className="w-4 h-4 text-gray-600" />
              </button>
            </div>
            <div>
              <h3 className="text-xl font-semibold text-gray-800 mb-1">
                {profile?.name || 'Sin nombre'}
              </h3>
              <p className="text-gray-600 flex items-center gap-2">
                <Mail className="w-4 h-4" />
                {session?.user.email}
              </p>
            </div>
          </div>

          {/* Profile Info */}
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nombre
              </label>
              <input
                type="text"
                defaultValue={profile?.name || ''}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                placeholder="Tu nombre"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Descripción
              </label>
              <textarea
                defaultValue={profile?.description || ''}
                rows={4}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                placeholder="Cuéntale a tus visitantes sobre ti..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                URL de Foto
              </label>
              <input
                type="url"
                defaultValue={profile?.photoUrl || ''}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                placeholder="https://ejemplo.com/foto.jpg"
              />
            </div>

            <div className="flex gap-3 pt-4">
              <button className="px-6 py-3 bg-primary-600 text-white rounded-lg font-semibold hover:bg-primary-700 transition-colors">
                Guardar Cambios
              </button>
              <button className="px-6 py-3 bg-gray-100 text-gray-700 rounded-lg font-semibold hover:bg-gray-200 transition-colors">
                Cancelar
              </button>
            </div>
          </div>
        </div>

        {/* Coming Soon Badge */}
        <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
          <p className="text-blue-800 text-sm">
            🚧 <strong>Próximamente:</strong> Funcionalidad de edición completa con validación y carga de imágenes.
          </p>
        </div>
      </div>
    </div>
  );
}
