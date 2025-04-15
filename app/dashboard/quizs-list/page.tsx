'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Box, Button, Container, Paper, Typography, Chip, TextField } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import EditNoteIcon from '@mui/icons-material/EditNote';
import VisibilityIcon from '@mui/icons-material/Visibility';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import FilterAltIcon from '@mui/icons-material/FilterAlt';
import FilterListIcon from '@mui/icons-material/FilterList';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

import QuizListItem from '@/components/dashboard/QuizListItem';

export default function QuizsListPage() {
  const [quizzes, setQuizzes] = useState<any[]>([]);
  const [stats, setStats] = useState({ total: 0, average: 0, lastDate: '-' });
  const [filters, setFilters] = useState({
    subject: '',
    level: '',
    difficulty: '',
    dateFrom: '',
    dateTo: '',
  });

  useEffect(() => {
    const fetchQuizzes = async () => {
      try {
        const res = await fetch('/api/dashboard/quizs');
        const data = await res.json();
        setQuizzes(data);

        const totalQuestions = data.reduce((acc, q) => acc + (q.questions?.length || 0), 0);
        const averageQuestions = data.length ? Math.round(totalQuestions / data.length) : 0;
        const dates = data
          .map((q) => new Date(q.createdAt))
          .filter((d) => d instanceof Date && !isNaN(d.getTime()));

        const lastCreatedDate =
          dates.length > 0 ? format(new Date(Math.max(...dates.map((d) => d.getTime()))), 'd MMMM yyyy', { locale: fr }) : '-';
        setStats({ total: data.length, average: averageQuestions, lastDate: lastCreatedDate });
      } catch (error) {
        console.error('Erreur lors du chargement des quiz :', error);
      }
    };
    fetchQuizzes();
  }, []);

  const filteredQuizzes = quizzes.filter((q) => {
    const matchesSubject = !filters.subject || q.subject === filters.subject;
    const matchesLevel = !filters.level || q.level === filters.level;
    const matchesDifficulty = !filters.difficulty || q.questions?.some((question) => question.difficulty === filters.difficulty);

    let createdAt: Date | null = null;
    try {
      createdAt = q.createdAt ? new Date(q.createdAt) : null;
      if (createdAt?.toString() === 'Invalid Date') createdAt = null;
    } catch {
      createdAt = null;
    }

    const matchesDateFrom = !filters.dateFrom || (createdAt && !isNaN(createdAt.getTime()) && createdAt >= new Date(filters.dateFrom));
    const matchesDateTo = !filters.dateTo || (createdAt && !isNaN(createdAt.getTime()) && createdAt <= new Date(filters.dateTo));

    return matchesSubject && matchesLevel && matchesDifficulty && matchesDateFrom && matchesDateTo;
  });

  return (
    <Container maxWidth="md" sx={{ py: 8 }}>
      {quizzes.length > 0 && (
        <Paper elevation={2} sx={{ mb: 4, p: 2, borderRadius: 2 }}>
          <Typography variant="h6" gutterBottom fontWeight="bold">📊 Statistiques</Typography>
          <Box display="flex" justifyContent="space-around" flexWrap="wrap" gap={2}>
            <Chip label={`Total : ${stats.total}`} color="primary" />
            <Chip label={`Moyenne : ${stats.average} questions`} color="secondary" />
            <Chip label={`Dernier : ${stats.lastDate}`} color="default" />
          </Box>
        </Paper>
      )}
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
        <Typography
          variant="h4"
          component="h1"
          align="center"
          gutterBottom
          sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1 }}
        >
          <EditNoteIcon fontSize="large" />
          Mes quiz personnalisés
        </Typography>
        <Link href="/quiz/manual">
          <Button
            variant="contained"
            startIcon={<EditIcon />}
            sx={{
              fontWeight: 'bold',
              fontSize: '0.75rem',
              borderRadius: 2,
              px: 3,
              py: 1.5,
              boxShadow: 3,
              background: 'linear-gradient(to right, #6200EE, #5D6DFF)',
              color: 'white',
              '&:hover': {
                background: 'linear-gradient(to right, #5D6DFF, #6200EE)',
              },
            }}
          >
            Créer un quiz personnalisé
          </Button>
        </Link>
      </Box>
      <Paper elevation={1} sx={{ p: 2, mb: 4, borderRadius: 2 }}>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
          <Typography variant="subtitle1" fontWeight="bold" display="flex" alignItems="center" gap={1}>
            <FilterAltIcon />
            Filtres
          </Typography>
          <Button
            variant="outlined"
            size="small"
            color="secondary"
            onClick={() =>
              setFilters({
                subject: '',
                level: '',
                difficulty: '',
                dateFrom: '',
                dateTo: '',
              })
            }
            sx={{
              borderRadius: 4,
              textTransform: 'none',
              fontWeight: 'bold',
              fontSize: '0.75rem',
              px: 2,
              py: 0.5,
            }}
          >
            Réinitialiser les filtres
          </Button>
        </Box>
        <Box display="flex" flexWrap="wrap" gap={2}>
          <TextField
            label="Matière"
            value={filters.subject}
            onChange={(e) => setFilters({ ...filters, subject: e.target.value })}
            size="small"
            sx={{ flex: '1 1 200px' }}
          />
          <TextField
            label="Niveau"
            value={filters.level}
            onChange={(e) => setFilters({ ...filters, level: e.target.value })}
            size="small"
            sx={{ flex: '1 1 200px' }}
          />
          <TextField
            label="Difficulté"
            value={filters.difficulty}
            onChange={(e) => setFilters({ ...filters, difficulty: e.target.value })}
            size="small"
            sx={{ flex: '1 1 200px' }}
          />
          <TextField
            label="Date de début"
            type="date"
            InputLabelProps={{ shrink: true }}
            value={filters.dateFrom}
            onChange={(e) => setFilters({ ...filters, dateFrom: e.target.value })}
            size="small"
            sx={{ flex: '1 1 200px' }}
          />
          <TextField
            label="Date de fin"
            type="date"
            InputLabelProps={{ shrink: true }}
            value={filters.dateTo}
            onChange={(e) => setFilters({ ...filters, dateTo: e.target.value })}
            size="small"
            sx={{ flex: '1 1 200px' }}
          />
        </Box>
      </Paper>
      <Box display="flex" justifyContent="center" mb={4}>
        <Button
          startIcon={<FilterListIcon />}
          sx={{
            background: 'linear-gradient(to right, #6200EE, #5D6DFF)',
            color: 'white',
            fontWeight: 'bold',
            fontSize: '0.75rem',
            padding: '8px 20px',
            borderRadius: '30px',
            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
            textTransform: 'none',
            '&:hover': {
              background: 'linear-gradient(to right, #5D6DFF, #6200EE)',
            },
          }}
        >
          Trier par date
        </Button>
      </Box>
      {filteredQuizzes.length === 0 ? (
        <Typography my={2}>Vous n'avez encore créé aucun quiz.</Typography>
      ) : (
        filteredQuizzes.map((quiz) => (
          <QuizListItem key={quiz.id} quiz={quiz} />
        ))
      )}
    </Container>
  );
}