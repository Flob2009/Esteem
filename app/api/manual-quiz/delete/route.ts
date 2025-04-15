import { NextRequest } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function DELETE(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return new Response('Unauthorized', { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const id = searchParams.get('id');

  if (!id) {
    return new Response('Missing quiz ID', { status: 400 });
  }

  // Find the quiz and ensure it belongs to the logged-in user
  const quiz = await prisma.manualQuiz.findUnique({
    where: { id },
  });

  if (!quiz || quiz.userEmail !== session.user.email) {
    return new Response('Not found or unauthorized', { status: 404 });
  }

  // Delete the quiz
  await prisma.manualQuiz.delete({
    where: { id },
  });

  return new Response('Quiz deleted successfully', { status: 200 });
}
