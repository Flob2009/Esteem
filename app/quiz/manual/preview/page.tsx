'use client';

import { useEffect, useState } from 'react';
import { Box, Container, Typography, Paper, Divider, Chip } from '@mui/material';
import QuizIcon from '@mui/icons-material/Quiz';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import SchoolIcon from '@mui/icons-material/School';

interface ManualQuestion {
  type: string;
  question: string;
  options?: string[];
  correctIndex?: number;
  correctAnswers?: boolean[];
  expectedAnswer?: string;
  difficulty?: string;
}

interface QuizMetadata {
  title?: string;
  subject?: string;
  level?: string;
}

export default function ManualQuizPreviewPage() {
  const [questions, setQuestions] = useState<ManualQuestion[]>([]);
  const [metadata, setMetadata] = useState<QuizMetadata | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem('manual-quiz-preview');
    if (stored) {
      const parsed = JSON.parse(stored);
      setQuestions(parsed.questions || []);
      setMetadata({
        title: parsed.title,
        subject: parsed.subject,
        level: parsed.level,
      });
    }
  }, []);

  return (
    <Container maxWidth="md" sx={{ py: 6 }}>
      <Typography
        variant="h3"
        align="center"
        fontWeight="bold"
        sx={{
          mb: 4,
          background: 'linear-gradient(to right, #6200EE, #5D6DFF)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
        }}
      >
        Aperçu du Quiz Personnalisé
      </Typography>

      {metadata && (
        <Paper elevation={3} sx={{ p: 3, mb: 4, borderRadius: 3 }}>
          <Typography variant="h5" gutterBottom display="flex" alignItems="center" gap={1}>
            <QuizIcon color="primary" /> {metadata.title}
          </Typography>
          <Box display="flex" gap={2} flexWrap="wrap">
            {metadata.subject && (
              <Chip icon={<MenuBookIcon />} label={`Matière : ${metadata.subject}`} color="info" />
            )}
            {metadata.level && (
              <Chip icon={<SchoolIcon />} label={`Niveau : ${metadata.level}`} color="success" />
            )}
          </Box>
        </Paper>
      )}

      {questions.map((q, index) => (
        <Paper
          key={index}
          elevation={2}
          sx={{
            p: 3,
            mb: 3,
            borderLeft: `6px solid ${
              q.type === 'qcm'
                ? '#4caf50'
                : q.type === 'choix_multiples'
                ? '#ff9800'
                : q.type === 'correspondance'
                ? '#2196f3'
                : q.type === 'ordre'
                ? '#9c27b0'
                : '#757575'
            }`,
            borderRadius: 2,
            backgroundColor: '#fafafa',
          }}
        >
          <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
            {index + 1}. {q.question}
          </Typography>
          <Divider sx={{ my: 1 }} />
          {q.type === 'qcm' &&
            q.options?.map((opt, i) => (
              <Typography
                key={i}
                variant="body2"
                sx={{ color: i === q.correctIndex ? 'green' : 'text.secondary' }}
              >
                {i === q.correctIndex ? '✔️ Réponse correcte :' : '▫️'} {opt}
              </Typography>
            ))}
          {q.type === 'choix_multiples' &&
            q.options?.map((opt, i) => (
              <Typography
                key={i}
                variant="body2"
                sx={{ color: q.correctAnswers?.[i] ? 'green' : 'text.secondary' }}
              >
                {q.correctAnswers?.[i] ? '☑️ Réponse correcte :' : '☐'} {opt}
              </Typography>
            ))}
          {q.type === 'correspondance' &&
            q.options?.map((_, i) =>
              i % 2 === 0 ? (
                <Typography key={i} variant="body2">
                  ↔️ {q.options?.[i]} ⟷ {q.options?.[i + 1]}
                </Typography>
              ) : null
            )}
          {q.type === 'ordre' &&
            q.options?.map((opt, i) => (
              <Typography key={i} variant="body2">
                {i + 1}. {opt}
              </Typography>
            ))}
          {q.type === 'texte_trous' && (
            <Typography variant="body2" color="text.secondary">
              Réponse attendue : {q.expectedAnswer || 'À compléter dans le texte'}
            </Typography>
          )}
          {q.type === 'ouverte' && (
            <Typography variant="body2" color="text.secondary">
              Réponse attendue : {q.expectedAnswer}
            </Typography>
          )}
        </Paper>
      ))}
    </Container>
  );
}
