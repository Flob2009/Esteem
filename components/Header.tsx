'use client';

import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  useTheme,
  Badge,
  Menu,
  MenuItem,
  IconButton,
} from '@mui/material';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import SmartToy from '@mui/icons-material/SmartToy';
import Create from '@mui/icons-material/Create';
import BarChart from '@mui/icons-material/BarChart';
import Settings from '@mui/icons-material/Settings';
import Info from '@mui/icons-material/Info';
import AccountCircle from '@mui/icons-material/AccountCircle';
import Logout from '@mui/icons-material/Logout';
import { useSession, signOut } from 'next-auth/react';
import DashboardCustomizeIcon from '@mui/icons-material/DashboardCustomize';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

export default function Header() {
  const router = useRouter();
  const theme = useTheme();
  const [hasResults, setHasResults] = useState(false);
  const { data: session, status } = useSession();
  const isLoading = status === 'loading';
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const raw = localStorage.getItem('ai-quiz-history');
      try {
        const parsed = JSON.parse(raw || '[]');
        if (parsed.length > 0) setHasResults(true);
      } catch {
        setHasResults(false);
      }
    }
  }, []);

  return (
    <AppBar
      position="sticky"
      elevation={3}
      sx={{
        background: 'linear-gradient(to right, #6200EE, #5D6DFF)',
        color: 'white',
        zIndex: theme.zIndex.drawer + 1,
      }}
    >
      <Toolbar sx={{ display: 'flex', justifyContent: 'space-between' }}>
        {/* Logo + Dashboard */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Box
            sx={{ display: 'flex', alignItems: 'center', gap: 1, cursor: 'pointer' }}
            onClick={() => router.push('/')}
          >
            <img
              src="/logo.png"
              alt="Esteem Logo"
              style={{ width: 36, height: 36 }}
            />
            <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
              Esteem
            </Typography>
          </Box>
        </Box>

        {/* Navigation à droite */}
        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
          <Button
            onClick={() => router.push('/dashboard')}
            color="inherit"
            startIcon={<DashboardCustomizeIcon />}
            sx={{ textTransform: 'none', fontWeight: 'bold', textShadow: '0 0.5px 0.5px rgba(0,0,0,0.2)' }}
          >
            Tableau de bord
          </Button>
          <Button onClick={() => router.push('/quiz/ai')} color="inherit" sx={{ textTransform: 'none', fontWeight: 'bold', textShadow: '0 0.5px 0.5px rgba(0,0,0,0.2)' }}>
            <SmartToy sx={{ verticalAlign: 'middle', mr: 1 }} />
            S'entraîner avec l'IA
          </Button>
          {!isLoading && session ? (
            <>
              <Button onClick={() => router.push('/quiz/manual')} color="inherit" sx={{ textTransform: 'none', fontWeight: 'bold', textShadow: '0 0.5px 0.5px rgba(0,0,0,0.2)' }}>
                <Create sx={{ verticalAlign: 'middle', mr: 1 }} />
                Créer un quiz
              </Button>
              <Badge color="secondary" variant="dot" invisible={!hasResults} overlap="rectangular">
                <Button onClick={() => router.push('/quiz/history')} color="inherit" sx={{ textTransform: 'none', fontWeight: 'bold', textShadow: '0 0.5px 0.5px rgba(0,0,0,0.2)' }}>
                  <BarChart sx={{ verticalAlign: 'middle', mr: 1 }} />
                  Mes résultats
                </Button>
              </Badge>
              <IconButton color="inherit" onClick={handleMenuOpen}>
                <AccountCircle />
                <ExpandMoreIcon fontSize="small" />
              </IconButton>
              <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose}>
                <MenuItem onClick={() => { handleMenuClose(); router.push('/profile'); }}>
                  Mon compte
                </MenuItem>
                <MenuItem onClick={() => { handleMenuClose(); router.push('/dashboard/quizs-list'); }}>
                  Mes quiz créés
                </MenuItem>
                <MenuItem onClick={() => { handleMenuClose(); router.push('/settings'); }}>
                  Paramètres
                </MenuItem>
                <MenuItem onClick={() => { handleMenuClose(); signOut(); }}>
                  Se déconnecter
                </MenuItem>
              </Menu>
            </>
          ) : (
            <Button onClick={() => router.push('/login')} color="inherit" sx={{ textTransform: 'none', fontWeight: 'bold', textShadow: '0 0.5px 0.5px rgba(0,0,0,0.2)' }}>
              🔐 Connexion
            </Button>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
}