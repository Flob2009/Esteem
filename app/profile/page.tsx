'use client';

import { getServerSession } from 'next-auth';
import { authOptions } from '../api/auth/[...nextauth]/route';
import { prisma } from '@/lib/prisma';
import { Box, Container, Typography, Paper } from '@mui/material';

export default async function ProfilePage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    return (
      <Container maxWidth="md" sx={{ py: 6 }}>
        <Typography variant="h5">Vous devez être connecté pour accéder à votre profil.</Typography>
      </Container>
    );
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user?.email || '' },
    include: {
      quizzes: true,
      results: true,
    },
  });

  return (
    <Container maxWidth="md" sx={{ py: 6 }}>
      <Typography variant="h4" gutterBottom>
        Bonjour, {user?.name || 'Utilisateur'}
      </Typography>

      <Typography variant="h6" mt={4} mb={2}>📚 Vos quiz créés</Typography>
      {user?.quizzes?.length ? (
        user.quizzes.map((quiz) => (
          <Paper key={quiz.id} sx={{ p: 2, my: 1 }}>
            <Typography variant="subtitle1">{quiz.title}</Typography>
            <Typography variant="body2" color="text.secondary">
              {quiz.subject} – {quiz.level} – {quiz.classLevel}
            </Typography>
          </Paper>
        ))
      ) : (
        <Typography>Aucun quiz créé pour l’instant.</Typography>
      )}

      <Typography variant="h6" mt={5} mb={2}>🧠 Historique de résultats</Typography>
      {user?.results?.length ? (
        user.results.map((res) => (
          <Paper key={res.id} sx={{ p: 2, my: 1 }}>
            <Typography variant="subtitle2">
              Quiz : {res.quizTitle} – Score : {res.score} / {res.total}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Date : {new Date(res.createdAt).toLocaleDateString()}
            </Typography>
          </Paper>
        ))
      ) : (
        <Typography>Pas encore de résultats enregistrés.</Typography>
      )}
    </Container>
  );
}