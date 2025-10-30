import { prisma } from '@/lib/prisma';
import { ProfilePageClient } from '@/components/ProfilePageClient';
import {
  SkeletonProfileHeader,
  SkeletonSocialButtons,
  SkeletonCard,
} from '@/components/SkeletonCard';
import Link from 'next/link';
import { Suspense } from 'react';

async function getDefaultProfile() {
  // Get the first user (admin) as the default profile
  const user = await prisma.user.findFirst({
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

function LoadingState() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-primary-50 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <SkeletonProfileHeader />
        <SkeletonSocialButtons />
        <div className="mb-12">
          <div className="h-8 w-32 bg-gray-200 rounded mb-4 animate-pulse" />
          <div className="h-12 bg-gray-200 rounded-xl mb-6 animate-pulse" />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[1, 2].map((i) => (
              <SkeletonCard key={i} type="product" />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default async function Home() {
  const user = await getDefaultProfile();

  // If no user exists, show welcome page
  if (!user || !user.profile) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-500 to-primary-700">
        <div className="text-center text-white px-4">
          <h1 className="text-5xl md:text-6xl font-bold mb-4 animate-fade-in">
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

  const { profile, socialLinks, products, contents } = user;

  return (
    <Suspense fallback={<LoadingState />}>
      <ProfilePageClient
        userId={user.id}
        profile={{
          name: profile.name,
          description: profile.description,
          photoUrl: profile.photoUrl,
        }}
        socialLinks={socialLinks.map((link) => ({
          id: link.id,
          platform: link.platform,
          url: link.url,
          order: link.order,
        }))}
        products={products.map((product) => ({
          id: product.id,
          name: product.name,
          description: product.description,
          price: product.price,
          imageUrl: product.imageUrl,
          link: product.link,
        }))}
        contents={contents.map((content) => ({
          id: content.id,
          name: content.name,
          description: content.description,
          link: content.link,
        }))}
      />
    </Suspense>
  );
}
