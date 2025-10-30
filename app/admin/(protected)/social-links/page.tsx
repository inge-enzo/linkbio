import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { SocialLinksManager } from '@/components/admin/SocialLinksManager';

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
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">
          Redes Sociales
        </h2>
        <p className="text-gray-600">
          Gestiona tus enlaces de redes sociales. Los cambios se verán reflejados en tu página pública.
        </p>
      </div>

      <SocialLinksManager initialLinks={socialLinks} />
    </div>
  );
}
