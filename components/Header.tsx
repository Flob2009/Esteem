'use client';

import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  useTheme,
  Badge,
} from '@mui/material';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function Header() {
  const router = useRouter();
  const theme = useTheme();
  const [hasResults, setHasResults] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const raw = localStorage.getItem('ai-quiz-history');
      try {
        const parsed = JSON.parse(raw || '[]');
        if (parsed.length > 0) setHasResults(true);
      } catch {
        setHasResults(false);
      }
    }
  }, []);

  return (
    <AppBar
      position="sticky"
      elevation={3}
      sx={{
        background: 'linear-gradient(to right, #6200EE, #5D6DFF)',
        color: 'white',
        zIndex: theme.zIndex.drawer + 1,
      }}
    >
      <Toolbar sx={{ display: 'flex', justifyContent: 'space-between' }}>
        {/* Logo image ou nom stylisé */}
        <Box
          sx={{ display: 'flex', alignItems: 'center', gap: 1, cursor: 'pointer' }}
          onClick={() => router.push('/')}
        >
          <img
            src="/logo.png"
            alt="Esteem Logo"
            style={{ width: 36, height: 36 }}
          />
          <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
            Esteem
          </Typography>
        </Box>

        {/* Onglets */}
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button onClick={() => router.push('/quiz/ai')} color="inherit">
            🤖 Quiz IA
          </Button>
          <Button onClick={() => router.push('/quiz/manual')} color="inherit">
            ✍️ Quiz Manuel
          </Button>
          <Badge
            color="secondary"
            variant="dot"
            invisible={!hasResults}
            overlap="rectangular"
          >
            <Button onClick={() => router.push('/quiz/history')} color="inherit">
              📊 Résultats
            </Button>
          </Badge>
          <Button onClick={() => router.push('/settings')} color="inherit">
            ⚙️ Paramètres
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
}