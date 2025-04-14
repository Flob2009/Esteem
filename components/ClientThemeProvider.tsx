'use client';

import { ThemeProvider, CssBaseline } from '@mui/material';
import { ReactNode, useEffect, useState } from 'react';
import theme from '@/theme';
import Header from '@/components/Header';

export default function ClientThemeProvider({ children }: { children: ReactNode }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div style={{ height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <CssBaseline />
        <span style={{ fontFamily: 'Poppins, sans-serif', fontSize: '1.2rem' }}>Chargement de l'application...</span>
      </div>
    );
  }

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Header />
      {children}
    </ThemeProvider>
  );
}