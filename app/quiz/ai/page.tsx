'use client';

import { useState } from 'react';
import { Box, Button, Checkbox, Container, FormControlLabel, MenuItem, Paper, Select, TextField, Typography } from '@mui/material';
import { useRouter } from 'next/navigation';
import AutoAwesome from '@mui/icons-material/AutoAwesome';
import TrackChanges from '@mui/icons-material/TrackChanges';
import School from '@mui/icons-material/School';
import FormatListNumbered from '@mui/icons-material/FormatListNumbered';
import Psychology from '@mui/icons-material/Psychology';
import RocketLaunch from '@mui/icons-material/RocketLaunch';

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
      <Paper elevation={3} sx={{ p: 4, borderRadius: 4, backgroundColor: '#fefefe' }}>
        <Typography variant="h4" fontWeight={700} gutterBottom align="center">
          <AutoAwesome sx={{ verticalAlign: 'middle', mr: 1 }} />
          Génère ton quiz personnalisé avec l'IA
        </Typography>

        <TextField
          label="Thème du quiz"
          fullWidth
          margin="normal"
          value={theme}
          onChange={(e) => setTheme(e.target.value)}
        />

        <Typography variant="subtitle1" sx={{ mt: 3, mb: 1 }}>
          <TrackChanges sx={{ verticalAlign: 'middle', mr: 1 }} />
          Thème du quiz
        </Typography>
        <Select
          fullWidth
          value={niveau}
          onChange={(e) => setNiveau(e.target.value)}
          sx={{ mb: 2 }}
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

        <Typography variant="subtitle1" sx={{ mt: 3, mb: 1 }}>
          <Psychology sx={{ verticalAlign: 'middle', mr: 1 }} />
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
          <RocketLaunch sx={{ verticalAlign: 'middle', mr: 1 }} />
          Générer le quiz
        </Button>
      </Paper>
    </Container>
  );
}