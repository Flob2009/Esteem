import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const lastResult = await prisma.result.findFirst({
    where: {
      user: { email: session.user.email },
    },
    include: {
      manualQuiz: true,
    },
    orderBy: {
      createdAt: 'desc',
    },
  });

  if (!lastResult) {
    return NextResponse.json(null);
  }

  return NextResponse.json({
    score: lastResult.score,
    total: lastResult.total,
    createdAt: lastResult.createdAt,
    quizTitle: lastResult.manualQuiz?.title || 'Quiz sans titre',
  });
}
