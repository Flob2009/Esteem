'use client';

import { useEffect, useState } from 'react';
import {
  Box,
  Button,
  Container,
  Paper,
  Typography,
} from '@mui/material';
import EmojiEvents from '@mui/icons-material/EmojiEvents';
import Replay from '@mui/icons-material/Replay';
import Home from '@mui/icons-material/Home';
import MenuBook from '@mui/icons-material/MenuBook';
import MilitaryTech from '@mui/icons-material/MilitaryTech';
import AccessTime from '@mui/icons-material/AccessTime';

interface Result {
  type: string;
  question: string;
  userAnswer: any;
  answer?: any;
  earned?: number;
  max?: number;
}

export default function ManualQuizResultPage() {
  const [results, setResults] = useState<Result[]>([]);
  const [score, setScore] = useState(0);
  const [medal, setMedal] = useState('');
  const [feedback, setFeedback] = useState('');

  useEffect(() => {
    const raw = localStorage.getItem('manual-quiz-result');
    if (raw) {
      const parsed: Result[] = JSON.parse(raw);
      setResults(parsed);

      let userPoints = 0;
      let totalPoints = 0;

      const corrected = parsed.map((r) => {
        if (r.type === 'qcm') {
          const point = r.userAnswer === r.answer ? 1 : 0;
          userPoints += point;
          totalPoints += 1;
          return { ...r, earned: point, max: 1 };
        }

        if (r.type === 'choix_multiples') {
          const correct = r.answer || [];
          const user = r.userAnswer || [];
          let point = 0;
          correct.forEach((val, i) => {
            if (val && user[i]) point++;
          });
          const max = correct.filter(Boolean).length;
          userPoints += point;
          totalPoints += max;
          return { ...r, earned: point, max };
        }

        if (r.type === 'correspondance') {
          const correctPairs = r.answer || [];
          const userPairs = r.userAnswer || [];
          let point = 0;
          correctPairs.forEach((pair: any) => {
            const match = userPairs.find(
              (u: any) => u.left === pair.left && u.right === pair.right
            );
            if (match) point++;
          });
          const max = correctPairs.length;
          userPoints += point;
          totalPoints += max;
          return { ...r, earned: point, max };
        }

        if (r.type === 'ordre') {
          const user = r.userAnswer || [];
          const correct = r.answer || [];
          const point = user.every((item: string, i: number) => item === correct[i]) ? 1 : 0;
          userPoints += point;
          totalPoints += 1;
          return { ...r, earned: point, max: 1 };
        }

        // ouverte ou texte_trous
        if (
          typeof r.userAnswer === 'string' &&
          typeof r.answer === 'string'
        ) {
          const point =
            r.userAnswer.trim().toLowerCase() === r.answer.trim().toLowerCase() ? 1 : 0;
          userPoints += point;
          totalPoints += 1;
          return { ...r, earned: point, max: 1 };
        }

        return { ...r, earned: 0, max: 1 };
      });

      setResults(corrected);

      const percent = totalPoints > 0 ? (userPoints / totalPoints) * 100 : 0;

      if (percent >= 90) {
        setMedal('🥇');
        setFeedback('Excellent ! Tu es au top !');
      } else if (percent >= 70) {
        setMedal('🥈');
        setFeedback('Très bien joué ! Continue comme ça.');
      } else if (percent >= 50) {
        setMedal('🥉');
        setFeedback('Pas mal, mais tu peux encore progresser.');
      } else {
        setMedal('🕓');
        setFeedback('Courage, persévère !');
      }

      const historyItem = {
        type: 'manual',
        theme: 'Quiz personnalisé',
        niveau: 'N/A',
        score: userPoints,
        max: totalPoints,
        pourcentage: percent,
        date: new Date().toISOString(),
      };

      const historyRaw = localStorage.getItem('manual-quiz-history');
      let history = [];
      if (historyRaw) {
        try {
          history = JSON.parse(historyRaw);
          if (!Array.isArray(history)) history = [];
        } catch {
          history = [];
        }
      }
      history.push(historyItem);
      localStorage.setItem('manual-quiz-history', JSON.stringify(history));
    }
  }, []);

  const handleRestart = () => {
    localStorage.removeItem('manual-quiz-data');
    localStorage.removeItem('manual-quiz-result');
    window.location.href = '/quiz/manual';
  };

  return (
    <Container maxWidth="md" sx={{ py: 6 }}>
      <Typography variant="h4" align="center" fontWeight={700} gutterBottom>
        <EmojiEvents sx={{ verticalAlign: 'middle', mr: 1 }} />
        Résultats du Quiz Personnalisé
      </Typography>

      <Typography variant="h6" align="center" sx={{ mt: 1 }}>
        Score : {score} / {results.length} — Médaille : {medal}
      </Typography>
      <Typography variant="body1" align="center" sx={{ mb: 4 }}>
        {feedback}
      </Typography>

      {results.map((r, i) => (
        <Paper key={i} elevation={2} sx={{ my: 2, p: 3 }}>
          <Typography variant="h6">{i + 1}. {r.question}</Typography>
          <Typography sx={{ mt: 1 }}>
            Ta réponse : <strong>{JSON.stringify(r.userAnswer) || 'Non répondu'}</strong>
          </Typography>
          <Typography sx={{ mt: 1 }}>
            Bonne réponse : <strong>{JSON.stringify(r.answer)}</strong>
          </Typography>
          <Typography sx={{ mt: 1 }}>
            Points obtenus : <strong>{r.earned} / {r.max}</strong>
          </Typography>
        </Paper>
      ))}

      <Box mt={4} display="flex" justifyContent="center" gap={2} flexWrap="wrap">
        <Button variant="contained" color="primary" startIcon={<Home />} onClick={() => window.location.href = '/'}>
          Retour à l'accueil
        </Button>
        <Button variant="contained" color="secondary" startIcon={<Replay />} onClick={handleRestart}>
          Refaire un quiz personnalisé
        </Button>
        <Button
          variant="contained"
          color="success"
          startIcon={<MenuBook />}
          onClick={() => window.location.href = '/quiz/manual/recap'}
        >
          Fiche de révision
        </Button>
      </Box>
    </Container>
  );
}
