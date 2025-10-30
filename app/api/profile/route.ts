import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { profileSchema } from '@/lib/validations';

export async function PUT(request: NextRequest) {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json({ error: 'No autenticado' }, { status: 401 });
    }

    const body = await request.json();

    // Validar con Zod
    const validatedData = profileSchema.parse(body);

    // Buscar perfil existente
    const existingProfile = await prisma.profile.findUnique({
      where: { userId: session.user.id },
    });

    let profile;
    if (existingProfile) {
      // Actualizar perfil existente
      profile = await prisma.profile.update({
        where: { userId: session.user.id },
        data: {
          name: validatedData.name,
          description: validatedData.description,
          photoUrl: validatedData.photoUrl,
        },
      });
    } else {
      // Crear nuevo perfil
      profile = await prisma.profile.create({
        data: {
          userId: session.user.id,
          name: validatedData.name,
          description: validatedData.description,
          photoUrl: validatedData.photoUrl,
        },
      });
    }

    return NextResponse.json(profile);
  } catch (error) {
    if (error instanceof Error && error.name === 'ZodError') {
      return NextResponse.json(
        { error: 'Datos inválidos', details: error },
        { status: 400 }
      );
    }
    console.error('Error updating profile:', error);
    return NextResponse.json(
      { error: 'Error al actualizar perfil' },
      { status: 500 }
    );
  }
}
