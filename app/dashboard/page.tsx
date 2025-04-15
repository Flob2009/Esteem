'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { formatDistanceToNow, format } from 'date-fns';
import fr from 'date-fns/locale/fr';
import {
  Box,
  Container,
  Typography,
  Grid,
  Button,
  Divider,
  Stack,
  Chip,
} from '@mui/material';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import QuizIcon from '@mui/icons-material/Quiz';
import HistoryIcon from '@mui/icons-material/History';
import FlashOnIcon from '@mui/icons-material/FlashOn';

const fadeSlideIn = {
  '@keyframes fadeSlideIn': {
    from: { opacity: 0, transform: 'translateY(12px)' },
    to: { opacity: 1, transform: 'translateY(0)' },
  },
};

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [lastResult, setLastResult] = useState<{
    title: string;
    score: number;
    playedAt: string;
  } | null>(null);
  const [lastBadge, setLastBadge] = useState<{ label: string; emoji: string } | null>(null);
  const [averageScore, setAverageScore] = useState<number | null>(null);
  const [quizCount, setQuizCount] = useState<number | null>(null);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
    }

    if (status === 'authenticated') {
      fetch('/api/user/last-result')
        .then((res) => res.json())
        .then((data) => setLastResult(data));

      fetch('/api/user/last-badge')
        .then((res) => res.json())
        .then((data) => setLastBadge(data));

      fetch('/api/user/average-score')
        .then((res) => res.json())
        .then((data) => setAverageScore(data?.average ?? null));

      fetch('/api/user/quiz-count')
        .then((res) => res.json())
        .then((data) => setQuizCount(data?.count ?? null));
    }
  }, [status, router]);

  if (status === 'loading') {
    return <p>Chargement...</p>;
  }

  return (
    <Container maxWidth="md" sx={{ py: 6, ...fadeSlideIn }}>
      <Typography
        variant="h4"
        fontWeight="bold"
        textAlign="center"
        sx={{
          background: 'linear-gradient(to right, #6200EE, #5D6DFF)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          mb: 4,
        }}
      >
        👋 Bienvenue sur ton espace, {session?.user?.name || 'Utilisateur'}
      </Typography>

      <Typography variant="h6" fontWeight="bold" mb={1} display="flex" alignItems="center" gap={1}>
        Aperçu de votre activité
      </Typography>
      <Divider sx={{ mb: 2 }} />
      <Grid container spacing={2} mb={4} alignItems="stretch">
        <Grid item xs={12} md={4}>
          <Box
            sx={{
              p: 2,
              height: '100%',
              minHeight: 140,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              backgroundColor: '#fff',
              borderRadius: 1,
              border: '1px solid #e0e0e0',
              fontSize: '0.85rem',
              animation: 'fadeSlideIn 0.6s ease',
            }}
          >
            <Typography variant="body2" fontWeight="bold" mb={1}>
              Dernière activité
            </Typography>
            {lastResult && lastResult.playedAt ? (
              <>
                <Typography variant="body2">{lastResult.title}</Typography>
                <Typography variant="body2" color="text.secondary">
                  Score : {lastResult.score}/20
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {format(new Date(lastResult.playedAt), 'd MMMM yyyy', { locale: fr })}
                </Typography>
              </>
            ) : (
              <Box sx={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Typography variant="body2" color="text.secondary" textAlign="center">
                  Aucun quiz joué récemment.
                </Typography>
              </Box>
            )}
          </Box>
        </Grid>

        <Grid item xs={12} md={4}>
          <Box
            sx={{
              p: 2,
              height: '100%',
              minHeight: 140,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              backgroundColor: '#fff',
              borderRadius: 1,
              border: '1px solid #e0e0e0',
              fontSize: '0.85rem',
              animation: 'fadeSlideIn 0.6s ease',
            }}
          >
            <Typography variant="body2" fontWeight="bold" mb={1}>
              Récompenses
            </Typography>
            {lastBadge ? (
              <Chip label={`${lastBadge.emoji} ${lastBadge.label}`} color="primary" />
            ) : (
              <Typography variant="body2" color="text.secondary" mb={1}>
                Aucun badge débloqué.
              </Typography>
            )}
            <Typography
              variant="body2"
              color="primary"
              sx={{ cursor: 'pointer', textDecoration: 'underline' }}
              onClick={() => router.push('/dashboard/badges')}
            >
              Voir tous mes badges
            </Typography>
          </Box>
        </Grid>

        <Grid item xs={12} md={4}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={4}>
              <Box
                sx={{
                  p: 2,
                  border: '1px solid #e0e0e0',
                  borderRadius: 1,
                  textAlign: 'center',
                  backgroundColor: '#fff',
                  minHeight: 140,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  animation: 'fadeSlideIn 0.6s ease',
                }}
              >
                {averageScore !== null ? (
                  <>
                    <Typography variant="h5" fontWeight="bold">
                      {Math.round(averageScore)}%
                    </Typography>
                    <Typography variant="body2">Score moyen</Typography>
                  </>
                ) : (
                  <Typography variant="body2" color="text.secondary">
                    Aucun quiz joué
                  </Typography>
                )}
                {averageScore !== null && (
                  <Typography
                    variant="body2"
                    color="primary"
                    sx={{ cursor: 'pointer', textDecoration: 'underline', mt: 1 }}
                    onClick={() => router.push('/quiz/history')}
                  >
                    Voir mes résultats
                  </Typography>
                )}
              </Box>
            </Grid>
            <Grid item xs={12} sm={4}>
              <Box
                sx={{
                  p: 2,
                  border: '1px solid #e0e0e0',
                  borderRadius: 1,
                  textAlign: 'center',
                  backgroundColor: '#fff',
                  minHeight: 140,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  animation: 'fadeSlideIn 0.6s ease',
                }}
              >
                {quizCount !== null ? (
                  <>
                    <Typography variant="h5" fontWeight="bold">{quizCount}</Typography>
                    <Typography variant="body2">Quiz joués</Typography>
                    <Typography
                      variant="body2"
                      color="primary"
                      sx={{ cursor: 'pointer', textDecoration: 'underline', mt: 1 }}
                      onClick={() => router.push('/quiz/history')}
                    >
                      Voir mes résultats
                    </Typography>
                  </>
                ) : (
                  <Typography variant="body2" color="text.secondary">
                    Aucun quiz joué
                  </Typography>
                )}
              </Box>
            </Grid>
          </Grid>
        </Grid>
      </Grid>

      <Typography variant="h6" fontWeight="bold" mt={4} mb={1} display="flex" alignItems="center" gap={1}>
        <FlashOnIcon fontSize="small" />
        Actions rapides
      </Typography>
      <Divider sx={{ mb: 2 }} />
      <Grid container spacing={3} direction="column">
        <Grid item>
          <Grid container alignItems="center" spacing={2}>
            <Grid item xs={12} sm={4}>
              <Button
                variant="contained"
                sx={{
                  backgroundColor: '#7C3AED',
                  '&:hover': { backgroundColor: '#6D28D9' },
                  borderRadius: 1,
                  px: 3,
                  py: 1.5,
                  textTransform: 'none',
                  fontWeight: 'bold',
                }}
                startIcon={<AddCircleIcon />}
                onClick={() => router.push('/quiz/manual')}
              >
                Créer
              </Button>
            </Grid>
            <Grid item xs={12} sm={8}>
              <Typography variant="body2">
                Conçois manuellement un quiz question par question à partager à tes élèves ou amis.
              </Typography>
            </Grid>
          </Grid>
        </Grid>

        <Grid item>
          <Grid container alignItems="center" spacing={2}>
            <Grid item xs={12} sm={4}>
              <Button
                variant="contained"
                sx={{
                  backgroundColor: '#7C3AED',
                  '&:hover': { backgroundColor: '#6D28D9' },
                  borderRadius: 1,
                  px: 3,
                  py: 1.5,
                  textTransform: 'none',
                  fontWeight: 'bold',
                }}
                startIcon={<QuizIcon />}
                onClick={() => router.push('/quiz/ai')}
              >
                Générer
              </Button>
            </Grid>
            <Grid item xs={12} sm={8}>
              <Typography variant="body2">
                Obtiens un quiz généré automatiquement par l’IA en fonction d’un thème ou niveau.
              </Typography>
            </Grid>
          </Grid>
        </Grid>

        <Grid item>
          <Grid container alignItems="center" spacing={2}>
            <Grid item xs={12} sm={4}>
              <Button
                variant="contained"
                sx={{
                  backgroundColor: '#7C3AED',
                  '&:hover': { backgroundColor: '#6D28D9' },
                  borderRadius: 1,
                  px: 3,
                  py: 1.5,
                  textTransform: 'none',
                  fontWeight: 'bold',
                }}
                startIcon={<HistoryIcon />}
                onClick={() => router.push('/quiz/history')}
              >
                Mes résultats
              </Button>
            </Grid>
            <Grid item xs={12} sm={8}>
              <Typography variant="body2">
                Consulte l’historique de tes quiz joués avec ton score et ta progression.
              </Typography>
            </Grid>
          </Grid>
        </Grid>

        <Grid item>
          <Grid container alignItems="center" spacing={2}>
            <Grid item xs={12} sm={4}>
              <Button
                variant="contained"
                sx={{
                  backgroundColor: '#7C3AED',
                  '&:hover': { backgroundColor: '#6D28D9' },
                  borderRadius: 1,
                  px: 3,
                  py: 1.5,
                  textTransform: 'none',
                  fontWeight: 'bold',
                }}
                startIcon={<QuizIcon />}
                onClick={() => router.push('/dashboard/quizs-list')}
              >
                Mes quiz enregistrés
              </Button>
            </Grid>
            <Grid item xs={12} sm={8}>
              <Typography variant="body2">
                Accède à la liste des quiz que tu as créés, modifiés ou sauvegardés.
              </Typography>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Container>
  );
}