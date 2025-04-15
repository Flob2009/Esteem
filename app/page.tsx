'use client';
import { useRouter } from 'next/navigation';
import { Box, Container, Typography } from '@mui/material';
import SmartToy from '@mui/icons-material/SmartToy';
import EditNote from '@mui/icons-material/EditNote';
import EmojiObjects from '@mui/icons-material/EmojiObjects';
import TouchApp from '@mui/icons-material/TouchApp';

export default function HomePage() {
  const router = useRouter();

  const handleNavigateToAIQuiz = () => {
    router.push('/quiz/ai');
  };

  const handleNavigateToManualQuiz = () => {
    router.push('/quiz/manual');
  };

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
      <Container maxWidth="md">
        <Box sx={{ mb: 6 }}>
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
          Bienvenue dans Esteem
        </Typography>

        <Typography variant="h6" sx={{ mb: 2 }}>
          <EmojiObjects sx={{ verticalAlign: 'middle', mr: 1 }} />
          Teste tes connaissances grâce à Esteem
        </Typography>
        <Typography variant="subtitle1" sx={{ mb: 4 }}>
          <TouchApp sx={{ verticalAlign: 'middle', mr: 1 }} />
          Clique sur une carte pour commencer
        </Typography>

        <Box
          display="flex"
          flexDirection={{ xs: 'column', md: 'row' }}
          gap={4}
          justifyContent="center"
          mb={6}
        >
          <Box
            onClick={handleNavigateToAIQuiz}
            sx={{
              flex: 1,
              backgroundColor: 'rgba(255, 255, 255, 0.1)',
              p: 3,
              borderRadius: 4,
              transition: 'transform 0.3s',
              cursor: 'pointer',
              '&:hover': {
                transform: 'scale(1.02)',
                backgroundColor: 'rgba(255,255,255,0.15)',
              },
            }}
          >
            <Typography variant="h6" gutterBottom>
              <SmartToy sx={{ verticalAlign: 'middle', mr: 1 }} />
              Quiz IA
            </Typography>
            <Typography variant="body2">
              Générés par l’IA. Corrigés automatiquement. Idéal pour tester un thème et obtenir une fiche.
            </Typography>
          </Box>

          <Box
            onClick={handleNavigateToManualQuiz}
            sx={{
              flex: 1,
              backgroundColor: 'rgba(255, 255, 255, 0.1)',
              p: 3,
              borderRadius: 4,
              transition: 'transform 0.3s',
              cursor: 'pointer',
              '&:hover': {
                transform: 'scale(1.02)',
                backgroundColor: 'rgba(255,255,255,0.15)',
              },
            }}
          >
            <Typography variant="h6" gutterBottom>
              <EditNote sx={{ verticalAlign: 'middle', mr: 1 }} />
              Quiz personnalisés
            </Typography>
            <Typography variant="body2">
              Crée des quiz personnalisés que tu peux partager facilement avec tes élèves.
            </Typography>
          </Box>
        </Box>
      </Container>
    </Box>
  );
}