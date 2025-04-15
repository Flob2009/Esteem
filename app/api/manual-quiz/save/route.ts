import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { prisma } from '@/lib/prisma';

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
  }

  const data = await req.json();

  const { title, subject, level, classLevel, questions } = data;

  try {
    const savedQuiz = await prisma.quiz.create({
      data: {
        type: 'manuel',
        title,
        subject,
        level,
        classLevel,
        questions: JSON.stringify(questions),
        user: {
          connect: { email: session.user.email },
        },
      },
    });

    return NextResponse.json({ success: true, quizId: savedQuiz.id });
  } catch (error) {
    return NextResponse.json({ error: 'Erreur lors de la sauvegarde' }, { status: 500 });
  }
}