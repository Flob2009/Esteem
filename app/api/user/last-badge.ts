import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';

export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const lastUserBadge = await prisma.userBadge.findFirst({
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

  if (!lastUserBadge) {
    return NextResponse.json(null);
  }

  return NextResponse.json({
    label: lastUserBadge.badge.label,
    emoji: lastUserBadge.badge.emoji,
  });
}
