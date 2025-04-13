'use client';

import { useEffect, useState } from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  Container,
  Typography,
  Grid,
} from '@mui/material';

interface QuizHistoryItem {
  date: string;
  theme: string;
  niveau: string;
  score: number;
  max: number;
  pourcentage: number;
  type: 'ai' | 'manuel';
}

export default function QuizHistoryPage() {
  const [history, setHistory] = useState<QuizHistoryItem[]>([]);

  useEffect(() => {
    const raw = localStorage.getItem('ai-quiz-history');
    if (raw) {
      try {
        const parsed = JSON.parse(raw);
        setHistory(parsed);
      } catch {
        setHistory([]);
      }
    }
  }, []);

  const handleClear = () => {
    localStorage.removeItem('ai-quiz-history');
    setHistory([]);
  };

  return (
    <Container maxWidth="md" sx={{ py: 6 }}>
      <Typography variant="h4" gutterBottom>Historique des quiz</Typography>

      {history.length === 0 ? (
        <Typography>Aucun quiz enregistré pour l'instant.</Typography>
      ) : (
        <>
          <Grid container spacing={2}>
            {history.map((item, i) => (
              <Grid item xs={12} key={i}>
                <Card>
                  <CardContent>
                    <Typography variant="h6">{item.theme} ({item.niveau})</Typography>
                    <Typography>Date : {item.date}</Typography>
                    <Typography>Type : {item.type === 'ai' ? 'Quiz IA' : 'Quiz manuel'}</Typography>
                    <Typography>Score : {item.score} / {item.max} ({Math.round(item.pourcentage)}%)</Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>

          <Box textAlign="center" mt={4}>
            <Button variant="outlined" color="error" onClick={handleClear}>
              🗑️ Effacer l'historique
            </Button>
          </Box>
        </>
      )}
    </Container>
  );
}
