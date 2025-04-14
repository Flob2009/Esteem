'use client';

import { useEffect, useState } from 'react';
import {
  Box,
  Button,
  Container,
  Paper,
  Typography,
} from '@mui/material';
import MenuBook from '@mui/icons-material/MenuBook';
import Replay from '@mui/icons-material/Replay';
import PictureAsPdf from '@mui/icons-material/PictureAsPdf';

export default function ManualRecapPage() {
  const [questions, setQuestions] = useState<string[]>([]);

  useEffect(() => {
    const raw = localStorage.getItem('manual-quiz-data');
    if (raw) {
      setQuestions(JSON.parse(raw));
    }
  }, []);

  const handleRetry = () => {
    localStorage.removeItem('manual-quiz-data');
    localStorage.removeItem('manual-quiz-result');
    window.location.href = '/quiz/manual';
  };

  const handleExportPDF = () => {
    window.print();
  };

  return (
    <Container maxWidth="md" sx={{ py: 6 }}>
      <Typography variant="h4" align="center" fontWeight={700} gutterBottom>
        <MenuBook sx={{ verticalAlign: 'middle', mr: 1 }} />
        Fiche de révision - Quiz manuel
      </Typography>

      {questions.length > 0 ? (
        questions.map((q, i) => (
          <Paper key={i} elevation={2} sx={{ my: 2, p: 3 }}>
            <Typography variant="h6">Question {i + 1}</Typography>
            <Typography>{q}</Typography>
          </Paper>
        ))
      ) : (
        <Typography color="text.secondary" align="center">
          Aucune question trouvée pour générer une fiche de révision.
        </Typography>
      )}

      <Box mt={4} display="flex" justifyContent="center" gap={2} flexWrap="wrap">
        <Button
          variant="contained"
          color="success"
          size="large"
          startIcon={<Replay />}
          onClick={handleRetry}
        >
          Refaire un quiz manuel
        </Button>

        <Button
          variant="contained"
          color="primary"
          size="large"
          startIcon={<PictureAsPdf />}
          onClick={handleExportPDF}
        >
          Exporter la fiche en PDF
        </Button>
      </Box>
    </Container>
  );
}
