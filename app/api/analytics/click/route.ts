import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: NextRequest) {
  try {
    const { userId, itemType, itemId } = await request.json();

    if (!userId || !itemType || !itemId) {
      return NextResponse.json(
        { error: 'userId, itemType y itemId son requeridos' },
        { status: 400 }
      );
    }

    // Registrar el clic
    await prisma.clickEvent.create({
      data: {
        userId,
        itemType,
        itemId,
      },
    });

    // Incrementar contador de vistas según el tipo
    if (itemType === 'product') {
      await prisma.product.update({
        where: { id: itemId },
        data: {
          views: {
            increment: 1,
          },
        },
      });
    } else if (itemType === 'content') {
      await prisma.content.update({
        where: { id: itemId },
        data: {
          views: {
            increment: 1,
          },
        },
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error registrando clic:', error);
    return NextResponse.json(
      { error: 'Error registrando clic' },
      { status: 500 }
    );
  }
}
