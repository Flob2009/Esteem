import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';

export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const results = await prisma.result.findMany({
    where: {
      user: { email: session.user.email },
    },
    select: {
      score: true,
    },
  });

  if (results.length === 0) {
    return NextResponse.json({ average: null });
  }

  const total = results.reduce((sum, r) => sum + r.score, 0);
  const average = total / results.length;

  return NextResponse.json({ average });
}
