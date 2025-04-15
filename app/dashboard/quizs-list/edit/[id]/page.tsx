'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  Box,
  Button,
  Container,
  TextField,
  Typography,
  CircularProgress,
  MenuItem,
  Select,
} from '@mui/material';

export default function EditQuizPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const id = searchParams.get('id');

  const [quizData, setQuizData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [title, setTitle] = useState('');
  const [subject, setSubject] = useState('');
  const [level, setLevel] = useState('');
  const [classLevel, setClassLevel] = useState('');

  useEffect(() => {
    if (!id) return;

    const storedData = localStorage.getItem('manual-quiz-data');
    if (storedData) {
      const parsed = JSON.parse(storedData);
      setQuizData(parsed);
      setTitle(parsed.title || '');
      setSubject(parsed.subject || '');
      setLevel(parsed.level || '');
      setClassLevel(parsed.classLevel || '');
    }

    setLoading(false);
  }, [id]);

  const handleSave = () => {
    const updated = {
      ...quizData,
      title,
      subject,
      level,
      classLevel,
    };
    localStorage.setItem('manual-quiz-data', JSON.stringify(updated));
    alert('Modifications enregistrées !');
    router.push('/dashboard/quizs-list');
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="50vh">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="md" sx={{ py: 6 }}>
      <Typography variant="h4" gutterBottom>
        ✏️ Modifier le quiz
      </Typography>

      <TextField
        fullWidth
        label="Titre"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        sx={{ mb: 3 }}
      />

      <Select
        fullWidth
        value={subject}
        onChange={(e) => setSubject(e.target.value)}
        displayEmpty
        sx={{ mb: 3 }}
      >
        <MenuItem value="" disabled>Matière</MenuItem>
        <MenuItem value="Mathématiques">Mathématiques</MenuItem>
        <MenuItem value="Physique/Chimie">Physique/Chimie</MenuItem>
        <MenuItem value="Histoire et géographie">Histoire et géographie</MenuItem>
        <MenuItem value="SVT">SVT</MenuItem>
        <MenuItem value="Français">Français</MenuItem>
        <MenuItem value="Anglais">Anglais</MenuItem>
        <MenuItem value="Espagnol">Espagnol</MenuItem>
        <MenuItem value="Economie">Économie</MenuItem>
        <MenuItem value="SES">SES</MenuItem>
        <MenuItem value="SNT">SNT</MenuItem>
        <MenuItem value="Enseignement professionnel">Enseignement professionnel</MenuItem>
        <MenuItem value="Enseignement scientifique">Enseignement scientifique</MenuItem>
        <MenuItem value="Autre">Autre</MenuItem>
      </Select>

      <Select
        fullWidth
        value={level}
        onChange={(e) => setLevel(e.target.value)}
        displayEmpty
        sx={{ mb: 3 }}
      >
        <MenuItem value="" disabled>Cycle</MenuItem>
        <MenuItem value="Collège">Collège</MenuItem>
        <MenuItem value="Lycée">Lycée</MenuItem>
        <MenuItem value="Supérieur">Supérieur</MenuItem>
      </Select>

      <Select
        fullWidth
        value={classLevel}
        onChange={(e) => setClassLevel(e.target.value)}
        displayEmpty
        sx={{ mb: 4 }}
      >
        <MenuItem value="" disabled>Niveau</MenuItem>
        <MenuItem value="6ème">6ème</MenuItem>
        <MenuItem value="5ème">5ème</MenuItem>
        <MenuItem value="4ème">4ème</MenuItem>
        <MenuItem value="3ème">3ème</MenuItem>
        <MenuItem value="CAP">CAP</MenuItem>
        <MenuItem value="2nde">2nde</MenuItem>
        <MenuItem value="1ère">1ère</MenuItem>
        <MenuItem value="Terminale">Terminale</MenuItem>
        <MenuItem value="Général">Général</MenuItem>
        <MenuItem value="Technologique">Technologique</MenuItem>
        <MenuItem value="Professionnel">Professionnel</MenuItem>
        <MenuItem value="BTS">BTS</MenuItem>
        <MenuItem value="Licence">Licence</MenuItem>
        <MenuItem value="Master">Master</MenuItem>
      </Select>

      <Button variant="contained" color="primary" fullWidth onClick={handleSave}>
        💾 Enregistrer les modifications
      </Button>
    </Container>
  );
}
