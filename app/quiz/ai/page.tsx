'use client';

import { useState } from 'react';
import { Box, Button, Checkbox, Container, FormControlLabel, MenuItem, Select, TextField, Typography } from '@mui/material';
import { useRouter } from 'next/navigation';

const questionTypes = [
  { label: 'QCM', value: 'qcm' },
  { label: 'Texte à trous', value: 'texte_trou' },
  { label: 'Choix multiples', value: 'choix_multiples' },
  { label: 'Faire correspondre', value: 'correspondance' },
  { label: 'Mettre dans l’ordre', value: 'ordre' },
  { label: 'Question ouverte', value: 'ouverte' },
];

export default function AIQuizSetupPage() {
  const router = useRouter();
  const [theme, setTheme] = useState('');
  const [niveau, setNiveau] = useState('collège');
  const [nbQuestions, setNbQuestions] = useState(5);
  const [types, setTypes] = useState<string[]>([]);

  const handleTypeChange = (value: string) => {
    setTypes((prev) =>
      prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value]
    );
  };

  const handleGenerate = () => {
    const quizParams = {
      theme,
      niveau,
      nbQuestions,
      types,
    };

    localStorage.setItem('ai-quiz-setup', JSON.stringify(quizParams));
    router.push('/quiz/ai/run');
  };

  return (
    <Container maxWidth="sm" sx={{ py: 6 }}>
      <Typography variant="h4" gutterBottom>
        Créer un quiz IA
      </Typography>

      <TextField
        label="Thème du quiz"
        fullWidth
        margin="normal"
        value={theme}
        onChange={(e) => setTheme(e.target.value)}
      />

      <Select
        fullWidth
        value={niveau}
        onChange={(e) => setNiveau(e.target.value)}
        label="Niveau scolaire"
        sx={{ my: 2 }}
      >
        <MenuItem value="primaire">Primaire</MenuItem>
        <MenuItem value="collège">Collège</MenuItem>
        <MenuItem value="lycée">Lycée</MenuItem>
        <MenuItem value="université">Université</MenuItem>
      </Select>

      <TextField
        label="Nombre de questions"
        type="number"
        fullWidth
        margin="normal"
        value={nbQuestions}
        onChange={(e) => setNbQuestions(parseInt(e.target.value))}
        inputProps={{ min: 1, max: 20 }}
      />

      <Typography variant="h6" sx={{ mt: 3 }}>
        Types de questions
      </Typography>
      <Box>
        {questionTypes.map(({ label, value }) => (
          <FormControlLabel
            key={value}
            control={
              <Checkbox
                checked={types.includes(value)}
                onChange={() => handleTypeChange(value)}
              />
            }
            label={label}
          />
        ))}
      </Box>

      <Button
        variant="contained"
        fullWidth
        sx={{ mt: 4 }}
        disabled={!theme || types.length === 0}
        onClick={handleGenerate}
      >
        Générer le quiz
      </Button>
    </Container>
  );
}