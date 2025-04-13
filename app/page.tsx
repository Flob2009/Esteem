// app/page.tsx
'use client';

import { useRouter } from 'next/navigation';
import { Box, Button, Container, Typography } from '@mui/material';

export default function HomePage() {
  const router = useRouter();

  return (
    <Container maxWidth="md" sx={{ textAlign: 'center', py: 8 }}>
      <img src="/logo.png" alt="Esteem Logo" style={{ width: 200, margin: 'auto', marginBottom: 32 }} />

      <Typography variant="h2" fontWeight="bold" gutterBottom>
        Esteem
      </Typography>

      <Typography variant="h5" color="text.secondary" gutterBottom>
        Bienvenue dans Esteem, l'application de quiz scolaire !
      </Typography>

      <Box mt={6} display="flex" justifyContent="center" gap={4}>
        <Button
          variant="contained"
          color="primary"
          size="large"
          onClick={() => router.push('/quiz/ai')}
        >
          Quiz IA
        </Button>
        <Button
          variant="contained"
          color="secondary"
          size="large"
          onClick={() => router.push('/quiz/manual')}
        >
          Quiz Manuel
        </Button>
      </Box>
    </Container>
  );
}