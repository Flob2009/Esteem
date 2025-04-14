'use client';

import { Container, Typography, Divider, Box } from '@mui/material';

export default function AboutPage() {
  return (
    <Container maxWidth="md" sx={{ py: 8 }}>
      <Typography variant="h3" gutterBottom fontWeight={700}>
        ℹ️ À propos de Esteem
      </Typography>

      <Typography variant="body1" sx={{ mb: 4 }}>
        Esteem est une application éducative innovante qui aide les élèves et les enseignants à créer, réaliser et analyser des quiz scolaires de façon interactive.
      </Typography>

      <Divider sx={{ my: 4 }} />

      <Typography variant="h5" gutterBottom>
        🎯 Objectifs
      </Typography>
      <Typography variant="body1" sx={{ mb: 3 }}>
        Le but d’Esteem est de faciliter la révision et l’évaluation des connaissances grâce à deux modes de quiz complémentaires :
      </Typography>

      <Box sx={{ ml: 2 }}>
        <Typography variant="body1" sx={{ mb: 1 }}>
          - 🤖 <strong>Quiz IA</strong> : générés automatiquement par l’intelligence artificielle Mistral, adaptés à un thème choisi, avec correction automatique et fiche de synthèse.
        </Typography>
        <Typography variant="body1" sx={{ mb: 3 }}>
          - ✍️ <strong>Quiz manuels</strong> : créés manuellement par l'utilisateur pour personnaliser les questions et les partager facilement.
        </Typography>
      </Box>

      <Typography variant="h5" gutterBottom>
        🧩 Fonctionnalités
      </Typography>
      <ul style={{ paddingLeft: '1.2rem', marginBottom: '2rem' }}>
        <li><Typography variant="body1">Génération de quiz par thème, niveau et type de question</Typography></li>
        <li><Typography variant="body1">Correction automatique et score</Typography></li>
        <li><Typography variant="body1">Fiche de révision IA avec résumé du thème</Typography></li>
        <li><Typography variant="body1">Export PDF, partage de résultats et statistiques</Typography></li>
        <li><Typography variant="body1">Historique des quiz passés</Typography></li>
      </ul>

      <Typography variant="body2" color="text.secondary">
        Développé avec ❤️ par Flob2009 — 2025
      </Typography>
    </Container>
  );
}
