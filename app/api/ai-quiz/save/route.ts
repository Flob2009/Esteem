import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);

  if (!session || !session.user?.email) {
    return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
  }

  const data = await req.json();

  try {
    const saved = await prisma.aiQuiz.create({
      data: {
        title: data.title,
        subject: data.subject,
        level: data.level,
        difficulty: data.difficulty,
        questions: JSON.stringify(data.questions),
        user: {
          connect: {
            email: session.user.email,
          },
        },
      },
    });

    return NextResponse.json(saved, { status: 200 });
  } catch (error) {
    console.error('Erreur lors de la sauvegarde du quiz IA :', error);
    return NextResponse.json({ error: 'Erreur interne' }, { status: 500 });
  }
}
