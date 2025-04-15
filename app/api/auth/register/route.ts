import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';

export async function POST(req: Request) {
  const { name, email, password } = await req.json();

  if (!email || !password || !name) {
    return NextResponse.json({ error: 'Champs requis manquants' }, { status: 400 });
  }

  const existingUser = await prisma.user.findUnique({ where: { email } });

  if (existingUser) {
    return NextResponse.json({ error: 'Utilisateur déjà existant' }, { status: 409 });
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  try {
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
      },
    });

    return NextResponse.redirect(new URL('/login', req.url));
  } catch (error) {
    console.error('Erreur lors de la création de l’utilisateur :', error);
    return NextResponse.json({ error: 'Erreur serveur lors de la création du compte' }, { status: 500 });
  }
}
