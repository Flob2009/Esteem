'use client';

import { useEffect, useState } from 'react';
import {
  Box,
  Button,
  Container,
  Paper,
  TextField,
  Typography
} from '@mui/material';
import QuizIcon from '@mui/icons-material/Quiz';

export default function ManualQuizRunPage() {
  const [questions, setQuestions] = useState<{ question: string }[]>([]);
  const [answers, setAnswers] = useState<string[]>([]);
  const [quizMeta, setQuizMeta] = useState<{ titre?: string; matiere?: string; cycle?: string; niveau?: string }>({});

  useEffect(() => {
    const data = localStorage.getItem('manual-quiz-data');
    if (data) {
      const parsed = JSON.parse(data);
      setQuestions(parsed.questions || []);
      setAnswers(new Array(parsed.questions.length).fill(''));
    }
    const meta = localStorage.getItem('manual-quiz-meta');
    if (meta) {
      setQuizMeta(JSON.parse(meta));
    }
  }, []);

  const handleChange = (index: number, value: string) => {
    const updated = [...answers];
    updated[index] = value;
    setAnswers(updated);
  };

  const handleSubmit = () => {
    const result = questions.map((q, i) => ({
      question: q.question,
      userAnswer: answers[i] || '',
    }));

    localStorage.setItem('manual-quiz-result', JSON.stringify(result));
    window.location.href = '/quiz/manual/result';
  };

  return (
    <Container maxWidth="md" sx={{ py: 6 }}>
      <Typography variant="h4" align="center" fontWeight={700} gutterBottom>
        <QuizIcon sx={{ verticalAlign: 'middle', mr: 1 }} />
        Quiz personnalisé
      </Typography>
      <Box textAlign="center" sx={{ mt: 1, mb: 3, fontSize: 14, color: 'text.secondary' }}>
        {quizMeta.titre && <Typography variant="h6" fontWeight={600}>{quizMeta.titre}</Typography>}
        <Typography variant="body2">
          {[quizMeta.matiere, quizMeta.cycle, quizMeta.niveau].filter(Boolean).join(' • ')}
        </Typography>
      </Box>

      {questions.map((q, i) => (
        <Paper key={i} elevation={3} sx={{ p: 3, my: 2 }}>
          <Typography variant="h6">{i + 1}. {q.question}</Typography>
          <TextField
            fullWidth
            placeholder="Ta réponse..."
            value={answers[i]}
            onChange={(e) => handleChange(i, e.target.value)}
            sx={{ mt: 2 }}
          />
        </Paper>
      ))}

      {questions.length > 0 && (
        <Box mt={4} textAlign="center">
          <Button
            variant="contained"
            color="primary"
            size="large"
            onClick={handleSubmit}
          >
            Valider mes réponses
          </Button>
        </Box>
      )}
    </Container>
  );
}
