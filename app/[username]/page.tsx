import { notFound } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import Image from 'next/image';

interface PageProps {
  params: Promise<{
    username: string;
  }>;
}

async function getProfileData(username: string) {
  // Por ahora buscaremos por email como username
  const user = await prisma.user.findFirst({
    where: {
      email: {
        contains: username,
      },
    },
    include: {
      profile: true,
      socialLinks: {
        orderBy: {
          order: 'asc',
        },
      },
      products: {
        orderBy: {
          createdAt: 'desc',
        },
      },
      contents: {
        orderBy: {
          createdAt: 'desc',
        },
      },
    },
  });

  return user;
}

export default async function ProfilePage({ params }: PageProps) {
  const { username } = await params;
  const user = await getProfileData(username);

  if (!user || !user.profile) {
    notFound();
  }

  const { profile, socialLinks, products, contents } = user;

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-500 to-primary-700 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Profile Header */}
        <div className="text-center mb-8 animate-fade-in">
          {profile.photoUrl && (
            <div className="mb-4 flex justify-center">
              <Image
                src={profile.photoUrl}
                alt={profile.name}
                width={120}
                height={120}
                className="rounded-full border-4 border-white shadow-lg"
              />
            </div>
          )}
          <h1 className="text-4xl font-bold text-white mb-2">
            {profile.name}
          </h1>
          {profile.description && (
            <p className="text-white/90 text-lg">{profile.description}</p>
          )}
        </div>

        {/* Social Links */}
        {socialLinks.length > 0 && (
          <div className="flex justify-center gap-4 mb-8 animate-slide-up">
            {socialLinks.map((link) => (
              <a
                key={link.id}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-white/20 hover:bg-white/30 text-white p-3 rounded-full transition-all"
                title={link.platform}
              >
                {link.platform}
              </a>
            ))}
          </div>
        )}

        {/* Products */}
        {products.length > 0 && (
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-white mb-4">Productos</h2>
            <div className="grid grid-cols-1 gap-4">
              {products.map((product) => (
                <a
                  key={product.id}
                  href={product.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-all hover:scale-105"
                >
                  <div className="flex items-center gap-4">
                    {product.imageUrl && (
                      <Image
                        src={product.imageUrl}
                        alt={product.name}
                        width={80}
                        height={80}
                        className="rounded-lg"
                      />
                    )}
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-800 text-lg mb-1">
                        {product.name}
                      </h3>
                      {product.description && (
                        <p className="text-gray-600 text-sm mb-2">
                          {product.description}
                        </p>
                      )}
                      {product.price && (
                        <p className="text-primary-600 font-bold">
                          ${product.price}
                        </p>
                      )}
                    </div>
                  </div>
                </a>
              ))}
            </div>
          </div>
        )}

        {/* Contents */}
        {contents.length > 0 && (
          <div>
            <h2 className="text-2xl font-bold text-white mb-4">Enlaces</h2>
            <div className="space-y-4">
              {contents.map((content) => (
                <a
                  key={content.id}
                  href={content.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-all hover:scale-105"
                >
                  <h3 className="font-semibold text-gray-800 text-lg mb-1">
                    {content.name}
                  </h3>
                  {content.description && (
                    <p className="text-gray-600 text-sm">
                      {content.description}
                    </p>
                  )}
                </a>
              ))}
            </div>
          </div>
        )}

        {/* Empty State */}
        {socialLinks.length === 0 &&
          products.length === 0 &&
          contents.length === 0 && (
            <div className="text-center text-white py-12">
              <p className="text-xl">No hay contenido disponible todavía</p>
            </div>
          )}
      </div>
    </div>
  );
}
