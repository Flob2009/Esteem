import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    const id = params.id;

    await prisma.manualQuiz.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Erreur lors de la suppression :', error);
    return new NextResponse('Erreur serveur', { status: 500 });
  }
}