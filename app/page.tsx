'use client';
import { useRouter } from 'next/navigation';
import { Box, Container, Typography, Button, Stack } from '@mui/material';
import SmartToy from '@mui/icons-material/SmartToy';
import EditNote from '@mui/icons-material/EditNote';
import DashboardCustomize from '@mui/icons-material/DashboardCustomize';
import { useSession } from 'next-auth/react';

export default function HomePage() {
  const router = useRouter();
  const { data: session } = useSession();

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: 'linear-gradient(to right, #6200EE, #5D6DFF)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'white',
        textAlign: 'center',
        px: 2,
      }}
    >
      <Container maxWidth="sm">
        <Box sx={{ mb: 4 }}>
          <img
            src="/logo.png"
            alt="Esteem Logo"
            style={{
              width: 140,
              height: 140,
              margin: '0 auto',
              animation: 'float 3s ease-in-out infinite',
            }}
          />
        </Box>

        <Typography variant="h4" fontWeight={700} gutterBottom>
          Bienvenue sur Esteem
        </Typography>

        <Typography variant="subtitle1" sx={{ mb: 4 }}>
          Crée ou joue des quiz adaptés à ton niveau. Analyse tes résultats et progresse !
        </Typography>

        <Stack spacing={2} direction="column" alignItems="center" mb={4}>
          <Button
            variant="contained"
            color="primary"
            size="large"
            startIcon={<SmartToy />}
            onClick={() => router.push('/quiz/ai')}
            sx={{ width: '100%' }}
          >
            S'entraîner avec l'IA
          </Button>

          <Button
            variant="contained"
            color="secondary"
            size="large"
            startIcon={<EditNote />}
            onClick={() => router.push('/quiz/manual')}
            sx={{ width: '100%' }}
          >
            Créer un quiz
          </Button>
        </Stack>

        {session && (
          <Button
            variant="outlined"
            startIcon={<DashboardCustomize />}
            onClick={() => router.push('/dashboard')}
            sx={{ mt: 2 }}
          >
            Accéder au tableau de bord
          </Button>
        )}
      </Container>
    </Box>
  );
}