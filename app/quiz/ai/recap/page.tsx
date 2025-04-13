'use client';

import { useEffect, useState } from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  Container,
  Typography,
} from '@mui/material';

export default function RecapPage() {
  const [content, setContent] = useState('');
  const [theme, setTheme] = useState('');
  const [niveau, setNiveau] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);

    const fetchRecap = async () => {
      try {
        const recapRaw = localStorage.getItem('ai-quiz-recap');
        if (!recapRaw) throw new Error('Aucun thème à réviser trouvé.');

        const { theme, niveau } = JSON.parse(recapRaw);
        setTheme(theme);
        setNiveau(niveau);

        const prompt = `
Tu es un assistant pédagogique pour un élève de niveau "${niveau}".
Rédige une fiche de révision claire et synthétique sur le thème : ${theme}.

Structure-la en sections comme :
**Définition simple :**
Les fractions sont...

**Exemples :**
1/2 + 1/2 = 1

Inclue :
- Une définition simple
- Les règles importantes à connaître
- Des exemples concrets
- Des erreurs fréquentes à éviter
- Et 1 ou 2 liens YouTube en français (format https://...)

⚠️ N'utilise pas de guillemets autour des contenus. Ne fais aucune introduction.
Réponds directement avec une fiche en texte brut.
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
        if (!raw) throw new Error('Réponse vide de Mistral.');

        setContent(raw);
      } catch (err: any) {
        setError(err.message || 'Erreur inconnue');
      } finally {
        setLoading(false);
      }
    };

    fetchRecap();
  }, []);

  const handleRetry = () => {
    const recapRaw = localStorage.getItem('ai-quiz-recap');
    if (recapRaw) {
      const { theme, niveau } = JSON.parse(recapRaw);
      const newSetup = {
        theme,
        niveau,
        nbQuestions: 5,
        types: ['qcm', 'ouverte'],
      };
      localStorage.setItem('ai-quiz-setup', JSON.stringify(newSetup));
      window.location.href = '/quiz/ai/run';
    }
  };

  const handleExportPDF = () => {
    window.print();
  };

  if (!mounted) return null;

  if (loading) {
    return (
      <Container maxWidth="md" sx={{ py: 6, textAlign: 'center' }}>
        <CircularProgress />
        <Typography mt={2}>Génération de la fiche de révision...</Typography>
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="sm" sx={{ py: 6, textAlign: 'center' }}>
        <Typography color="error">{error}</Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="md" sx={{ py: 6 }}>
      <Typography variant="h4" gutterBottom>
        📚 Fiche de révision
      </Typography>
      <Typography variant="h6" gutterBottom>
        Thème : <strong>{theme}</strong> — Niveau : <strong>{niveau}</strong>
      </Typography>

      <Card id="fiche-revision" sx={{ my: 4 }}>
        <CardContent>
          {content.split('\n').map((line, i) => {
            const trimmed = line.trim();

            // ✅ Titre en gras (**Titre**)
            if (/^\*\*(.+)\*\*:?$/.test(trimmed)) {
              const title = trimmed.replace(/^\*\*(.+?)\*\*:?$/, '$1');
              return (
                <Typography key={i} variant="subtitle1" fontWeight="bold" mt={3}>
                  {title}
                </Typography>
              );
            }

            // ✅ Contenu avec lien intégré
            const parts = trimmed.split(/(https?:\/\/[^\s]+)/g);
            return (
              <Typography key={i} paragraph>
                {parts.map((part, j) =>
                  part.startsWith('http') ? (
                    <a
                      key={j}
                      href={part}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{ color: '#6200EE' }}
                    >
                      {part}
                    </a>
                  ) : (
                    <span key={j}>{part}</span>
                  )
                )}
              </Typography>
            );
          })}
        </CardContent>
      </Card>

      <Box mt={4} display="flex" justifyContent="center" gap={2} flexWrap="wrap">
        <Button
          variant="contained"
          color="success"
          size="large"
          onClick={handleRetry}
        >
          🔄 Refaire un quiz sur ce thème
        </Button>

        <Button
          variant="contained"
          color="primary"
          size="large"
          onClick={handleExportPDF}
        >
          🖨️ Exporter la fiche en PDF
        </Button>
      </Box>
    </Container>
  );
}