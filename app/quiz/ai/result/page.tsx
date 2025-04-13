'use client';

import { useEffect, useState } from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  Container,
  Snackbar,
  Typography,
} from '@mui/material';
import MuiAlert from '@mui/material/Alert';

interface Question {
  question: string;
  type: string;
  answer: any;
  userAnswer: any;
  isCorrect: boolean;
  correction?: string;
  points: number;
}

export default function AIQuizResultPage() {
  const [loading, setLoading] = useState(true);
  const [corrected, setCorrected] = useState<Question[]>([]);
  const [earnedPoints, setEarnedPoints] = useState(0);
  const [maxPoints, setMaxPoints] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [showSnackbar, setShowSnackbar] = useState(false);
  const [copied, setCopied] = useState(false);

  const getPointsForType = (type: string): number => {
    switch (type) {
      case 'ordre':
      case 'correspondance':
        return 2;
      case 'ouverte':
        return 3;
      default:
        return 1;
    }
  };

  useEffect(() => {
    const correctAnswers = async () => {
      try {
        const quizRaw = localStorage.getItem('ai-quiz-data');
        if (!quizRaw) throw new Error('Quiz non trouvé.');
        const quiz = JSON.parse(quizRaw);

        const openQuestions = quiz.filter((q: any) => q.type === 'ouverte');
        let corrections: any[] = [];

        if (openQuestions.length > 0) {
          const prompt = `Corrige les réponses suivantes. Pour chaque question ouverte, donne une correction dans un JSON : [{question, correction}]. Ne commente pas.`;
          const userInput = openQuestions.map((q: any) => ({ question: q.question, userAnswer: q.userAnswer }));

          const res = await fetch('https://api.mistral.ai/v1/chat/completions', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${process.env.NEXT_PUBLIC_MISTRAL_API_KEY}`,
            },
            body: JSON.stringify({
              model: 'mistral-medium',
              messages: [
                { role: 'user', content: prompt },
                { role: 'user', content: JSON.stringify(userInput) },
              ],
              temperature: 0.3,
            }),
          });

          const data = await res.json();
          const raw = data.choices?.[0]?.message?.content;
          try {
            corrections = JSON.parse(raw);
          } catch {
            corrections = [];
          }
        }

        const evaluated = quiz.map((q: any) => {
          const points = getPointsForType(q.type);
          let isCorrect = false;

          if (q.type === 'qcm' || q.type === 'texte_trous') {
            isCorrect = q.userAnswer?.trim().toLowerCase() === q.answer?.trim().toLowerCase();
          } else if (q.type === 'choix_multiples') {
            const sort = (arr: any[]) => (arr || []).sort().join(',');
            isCorrect = sort(q.userAnswer) === sort(q.answer);
          } else if (q.type === 'ordre') {
            isCorrect = (q.userAnswer || []).join(',') === (q.answer || []).join(',');
          } else if (q.type === 'correspondance') {
            const expectedMap = new Map(q.answer.map((p: any) => [p.left, p.right]));
            const userMap = new Map(Object.entries(q.userAnswer || {}));
            isCorrect = Array.from(expectedMap.entries()).every(
              ([left, right]) => userMap.get(left) === right
            );
          } else if (q.type === 'ouverte') {
            isCorrect = false;
          }

          const correctionText = corrections.find((c) => c.question === q.question)?.correction;

          return {
            ...q,
            isCorrect,
            points,
            correction: q.type === 'ouverte' ? correctionText : undefined,
          };
        });

        const totalEarned = evaluated.reduce((acc, q) => acc + (q.isCorrect ? q.points : 0), 0);
        const totalMax = evaluated.reduce((acc, q) => acc + q.points, 0);

        setCorrected(evaluated);
        setEarnedPoints(totalEarned);
        setMaxPoints(totalMax);

        // Enregistrement dans l'historique
        const setup = localStorage.getItem('ai-quiz-setup');
        const { theme, niveau } = setup ? JSON.parse(setup) : { theme: 'Thème inconnu', niveau: '?' };
        const pourcentage = (totalEarned / totalMax) * 100;
        const date = new Date().toLocaleDateString();

        const current = localStorage.getItem('ai-quiz-history');
        const history = current ? JSON.parse(current) : [];

        const updatedHistory = [
          ...history,
          {
            date,
            theme,
            niveau,
            score: totalEarned,
            max: totalMax,
            pourcentage,
            type: 'ai',
          },
        ];

        localStorage.setItem('ai-quiz-history', JSON.stringify(updatedHistory));
      } catch (err: any) {
        setError(err.message || 'Erreur inconnue');
      } finally {
        setLoading(false);
      }
    };

    correctAnswers();
  }, []);

  const handleRestart = () => {
    localStorage.removeItem('ai-quiz-data');
    localStorage.removeItem('ai-quiz-setup');
    setShowSnackbar(true);
    setTimeout(() => window.location.href = '/quiz/ai', 1000);
  };

  const handleRecap = () => {
    const setup = localStorage.getItem('ai-quiz-setup');
    if (setup) {
      const { theme, niveau } = JSON.parse(setup);
      localStorage.setItem('ai-quiz-recap', JSON.stringify({ theme, niveau }));
      window.location.href = '/quiz/ai/recap';
    }
  };

  const handleRetrySameTheme = () => {
    const setup = localStorage.getItem('ai-quiz-setup');
    if (setup) {
      const { theme, niveau } = JSON.parse(setup);
      const retry = { theme, niveau, nbQuestions: 5, types: ['qcm', 'texte_trous', 'choix_multiples', 'ordre', 'correspondance', 'ouverte'] };
      localStorage.setItem('ai-quiz-setup', JSON.stringify(retry));
      window.location.href = '/quiz/ai/run';
    }
  };

  const handleShare = async () => {
    const setup = localStorage.getItem('ai-quiz-setup');
    const { theme } = setup ? JSON.parse(setup) : { theme: 'un thème' };
    const text = `🎉 J'ai obtenu ${earnedPoints}/${maxPoints} à mon quiz sur "${theme}" dans l'app Esteem !\nRejoins-nous sur esteem.app ✨`;
    await navigator.clipboard.writeText(text);
    setCopied(true);
  };

  const percent = (earnedPoints / maxPoints) * 100;
  let medal = '';
  let feedback = '';

  if (percent >= 90) {
    medal = '🥇 Or';
    feedback = "Excellent travail ! 💪";
  } else if (percent >= 70) {
    medal = '🥈 Argent';
    feedback = "Très bon score, continue ainsi !";
  } else if (percent >= 50) {
    medal = '🥉 Bronze';
    feedback = "Pas mal ! Tu peux encore progresser 💡";
  } else {
    medal = '🕓';
    feedback = "Courage, persévère ! 🚀";
  }

  if (loading) {
    return <Container maxWidth="md" sx={{ textAlign: 'center', py: 6 }}><CircularProgress /><Typography mt={2}>Correction...</Typography></Container>;
  }

  if (error) {
    return <Container maxWidth="sm" sx={{ textAlign: 'center', py: 6 }}><Typography color="error">{error}</Typography></Container>;
  }

  return (
    <Container maxWidth="md" sx={{ py: 6 }}>
      <Typography variant="h4" gutterBottom>Résultats du Quiz</Typography>
      <Typography variant="h6" gutterBottom>🏅 Médaille : {medal}</Typography>
      <Typography variant="body1" gutterBottom>{feedback}</Typography>
      <Typography variant="h6" gutterBottom>Note : {earnedPoints} / {maxPoints} ({Math.round(percent)}%)</Typography>

      {corrected.map((q, index) => (
        <Card key={index} sx={{ my: 2, borderLeft: q.isCorrect ? '5px solid green' : q.type === 'ouverte' ? '5px solid #1976d2' : '5px solid red' }}>
          <CardContent>
            <Typography variant="h6">{index + 1}. {q.question}</Typography>

            <Box sx={{ mt: 1 }}>
              <Typography sx={{ color: 'green' }}>Ta réponse : {Array.isArray(q.userAnswer) ? q.userAnswer.join(', ') : typeof q.userAnswer === 'object' ? JSON.stringify(q.userAnswer) : q.userAnswer}</Typography>

              {q.type !== 'ouverte' && (
                <Typography sx={{ color: q.isCorrect ? 'green' : 'red' }}>Bonne réponse : {Array.isArray(q.answer) ? q.answer.join(', ') : typeof q.answer === 'object' ? JSON.stringify(q.answer) : q.answer}</Typography>
              )}

              {q.type === 'ouverte' && q.correction && (
                <Typography sx={{ color: '#1976d2', mt: 1 }}>Correction IA : {q.correction}</Typography>
              )}
            </Box>

            <Typography sx={{ mt: 1, fontWeight: 'bold' }}>Points attribués : {q.isCorrect ? q.points : 0} / {q.points}</Typography>
          </CardContent>
        </Card>
      ))}

      <Box mt={4} display="flex" flexWrap="wrap" justifyContent="center" gap={2}>
        <Button variant="contained" color="primary" size="large" onClick={() => window.location.href = '/'}>Accueil</Button>
        <Button variant="contained" color="error" size="large" onClick={handleRestart}>🔁 Recommencer</Button>
        <Button variant="contained" color="secondary" size="large" onClick={handleRecap}>📚 Aide-moi à réviser</Button>
        <Button variant="contained" color="success" size="large" onClick={handleRetrySameTheme}>🔄 Refaire ce thème</Button>
        <Button variant="outlined" color="info" size="large" onClick={handleShare}>📤 Partager mon score</Button>
      </Box>

      <Snackbar open={showSnackbar} autoHideDuration={2000} onClose={() => setShowSnackbar(false)} anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}>
        <MuiAlert elevation={6} variant="filled" severity="info">Quiz réinitialisé !</MuiAlert>
      </Snackbar>

      <Snackbar open={copied} autoHideDuration={2000} onClose={() => setCopied(false)} anchorOrigin={{ vertical: 'top', horizontal: 'center' }}>
        <MuiAlert elevation={6} variant="filled" severity="success">Score copié dans le presse-papiers !</MuiAlert>
      </Snackbar>
    </Container>
  );
}
