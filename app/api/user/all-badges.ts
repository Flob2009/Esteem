import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';

export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const userBadges = await prisma.userBadge.findMany({
    where: {
      user: { email: session.user.email },
    },
    orderBy: {
      createdAt: 'desc',
    },
    include: {
      badge: true,
    },
  });

  const formatted = userBadges.map((ub) => ({
    label: ub.badge.label,
    emoji: ub.badge.emoji,
  }));

  return NextResponse.json(formatted);
}
