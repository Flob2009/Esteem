'use client';

import { useEffect, useState } from 'react';
import {
  Box,
  Button,
  Container,
  Typography,
  Paper,
} from '@mui/material';
import SmartToy from '@mui/icons-material/SmartToy';
import EditNote from '@mui/icons-material/EditNote';
import DeleteForever from '@mui/icons-material/DeleteForever';
import ArrowForwardIos from '@mui/icons-material/ArrowForwardIos';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

interface QuizHistoryItem {
  date: string;
  theme: string;
  niveau: string;
  score: number;
  max: number;
  pourcentage: number;
  type: 'ai' | 'manuel';
  titre?: string;
  matiere?: string;
  cycle?: string;
}

export default function QuizHistoryPage() {
  const [history, setHistory] = useState<QuizHistoryItem[]>([]);

  useEffect(() => {
    const allHistory: QuizHistoryItem[] = [];

    const aiRaw = localStorage.getItem('ai-quiz-history');
    if (aiRaw) {
      try {
        const parsed = JSON.parse(aiRaw);
        if (Array.isArray(parsed)) allHistory.push(...parsed);
      } catch {}
    }

    const manualRaw = localStorage.getItem('manual-quiz-history');
    if (manualRaw) {
      try {
        const parsed = JSON.parse(manualRaw);
        if (Array.isArray(parsed)) allHistory.push(...parsed);
      } catch {}
    }

    allHistory.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    setHistory(allHistory);
  }, []);

  const handleClear = () => {
    localStorage.removeItem('ai-quiz-history');
    localStorage.removeItem('manual-quiz-history');
    setHistory([]);
  };

  return (
    <Container maxWidth="md" sx={{ py: 6 }}>
      <Typography variant="h4" align="center" fontWeight={700} gutterBottom>
        Historique des quiz
      </Typography>

      {history.length === 0 ? (
        <Typography align="center">Aucun quiz enregistré pour l'instant.</Typography>
      ) : (
        <>
          {history.map((item, i) => (
            <Paper
              key={i}
              elevation={2}
              sx={{
                p: 3,
                my: 2,
                borderLeft: `6px solid ${
                  item.pourcentage >= 90
                    ? 'green'
                    : item.pourcentage >= 50
                    ? 'orange'
                    : 'red'
                }`,
                cursor: 'pointer',
                transition: 'transform 0.2s, box-shadow 0.2s',
                '&:hover': {
                  backgroundColor: '#f9f9f9',
                  transform: 'translateY(-2px)',
                  boxShadow: 3,
                },
                '&:active': {
                  transform: 'scale(0.98)',
                  boxShadow: 1,
                },
              }}
              onClick={() =>
                window.location.href =
                  item.type === 'ai' ? '/quiz/ai/recap' : '/quiz/manual/recap'
              }
            >
              <Box display="flex" alignItems="center" justifyContent="space-between" mb={1}>
                <Box display="flex" alignItems="center" gap={1}>
                  {item.type === 'ai' ? <SmartToy /> : <EditNote />}
                  <Typography variant="h6" fontWeight={600}>
                    {item.theme}
                  </Typography>
                </Box>
                <ArrowForwardIos fontSize="small" color="disabled" />
              </Box>
              <Typography mt={1} fontSize="0.95rem">
                {item.titre && <><strong>Titre :</strong> {item.titre} &nbsp;&nbsp;|&nbsp;&nbsp;</>}
                {item.matiere && <><strong>Matière :</strong> {item.matiere} &nbsp;&nbsp;|&nbsp;&nbsp;</>}
                {item.cycle && <><strong>Cycle :</strong> {item.cycle} &nbsp;&nbsp;|&nbsp;&nbsp;</>}
                <strong>Niveau :</strong> {item.niveau} &nbsp;&nbsp;|&nbsp;&nbsp;
                <strong>Type :</strong> {item.type === 'ai' ? 'Quiz IA' : 'Quiz personnalisé'} &nbsp;&nbsp;|&nbsp;&nbsp;
                <strong>Date :</strong>{' '}
                {item.date && !isNaN(new Date(item.date).getTime())
                  ? format(new Date(item.date), "d MMMM yyyy", { locale: fr })
                  : 'Date inconnue'}
                &nbsp;&nbsp;|&nbsp;&nbsp;
                <strong>Score :</strong> {item.score} / {item.max} ({Math.round(item.pourcentage)}%)
              </Typography>
            </Paper>
          ))}

          <Box textAlign="center" mt={4}>
            <Button
              variant="outlined"
              color="error"
              startIcon={<DeleteForever />}
              onClick={handleClear}
            >
              Effacer l'historique
            </Button>
          </Box>
        </>
      )}
    </Container>
  );
}
