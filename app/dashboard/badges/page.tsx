'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Container, Typography, Box, Chip, Stack } from '@mui/material';

export default function BadgesPage() {
  const { status } = useSession();
  const router = useRouter();
  const [badges, setBadges] = useState<Array<{ emoji: string; label: string }>>([]);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
    }

    if (status === 'authenticated') {
      fetch('/api/user/all-badges')
        .then((res) => res.json())
        .then((data) => setBadges(data || []));
    }
  }, [status, router]);

  return (
    <Container maxWidth="sm" sx={{ py: 6 }}>
      <Typography variant="h5" fontWeight="bold" mb={3}>
        🏅 Mes badges débloqués
      </Typography>

      {badges.length === 0 ? (
        <Typography variant="body2" color="text.secondary">
          Aucun badge débloqué pour le moment.
        </Typography>
      ) : (
        <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
          {badges.map((badge, i) => (
            <Chip key={i} label={`${badge.emoji} ${badge.label}`} color="primary" />
          ))}
        </Stack>
      )}
    </Container>
  );
}
