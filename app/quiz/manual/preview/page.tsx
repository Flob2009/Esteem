'use client';

import { useEffect, useState } from 'react';
import { Box, Container, Typography, Paper, Divider, Chip } from '@mui/material';
import QuizIcon from '@mui/icons-material/Quiz';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import SchoolIcon from '@mui/icons-material/School';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';

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

  const handleExportPDF = async () => {
    const quizElement = document.getElementById('quiz-preview-content');
    if (!quizElement) return;

    const canvas = await html2canvas(quizElement);
    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'px',
      format: 'a4',
    });

    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    const margin = 40;
    const contentHeight = canvas.height * (pageWidth / canvas.width);
    const totalPages = Math.ceil(contentHeight / (pageHeight - margin * 2));

    for (let page = 0; page < totalPages; page++) {
      if (page > 0) pdf.addPage();

      // En-tête personnalisée
      pdf.setFontSize(12);
      pdf.text('Nom : _______________________', margin, 30);
      pdf.text('Classe : ____________________', pageWidth / 2 + 10, 30);
      pdf.text('Date : ___________', margin, 50);
      pdf.text('Note : ___________', pageWidth / 2 + 10, 50);

      const sourceY = page * (pageHeight - margin * 2);
      const pageCanvasHeight = Math.min(pageHeight - margin * 2, contentHeight - sourceY);

      pdf.addImage(
        imgData,
        'PNG',
        0,
        70,
        pageWidth,
        contentHeight,
        undefined,
        'FAST'
      );

      // Pagination
      pdf.setFontSize(10);
      pdf.text(`Page ${page + 1} / ${totalPages}`, pageWidth - margin, pageHeight - 10, {
        align: 'right',
      });
    }

    pdf.save(`${metadata?.title || 'quiz'}.pdf`);
  };

  return (
    <Container maxWidth="md" sx={{ py: 6 }}>
      <Box id="quiz-preview-content">
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

        <Box textAlign="center" mb={3}>
          <Chip
            icon={<PictureAsPdfIcon />}
            label="Exporter en PDF"
            color="primary"
            clickable
            onClick={handleExportPDF}
            sx={{
              fontWeight: 'bold',
              fontSize: '0.9rem',
              px: 2,
              py: 1,
            }}
          />
        </Box>

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
      </Box>
    </Container>
  );
}
