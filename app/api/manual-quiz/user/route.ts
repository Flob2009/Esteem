import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session || !session.user?.email) {
    return new NextResponse(JSON.stringify({ error: 'Unauthorized' }), {
      status: 401,
    });
  }

  try {
    const quizzes = await prisma.manualQuiz.findMany({
      where: {
        user: {
          email: session.user.email,
        },
      },
      include: {
        questions: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json(quizzes);
  } catch (error) {
    console.error('Erreur lors de la récupération des quiz :', error);
    return new NextResponse(
      JSON.stringify({ error: 'Erreur serveur lors de la récupération des quiz.' }),
      { status: 500 }
    );
  }
}
