import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@/lib/auth';

export async function POST(req: Request) {
  const url = new URL(req.url);
  const { quizId } = await req.json();

  const session = await auth();
  if (!session?.user?.email) return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });

  const existing = await prisma.manualQuiz.findUnique({
    where: { id: quizId },
    include: { questions: true },
  });

  if (!existing) return NextResponse.json({ error: 'Quiz introuvable' }, { status: 404 });

  const duplicated = await prisma.manualQuiz.create({
    data: {
      title: `Copie de ${existing.title}`,
      subject: existing.subject,
      level: existing.level,
      classLevel: existing.classLevel,
      user: { connect: { email: session.user.email } },
      questions: {
        create: existing.questions.map((q) => ({
          type: q.type,
          question: q.question,
          options: q.options,
          correctIndex: q.correctIndex,
          correctAnswers: q.correctAnswers,
          expectedAnswer: q.expectedAnswer,
          difficulty: q.difficulty,
          points: q.points,
        })),
      },
    },
  });

  return NextResponse.json({ id: duplicated.id });
}