'use client';

import {
  Button,
  Container,
  Typography,
  Box,
  TextField,
  Divider,
  Paper,
} from '@mui/material';
import { signIn } from 'next-auth/react';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loginMessage, setLoginMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  return (
    <Container maxWidth="sm" sx={{ py: 6 }}>
      <Paper elevation={4} sx={{ p: 4, borderRadius: 3 }}>
        <Typography
          variant="h4"
          align="center"
          fontWeight="bold"
          gutterBottom
          sx={{
            background: 'linear-gradient(to right, #6200EE, #5D6DFF)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}
        >
          Connexion à Esteem
        </Typography>

        <Typography variant="body1" color="text.secondary" align="center" mb={3}>
          Connecte-toi pour retrouver tes quiz, résultats et fiches.
        </Typography>

        <Box component="form" noValidate autoComplete="off" sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <TextField
            label="Adresse e-mail"
            type="email"
            value={email}
            fullWidth
            onChange={(e) => setEmail(e.target.value)}
          />
          <TextField
            label="Mot de passe"
            type="password"
            value={password}
            fullWidth
            onChange={(e) => setPassword(e.target.value)}
          />
          {loginMessage && (
            <Typography
              variant="body2"
              color="success.main"
              align="center"
              sx={{ mt: 1, fontWeight: 'bold' }}
            >
              {loginMessage} — redirection...
            </Typography>
          )}
          <Button
            variant="contained"
            color="primary"
            size="large"
            fullWidth
            onClick={async () => {
              setLoading(true);
              const result = await signIn('credentials', {
                redirect: false,
                email,
                password,
                callbackUrl: '/dashboard',
              });

              if (result?.ok) {
                setLoginMessage('Connexion réussie');
                router.push('/dashboard');
              } else {
                setLoginMessage('');
                alert('Erreur : ' + (result?.error || 'Connexion échouée'));
              }

              setLoading(false);
            }}
          >
            Connexion par e-mail
          </Button>
        </Box>

        <Divider sx={{ my: 4 }}>ou</Divider>

        <Box display="flex" flexDirection="column" gap={2}>
          <Button
            variant="contained"
            color="inherit"
            size="large"
            onClick={() => signIn('github')}
          >
            Se connecter avec GitHub
          </Button>
          <Button
            variant="outlined"
            color="secondary"
            size="large"
            onClick={() => signIn('google')}
          >
            Se connecter avec Google
          </Button>
        </Box>
        <Box mt={3} textAlign="center">
          <Typography variant="body2">
            Pas encore de compte ?{' '}
            <a href="/register" style={{ color: '#6200EE', textDecoration: 'underline' }}>
              Créer un compte
            </a>
          </Typography>
        </Box>
      </Paper>
    </Container>
  );
}