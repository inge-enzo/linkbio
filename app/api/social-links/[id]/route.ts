import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

interface RouteParams {
  params: Promise<{
    id: string;
  }>;
}

// DELETE - Eliminar social link
export async function DELETE(
  request: NextRequest,
  { params }: RouteParams
) {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json({ error: 'No autenticado' }, { status: 401 });
    }

    const { id } = await params;

    // Verificar que el link pertenezca al usuario
    const socialLink = await prisma.socialLink.findUnique({
      where: { id },
    });

    if (!socialLink || socialLink.userId !== session.user.id) {
      return NextResponse.json(
        { error: 'Red social no encontrada' },
        { status: 404 }
      );
    }

    await prisma.socialLink.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting social link:', error);
    return NextResponse.json(
      { error: 'Error al eliminar red social' },
      { status: 500 }
    );
  }
}
