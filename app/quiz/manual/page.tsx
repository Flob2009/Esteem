'use client';

import {
  Box,
  Button,
  Container,
  TextField,
  Typography,
  Paper,
  IconButton,
  Chip,
} from '@mui/material';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import { useState } from 'react';
import { Delete } from '@mui/icons-material';
import SmartToyIcon from '@mui/icons-material/SmartToy';
import ListAltIcon from '@mui/icons-material/ListAlt';
import FormControlLabel from '@mui/material/FormControlLabel';
import Radio from '@mui/material/Radio';
import QuizIcon from '@mui/icons-material/Quiz';
import CheckBoxIcon from '@mui/icons-material/CheckBox';
import LinkIcon from '@mui/icons-material/Link';
import FormatListNumberedIcon from '@mui/icons-material/FormatListNumbered';
import EditNoteIcon from '@mui/icons-material/EditNote';
import DrawIcon from '@mui/icons-material/Draw';
import VisibilityIcon from '@mui/icons-material/Visibility';
import Edit from '@mui/icons-material/Edit';
import Save from '@mui/icons-material/Save';
import CalculateRoundedIcon from '@mui/icons-material/CalculateRounded';

interface ManualQuestion {
  type: string;
  question: string;
  options?: string[];
  correctIndex?: number;
  correctAnswers?: boolean[];
  expectedAnswer?: string;
  difficulty?: 'facile' | 'moyen' | 'difficile';
  points?: number;
}

export default function ManualQuizPage() {
  const [questions, setQuestions] = useState<ManualQuestion[]>([]);
  const [quizTitle, setQuizTitle] = useState('');
  const [newQuestion, setNewQuestion] = useState('');
  const [newOptions, setNewOptions] = useState<any>({});
  const [type, setType] = useState('ouverte');
  const [selectedDifficulty, setSelectedDifficulty] = useState<'facile' | 'moyen' | 'difficile'>('moyen');
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [subject, setSubject] = useState('');
  const [level, setLevel] = useState('');
  const [classLevel, setClassLevel] = useState('');

  const handleAddQuestion = () => {
    if (newQuestion.trim()) {
      const updated = [...questions];

      const correctIndex = newOptions.correctIndex ?? 0;
      const correctAnswers = newOptions.correctAnswers ?? [];
      const expectedAnswer = newOptions.expectedAnswer ?? '';

      const questionData: ManualQuestion = {
        type,
        question: newQuestion.trim(),
        difficulty: selectedDifficulty,
        points: newOptions.points ?? 1,
        ...(newOptions.options?.length > 0 ? { options: newOptions.options } : {}),
        ...(type === 'qcm' ? { correctIndex } : {}),
        ...(type === 'choix_multiples' ? { correctAnswers } : {}),
        ...(type === 'ouverte' || type === 'texte_trous' ? { expectedAnswer } : {}),
      };

      if (editingIndex !== null) {
        updated[editingIndex] = questionData;
        setEditingIndex(null);
      } else {
        updated.push(questionData);
      }

      setQuestions(updated);
      setNewQuestion('');
      setNewOptions({});
      setType('ouverte');
    }
  };

  const handleDeleteQuestion = (index: number) => {
    const updated = [...questions];
    updated.splice(index, 1);
    setQuestions(updated);
  };

  const handleEdit = (index: number) => {
    const q = questions[index];
    setType(q.type);
    setNewQuestion(q.question);
    setSelectedDifficulty(q.difficulty || 'moyen');
    setNewOptions({
      options: q.options || [],
      correctIndex: q.correctIndex,
      correctAnswers: q.correctAnswers,
      expectedAnswer: q.expectedAnswer,
      points: q.points,
    });
    setEditingIndex(index);
  };

  const generateOptionsWithAI = async () => {
    try {
      const response = await fetch('/api/ai-options', {
        method: 'POST',
        body: JSON.stringify({ question: newQuestion, type }),
      });
      const data = await response.json();
 
      if (!data || !Array.isArray(data.options)) {
        console.warn('Réponse IA vide ou mal formatée :', data);
        return;
      }

      if (type === 'qcm') {
        const { options, correctIndex } = data;
        setNewOptions((prevOptions: any) => ({
          ...(prevOptions || {}),
          options,
          correctIndex,
        }));
      }

      if (type === 'choix_multiples') {
        const { options, correctAnswers } = data;
        setNewOptions((prevOptions: any) => ({
          ...(prevOptions || {}),
          options,
          correctAnswers,
        }));
      }
    } catch (err) {
      console.error('Erreur lors de la génération IA des options :', err);
    }
  };

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
        ✍️ Créer un quiz personnalisé
      </Typography>

      <Paper elevation={3} sx={{ p: 4, borderRadius: 3, mb: 4 }}>
        <TextField
          label="Titre du questionnaire"
          value={quizTitle}
          onChange={(e) => setQuizTitle(e.target.value)}
          fullWidth
          sx={{ mb: 2 }}
        />
 
        <Box display="flex" flexDirection="column" gap={2} mb={2}>
          <Select
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            displayEmpty
            fullWidth
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
            <MenuItem value="Sciences économiques et sociales">SES</MenuItem>
            <MenuItem value="Sciences numériques et technologie">SNT</MenuItem>
            <MenuItem value="Enseignement professionnel">Enseignement professionnel</MenuItem>
            <MenuItem value="Enseignement scientifique">Enseignement scientifique</MenuItem>
            <MenuItem value="Autre">Autre</MenuItem>
          </Select>
 
          <Select
            value={level}
            onChange={(e) => setLevel(e.target.value)}
            displayEmpty
            fullWidth
          >
            <MenuItem value="" disabled>Cycle</MenuItem>
            <MenuItem value="Collège">Collège</MenuItem>
            <MenuItem value="Lycée">Lycée</MenuItem>
            <MenuItem value="Supérieur">Supérieur</MenuItem>
          </Select>
 
          <Select
            value={classLevel}
            onChange={(e) => setClassLevel(e.target.value)}
            displayEmpty
            fullWidth
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
        </Box>
      </Paper>

      <Paper elevation={3} sx={{ p: 4, borderRadius: 3, mb: 4 }}>
        {/* Removed the title TextField from here since it's now in the upper Paper */}

        <TextField
          label="Énoncé de la question"
          value={newQuestion}
          onChange={(e) => setNewQuestion(e.target.value)}
          fullWidth
          sx={{ mb: 2 }}
        />

        <Box display="flex" gap={2} mb={2} flexDirection={{ xs: 'column', sm: 'row' }}>
          <Select
            value={type}
            onChange={(e) => setType(e.target.value)}
            sx={{ width: '220px' }}
          >
            <MenuItem value="ouverte">Question ouverte</MenuItem>
            <MenuItem value="texte_trous">Texte à trous</MenuItem>
            <MenuItem value="qcm">QCM</MenuItem>
            <MenuItem value="choix_multiples">Choix multiples</MenuItem>
            <MenuItem value="correspondance">Correspondance</MenuItem>
            <MenuItem value="ordre">Ordre</MenuItem>
          </Select>

          <TextField
            type="number"
            label="Barème (points)"
            value={newOptions.points || ''}
            onChange={(e) =>
              setNewOptions({ ...newOptions, points: Number(e.target.value) })
            }
            sx={{ width: '100%' }}
          />
 
          <Box display="flex" alignItems="center" gap={1} mt={1}>
            <Typography variant="body2" sx={{ whiteSpace: 'nowrap' }}>
              Difficulté (optionnel)
            </Typography>
            <Box display="flex" gap={1}>
              {['facile', 'moyen', 'difficile'].map((level) => (
                <Chip
                  key={level}
                  label={level.charAt(0).toUpperCase() + level.slice(1)}
                  color={
                    level === selectedDifficulty
                      ? level === 'facile'
                        ? 'success'
                        : level === 'moyen'
                        ? 'warning'
                        : 'error'
                      : 'default'
                  }
                  variant={level === selectedDifficulty ? 'filled' : 'outlined'}
                  onClick={() => setSelectedDifficulty(level as any)}
                  sx={{ cursor: 'pointer' }}
                />
              ))}
            </Box>
          </Box>
        </Box>

        {type === 'qcm' && (
          <Box sx={{ mb: 2 }}>
            {[0, 1, 2].map((index) => (
              <Box key={index} display="flex" alignItems="center" gap={1} mb={1}>
                <Radio
                  checked={newOptions.correctIndex === index}
                  onChange={() => setNewOptions({ ...newOptions, correctIndex: index })}
                />
                <TextField
                  fullWidth
                  label={`Réponse ${index + 1}`}
                  value={newOptions.options?.[index] || ''}
                  onChange={(e) => {
                    const options = [...(newOptions.options || [])];
                    options[index] = e.target.value;
                    setNewOptions({ ...newOptions, options });
                  }}
                />
              </Box>
            ))}
            <Button
              variant="outlined"
              startIcon={<SmartToyIcon />}
              onClick={generateOptionsWithAI}
              sx={{ mt: 1 }}
            >
              Générer les réponses avec l’IA
            </Button>
          </Box>
        )}

        {type === 'choix_multiples' && (
          <Box sx={{ mb: 2 }}>
            {[0, 1, 2].map((index) => (
              <Box key={index} display="flex" alignItems="center" gap={1} mb={1}>
                <input
                  type="checkbox"
                  checked={newOptions.correctAnswers?.[index] || false}
                  onChange={(e) => {
                    const correctAnswers = [...(newOptions.correctAnswers || [false, false, false])];
                    correctAnswers[index] = e.target.checked;
                    setNewOptions({ ...newOptions, correctAnswers });
                  }}
                />
                <TextField
                  fullWidth
                  label={`Réponse ${index + 1}`}
                  value={newOptions.options?.[index] || ''}
                  onChange={(e) => {
                    const options = [...(newOptions.options || [])];
                    options[index] = e.target.value;
                    setNewOptions({ ...newOptions, options });
                  }}
                />
              </Box>
            ))}
            <Button
              variant="outlined"
              startIcon={<SmartToyIcon />}
              onClick={generateOptionsWithAI}
              sx={{ mt: 1 }}
            >
              Générer les réponses avec l’IA
            </Button>
          </Box>
        )}

        {type === 'texte_trous' && (
          <Box sx={{ mb: 2 }}>
            <Typography variant="subtitle1">Réponse attendue</Typography>
            <TextField
              fullWidth
              label="Réponse attendue"
              multiline
              minRows={2}
              maxRows={6}
              value={newOptions.expectedAnswer || ''}
              onChange={(e) => setNewOptions({ ...newOptions, expectedAnswer: e.target.value })}
              sx={{ mb: 2 }}
            />
          </Box>
        )}

        {type === 'ouverte' && (
          <Box sx={{ mb: 2 }}>
            <Typography variant="subtitle1">Réponse attendue</Typography>
            <TextField
              fullWidth
              label="Réponse attendue"
              multiline
              minRows={2}
              maxRows={6}
              value={newOptions.expectedAnswer || ''}
              onChange={(e) => setNewOptions({ ...newOptions, expectedAnswer: e.target.value })}
              sx={{ mb: 2 }}
            />

            <Button
              variant="outlined"
              startIcon={<SmartToyIcon />}
              onClick={async () => {
                const response = await fetch('/api/ai-answer', {
                  method: 'POST',
                  body: JSON.stringify({ question: newQuestion }),
                });
                const data = await response.json();
                setNewOptions({ ...newOptions, expectedAnswer: data.answer });
              }}
            >
              Générer la réponse avec l’IA
            </Button>
          </Box>
        )}

        {type === 'ordre' && (
          <Box sx={{ mb: 2 }}>
            <Typography variant="subtitle1">Éléments à remettre dans l’ordre</Typography>
            {[0, 1, 2].map((index) => (
              <Box key={index} display="flex" alignItems="center" gap={1} mb={1}>
                <TextField
                  fullWidth
                  label={`Élément ${index + 1}`}
                  value={newOptions.options?.[index] || ''}
                  onChange={(e) => {
                    const options = [...(newOptions.options || [])];
                    options[index] = e.target.value;
                    setNewOptions({ ...newOptions, options });
                  }}
                />
              </Box>
            ))}
          </Box>
        )}

        {type === 'correspondance' && (
          <Box sx={{ mb: 2 }}>
            {[0, 1, 2].map((index) => (
              <Box key={index} display="flex" alignItems="center" gap={1} mb={1}>
                <TextField
                  label={`Gauche ${index + 1}`}
                  fullWidth
                  value={newOptions.options?.[index * 2] || ''}
                  onChange={(e) => {
                    const options = [...(newOptions.options || [])];
                    options[index * 2] = e.target.value;
                    setNewOptions({ ...newOptions, options });
                  }}
                />
                <TextField
                  label={`Droite ${index + 1}`}
                  fullWidth
                  value={newOptions.options?.[index * 2 + 1] || ''}
                  onChange={(e) => {
                    const options = [...(newOptions.options || [])];
                    options[index * 2 + 1] = e.target.value;
                    setNewOptions({ ...newOptions, options });
                  }}
                />
              </Box>
            ))}
          </Box>
        )}

        <Button variant="contained" onClick={handleAddQuestion} fullWidth>
          {editingIndex !== null ? 'Modifier' : 'Ajouter'} la question
        </Button>
      </Paper>

      <Typography variant="h5" sx={{ mb: 2 }}>
        <ListAltIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
        Questions ajoutées
      </Typography>
      <Box
        sx={{
          mb: 3,
          p: 2,
          borderRadius: 2,
          background: 'linear-gradient(to right, #e3f2fd, #bbdefb)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <Typography variant="h6" fontWeight="bold" sx={{ color: '#0d47a1', display: 'flex', alignItems: 'center', gap: 1 }}>
          <CalculateRoundedIcon />
          Barème total du quiz : {questions.reduce((total, q) => total + (q.points ?? 1), 0)} point
          {questions.reduce((total, q) => total + (q.points ?? 1), 0) > 1 ? 's' : ''}
        </Typography>
      </Box>

      {questions.map((q, index) => (
        <Paper
          key={index}
          onClick={() => handleEdit(index)}
          sx={{
            p: 2,
            mb: 2,
            borderLeft: `6px solid ${
              q.type === 'qcm' ? '#4caf50' :
              q.type === 'choix_multiples' ? '#ff9800' :
              q.type === 'correspondance' ? '#2196f3' :
              q.type === 'ordre' ? '#9c27b0' : '#757575'
            }`,
            backgroundColor: '#f9f9f9',
            borderRadius: 2,
            transition: 'all 0.2s ease-in-out',
            '&:hover': {
              backgroundColor: '#f1f1f1',
              transform: 'scale(1.01)',
            },
          }}
        >
          <Box display="flex" flexWrap="wrap" gap={1} alignItems="center" mb={1}>
            {q.type === 'qcm' && <Chip icon={<QuizIcon />} label="QCM" color="primary" size="small" />}
            {q.type === 'choix_multiples' && <Chip icon={<CheckBoxIcon />} label="Choix multiples" color="success" size="small" />}
            {q.type === 'correspondance' && <Chip icon={<LinkIcon />} label="Correspondance" color="info" size="small" />}
            {q.type === 'ordre' && <Chip icon={<FormatListNumberedIcon />} label="Ordre" color="secondary" size="small" />}
            {q.type === 'texte_trous' && <Chip icon={<DrawIcon />} label="Texte à trous" color="warning" size="small" />}
            {q.type === 'ouverte' && <Chip icon={<EditNoteIcon />} label="Ouverte" color="default" size="small" />}
            {q.difficulty && <Chip label={q.difficulty} color={
              q.difficulty === 'facile' ? 'success' :
              q.difficulty === 'moyen' ? 'warning' :
              'error'
            } size="small" />}
          </Box>

          <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
            {q.question}
          </Typography>
          {q.expectedAnswer && (
            <Typography variant="body2" color="text.secondary">
              Réponse attendue : {q.expectedAnswer}
            </Typography>
          )}
          {q.options?.length > 0 && (
            <Typography variant="body2" color="text.secondary">
              Réponses possibles : {q.options.join(', ')}
            </Typography>
          )}
          <Typography variant="body2" color="text.secondary">
            Barème : {q.points ?? 1} point{(q.points ?? 1) > 1 ? 's' : ''}
          </Typography>

          <Box mt={1} display="flex" gap={2}>
            <Button
              size="small"
              variant="outlined"
              color="primary"
              startIcon={<Edit />}
              onClick={(e) => {
                e.stopPropagation();
                handleEdit(index);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
            >
              Modifier
            </Button>
            <Button
              size="small"
              color="error"
              onClick={(e) => {
                e.stopPropagation();
                handleDeleteQuestion(index);
              }}
            >
              Supprimer
            </Button>
          </Box>
        </Paper>
      ))}

      {questions.length > 0 && (
        <Box
          display="flex"
          gap={2}
          flexDirection={{ xs: 'column', sm: 'row' }}
          mt={2}
        >
          <Button
            variant="outlined"
            color="primary"
            fullWidth
            startIcon={<VisibilityIcon />}
            sx={{
              fontWeight: 'bold',
              borderWidth: 2,
              '&:hover': {
                backgroundColor: '#e3f2fd',
              },
            }}
            onClick={() => {
              const preview = {
                title: quizTitle,
                subject,
                level,
                classLevel,
                questions,
              };
              localStorage.setItem('manual-quiz-preview', JSON.stringify(preview));
              window.open('/quiz/manual/preview', '_blank');
            }}
          >
            Aperçu du quiz
          </Button>
          <Button
            variant="contained"
            color="success"
            onClick={() => {
              const saved = {
                title: quizTitle,
                subject,
                level,
                classLevel,
                questions,
              };
              localStorage.setItem('manual-quiz-data', JSON.stringify(saved));
              alert('Quiz sauvegardé avec succès !');
            }}
            fullWidth
            startIcon={<Save />}
            sx={{ mt: 0 }}
          >
            Sauvegarder ce quiz
          </Button>
        </Box>
      )}
    </Container>
  );
}