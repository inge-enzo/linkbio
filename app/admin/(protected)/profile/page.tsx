import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { ProfileForm } from '@/components/admin/ProfileForm';

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

      <ProfileForm
        initialData={{
          name: profile?.name || '',
          description: profile?.description,
          photoUrl: profile?.photoUrl,
        }}
      />
    </div>
  );
}
