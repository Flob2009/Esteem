'use client';

import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Box,
  Button,
  Chip,
  Paper,
  Typography,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import VisibilityIcon from "@mui/icons-material/Visibility";
import FileCopyIcon from "@mui/icons-material/FileCopy";

interface Quiz {
  id: string;
  title: string;
  subject: string;
  level: string;
  classLevel: string;
  questions: { id: string }[];
}

export default function QuizListItem({ quiz }: { quiz: Quiz }) {
  const router = useRouter();

  const handleDelete = async () => {
    const confirmed = confirm("Voulez-vous vraiment supprimer ce quiz ?");
    if (!confirmed) return;
    await fetch(`/api/manual-quiz/delete?id=${quiz.id}`, { method: "DELETE" });
    router.refresh();
  };

  const handleDuplicate = async () => {
    const confirmed = confirm("Voulez-vous dupliquer ce quiz ?");
    if (!confirmed) return;
    await fetch(`/api/manual-quiz/duplicate?id=${quiz.id}`, { method: "POST" });
    router.refresh();
  };

  return (
    <Paper
      sx={{ p: 3, my: 2, borderLeft: "6px solid #6200EE" }}
      elevation={3}
    >
      <Typography variant="h6">{quiz.title}</Typography>
      <Typography variant="body2" color="text.secondary">
        {quiz.subject} • {quiz.level} • {quiz.classLevel}
      </Typography>
      <Chip
        label={`${quiz.questions.length} question${
          quiz.questions.length > 1 ? "s" : ""
        }`}
        color="secondary"
        size="small"
        sx={{ mt: 1 }}
      />
      <Box sx={{ display: "flex", gap: 2, mt: 2 }}>
        <Link href={`/quiz/manual/run/${quiz.id}`}>
          <Button
            variant="outlined"
            color="primary"
            startIcon={<VisibilityIcon />}
          >
            Voir
          </Button>
        </Link>
        <Link href={`/quiz/manual/edit/${quiz.id}`}>
          <Button
            variant="outlined"
            color="warning"
            startIcon={<EditIcon />}
          >
            Modifier
          </Button>
        </Link>
        <Button
          variant="outlined"
          color="secondary"
          startIcon={<FileCopyIcon />}
          onClick={handleDuplicate}
        >
          Dupliquer
        </Button>
        <Button
          variant="outlined"
          color="error"
          startIcon={<DeleteIcon />}
          onClick={handleDelete}
        >
          Supprimer
        </Button>
      </Box>
    </Paper>
  );
}
