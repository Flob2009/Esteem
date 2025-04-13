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

  if (!mounted) return null;

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Header />
      {children}
    </ThemeProvider>
  );
}