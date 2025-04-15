import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';

export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const lastResult = await prisma.result.findFirst({
    where: {
      user: { email: session.user.email },
    },
    orderBy: {
      playedAt: 'desc',
    },
    include: {
      quiz: true,
    },
  });

  if (!lastResult) {
    return NextResponse.json(null);
  }

  return NextResponse.json({
    title: lastResult.quiz.title,
    score: lastResult.score,
    playedAt: lastResult.playedAt,
  });
}
