import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // Hash password
  const hashedPassword = await bcrypt.hash('admin123', 10);

  // Create user
  const user = await prisma.user.upsert({
    where: { email: 'admin@linkbio.com' },
    update: {},
    create: {
      email: 'admin@linkbio.com',
      password: hashedPassword,
    },
  });

  console.log('✅ User created:', user.email);

  // Create profile
  const profile = await prisma.profile.upsert({
    where: { userId: user.id },
    update: {},
    create: {
      userId: user.id,
      name: 'Admin User',
      description: 'Bienvenido a mi página de enlaces',
      photoUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Admin',
    },
  });

  console.log('✅ Profile created:', profile.name);

  // Create social links
  const socialLinks = await Promise.all([
    prisma.socialLink.create({
      data: {
        userId: user.id,
        platform: 'Instagram',
        url: 'https://instagram.com',
        order: 1,
      },
    }),
    prisma.socialLink.create({
      data: {
        userId: user.id,
        platform: 'Twitter',
        url: 'https://twitter.com',
        order: 2,
      },
    }),
    prisma.socialLink.create({
      data: {
        userId: user.id,
        platform: 'LinkedIn',
        url: 'https://linkedin.com',
        order: 3,
      },
    }),
  ]);

  console.log('✅ Social links created:', socialLinks.length);

  // Create sample products
  const products = await Promise.all([
    prisma.product.create({
      data: {
        userId: user.id,
        name: 'Producto Ejemplo 1',
        description: 'Este es un producto de ejemplo',
        price: 29.99,
        link: 'https://example.com/product1',
        imageUrl: 'https://picsum.photos/seed/product1/400/400',
      },
    }),
    prisma.product.create({
      data: {
        userId: user.id,
        name: 'Producto Ejemplo 2',
        description: 'Otro producto increíble',
        price: 49.99,
        link: 'https://example.com/product2',
        imageUrl: 'https://picsum.photos/seed/product2/400/400',
      },
    }),
  ]);

  console.log('✅ Products created:', products.length);

  // Create sample contents
  const contents = await Promise.all([
    prisma.content.create({
      data: {
        userId: user.id,
        name: 'Mi Blog',
        description: 'Lee mis últimos artículos',
        link: 'https://example.com/blog',
      },
    }),
    prisma.content.create({
      data: {
        userId: user.id,
        name: 'Portfolio',
        description: 'Mira mis proyectos',
        link: 'https://example.com/portfolio',
      },
    }),
    prisma.content.create({
      data: {
        userId: user.id,
        name: 'Newsletter',
        description: 'Suscríbete a mi newsletter',
        link: 'https://example.com/newsletter',
      },
    }),
  ]);

  console.log('✅ Contents created:', contents.length);

  console.log('\n🎉 Seeding completed successfully!');
  console.log('\n📧 Login credentials:');
  console.log('   Email: admin@linkbio.com');
  console.log('   Password: admin123');
  console.log('\n🔗 Profile URL: http://localhost:3000/admin');
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error('❌ Error seeding database:', e);
    await prisma.$disconnect();
    process.exit(1);
  });
