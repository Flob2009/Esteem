'use client';

import { useEffect, useState } from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  Checkbox,
  CircularProgress,
  Container,
  FormControlLabel,
  Paper,
  Radio,
  RadioGroup,
  TextField,
  Typography,
} from '@mui/material';
import SmartToy from '@mui/icons-material/SmartToy';
import CheckCircle from '@mui/icons-material/CheckCircle';
import Replay from '@mui/icons-material/Replay';

import OrderQuestion from '@/components/question/OrderQuestion';
import MatchQuestion from '@/components/question/MatchQuestion';

export default function RunAIQuizPage() {
  const [quiz, setQuiz] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [answers, setAnswers] = useState<Record<number, any>>({});

  useEffect(() => {
    const generateQuiz = async () => {
      try {
        const setupRaw = localStorage.getItem('ai-quiz-setup');
        if (!setupRaw) throw new Error('Configuration du quiz introuvable.');
        const { theme, niveau, nbQuestions, types } = JSON.parse(setupRaw);

        const prompt = `
Tu es un générateur de quiz pédagogique.
Génère un quiz de ${nbQuestions} questions sur le thème "${theme}" pour un élève de niveau "${niveau}".
Utilise uniquement ces types : ${types.join(', ')}.

Structure JSON :
[
  { "type": "qcm", "question": "...", "options": [...], "answer": "..." },
  { "type": "choix_multiples", "question": "...", "options": [...], "answers": [...] },
  { "type": "texte_trous", "question": "...", "answer": "..." },
  { "type": "ouverte", "question": "...", "answer": "..." },
  { "type": "correspondance", "question": "...", "pairs": [{ "left": "...", "right": "..." }] },
  { "type": "ordre", "question": "...", "items": [...], "answer": [...] }
]

Ne renvoie que le tableau JSON, sans commentaire ni texte.
`;

        const response = await fetch('https://api.mistral.ai/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${process.env.NEXT_PUBLIC_MISTRAL_API_KEY}`,
          },
          body: JSON.stringify({
            model: 'mistral-medium',
            messages: [{ role: 'user', content: prompt }],
            temperature: 0.7,
          }),
        });

        const data = await response.json();
        const raw = data.choices?.[0]?.message?.content;

        if (!raw) throw new Error("Pas de contenu reçu de Mistral.");

        const cleaned = raw
          .replace(/undefined/g, '"undefined"')
          .replace(/,\s*]/g, ']')
          .replace(/,\s*}/g, '}');

        const parsedQuiz = JSON.parse(cleaned);
        if (!Array.isArray(parsedQuiz)) throw new Error('Quiz invalide');
        setQuiz(parsedQuiz);
      } catch (err: any) {
        setError(err.message || 'Erreur inconnue');
      } finally {
        setLoading(false);
      }
    };

    generateQuiz();
  }, []);

  const handleAnswer = (index: number, value: any) => {
    setAnswers((prev) => ({ ...prev, [index]: value }));
  };

  const handleFinish = () => {
    const now = new Date().toISOString();
    const formatted = quiz.map((q, index) => ({
      question: q.question,
      type: q.type,
      answer: q.answer ?? q.answers ?? q.pairs ?? q.items ?? '',
      userAnswer: answers[index],
      date: now,
    }));
    localStorage.setItem('ai-quiz-data', JSON.stringify(formatted));
    window.location.href = '/quiz/ai/result';
  };

  return (
    <Container maxWidth="md" sx={{ py: 6 }}>
      <Typography variant="h4" gutterBottom align="center" fontWeight={700}>
        <SmartToy sx={{ verticalAlign: 'middle', mr: 1 }} />
        Quiz généré par l’IA
      </Typography>

      {loading && (
        <Box textAlign="center" mt={4}>
          <CircularProgress />
          <Typography mt={2}>Génération du quiz en cours...</Typography>
        </Box>
      )}

      {error && (
        <Typography color="error" textAlign="center">
          ❌ {error}
        </Typography>
      )}

      {!loading && !error && quiz.length > 0 && (
        <Box>
          {quiz.map((q, index) => (
            <Paper key={index} elevation={2} sx={{ my: 2, p: 3, backgroundColor: '#fafafa' }}>
              <Typography variant="h6" gutterBottom>
                Question {index + 1} — {q.type}
              </Typography>
              <Typography gutterBottom>{q.question}</Typography>

              {q.type === 'qcm' && (
                <RadioGroup
                  value={answers[index] || ''}
                  onChange={(e) => handleAnswer(index, e.target.value)}
                >
                  {q.options.map((opt: string, i: number) => (
                    <FormControlLabel
                      key={i}
                      value={opt}
                      control={<Radio />}
                      label={opt}
                    />
                  ))}
                </RadioGroup>
              )}

              {q.type === 'choix_multiples' && (
                <Box>
                  {q.options.map((opt: string, i: number) => (
                    <FormControlLabel
                      key={i}
                      control={
                        <Checkbox
                          checked={answers[index]?.includes(opt) || false}
                          onChange={(e) => {
                            const current = answers[index] || [];
                            const newAnswers = e.target.checked
                              ? [...current, opt]
                              : current.filter((a: string) => a !== opt);
                            handleAnswer(index, newAnswers);
                          }}
                        />
                      }
                      label={opt}
                    />
                  ))}
                </Box>
              )}

              {(q.type === 'texte_trous' || q.type === 'ouverte') && (
                <TextField
                  fullWidth
                  placeholder="Ta réponse"
                  value={answers[index] || ''}
                  onChange={(e) => handleAnswer(index, e.target.value)}
                />
              )}

              {q.type === 'correspondance' && (
                <MatchQuestion
                  pairs={q.pairs}
                  onChange={(val) => handleAnswer(index, val)}
                />
              )}

              {q.type === 'ordre' && (
                <OrderQuestion
                  items={q.items}
                  onChange={(val) => handleAnswer(index, val)}
                />
              )}
            </Paper>
          ))}

          <Box textAlign="center" mt={4} display="flex" gap={2} flexWrap="wrap" justifyContent="center">
            <Button
              variant="contained"
              size="large"
              startIcon={<CheckCircle />}
              onClick={handleFinish}
            >
              Terminer le quiz
            </Button>

            <Button
              variant="outlined"
              color="secondary"
              startIcon={<Replay />}
              onClick={() => {
                localStorage.removeItem('ai-quiz-data');
                localStorage.removeItem('ai-quiz-setup');
                window.location.href = '/quiz/ai';
              }}
            >
              Recommencer
            </Button>
          </Box>
        </Box>
      )}
    </Container>
  );
}