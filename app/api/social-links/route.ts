import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { socialLinkSchema } from '@/lib/validations';

// GET - Obtener todos los social links del usuario
export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json({ error: 'No autenticado' }, { status: 401 });
    }

    const socialLinks = await prisma.socialLink.findMany({
      where: { userId: session.user.id },
      orderBy: { order: 'asc' },
    });

    return NextResponse.json(socialLinks);
  } catch (error) {
    console.error('Error getting social links:', error);
    return NextResponse.json(
      { error: 'Error al obtener redes sociales' },
      { status: 500 }
    );
  }
}

// POST - Crear nuevo social link
export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json({ error: 'No autenticado' }, { status: 401 });
    }

    const body = await request.json();
    const validatedData = socialLinkSchema.parse(body);

    // Obtener el orden máximo actual
    const maxOrder = await prisma.socialLink.aggregate({
      where: { userId: session.user.id },
      _max: { order: true },
    });

    const socialLink = await prisma.socialLink.create({
      data: {
        userId: session.user.id,
        platform: validatedData.platform,
        url: validatedData.url,
        order: validatedData.order ?? (maxOrder._max.order ?? 0) + 1,
      },
    });

    return NextResponse.json(socialLink);
  } catch (error) {
    if (error instanceof Error && error.name === 'ZodError') {
      return NextResponse.json(
        { error: 'Datos inválidos', details: error },
        { status: 400 }
      );
    }
    console.error('Error creating social link:', error);
    return NextResponse.json(
      { error: 'Error al crear red social' },
      { status: 500 }
    );
  }
}

// PUT - Actualizar múltiples social links
export async function PUT(request: NextRequest) {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json({ error: 'No autenticado' }, { status: 401 });
    }

    const body = await request.json();
    const { links } = body;

    if (!Array.isArray(links)) {
      return NextResponse.json({ error: 'Links debe ser un array' }, { status: 400 });
    }

    // Actualizar cada link
    const updates = links.map((link: any) =>
      prisma.socialLink.update({
        where: { id: link.id },
        data: {
          url: link.url,
          order: link.order,
        },
      })
    );

    await Promise.all(updates);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error updating social links:', error);
    return NextResponse.json(
      { error: 'Error al actualizar redes sociales' },
      { status: 500 }
    );
  }
}
