import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: NextRequest) {
  try {
    const { userId } = await request.json();

    if (!userId) {
      return NextResponse.json(
        { error: 'userId es requerido' },
        { status: 400 }
      );
    }

    await prisma.pageView.create({
      data: {
        userId,
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error registrando vista:', error);
    return NextResponse.json(
      { error: 'Error registrando vista' },
      { status: 500 }
    );
  }
}
