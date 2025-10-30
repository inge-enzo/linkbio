import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: NextRequest) {
  try {
    const { userId, query, type } = await request.json();

    if (!userId || !query || !type) {
      return NextResponse.json(
        { error: 'userId, query y type son requeridos' },
        { status: 400 }
      );
    }

    await prisma.searchQuery.create({
      data: {
        userId,
        query,
        type,
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error registrando búsqueda:', error);
    return NextResponse.json(
      { error: 'Error registrando búsqueda' },
      { status: 500 }
    );
  }
}
