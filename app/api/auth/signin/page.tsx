'use client';

import { getProviders, signIn } from 'next-auth/react';
import { useEffect, useState } from 'react';
import {
  Box,
  Button,
  Container,
  Typography,
  Card,
  CardContent,
  CircularProgress,
} from '@mui/material';
import GitHubIcon from '@mui/icons-material/GitHub';

export default function SignInPage() {
  const [providers, setProviders] = useState<any>(null);

  useEffect(() => {
    getProviders().then(setProviders);
  }, []);

  return (
    <Container maxWidth="sm" sx={{ mt: 8 }}>
      <Card elevation={3}>
        <CardContent>
          <Typography variant="h4" align="center" gutterBottom>
            Connexion à Esteem
          </Typography>
          <Typography variant="body1" align="center" sx={{ mb: 4 }}>
            Connectez-vous pour sauvegarder vos quiz et résultats.
          </Typography>

          {!providers ? (
            <Box textAlign="center">
              <CircularProgress />
            </Box>
          ) : (
            Object.values(providers).map((provider: any) => (
              <Box key={provider.name} sx={{ textAlign: 'center', mt: 2 }}>
                <Button
                  variant="contained"
                  startIcon={<GitHubIcon />}
                  onClick={() => signIn(provider.id)}
                  sx={{ px: 4, py: 1 }}
                >
                  Se connecter avec {provider.name}
                </Button>
              </Box>
            ))
          )}
        </CardContent>
      </Card>
    </Container>
  );
}