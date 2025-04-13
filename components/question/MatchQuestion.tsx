'use client';

import {
  Box,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Typography,
} from '@mui/material';
import { useEffect, useState } from 'react';

type Pair = {
  left: string;
  right: string;
};

type Props = {
  pairs: Pair[];
  onChange: (selected: Record<string, string>) => void;
};

export default function MatchQuestion({ pairs, onChange }: Props) {
  const [shuffledRights, setShuffledRights] = useState<string[]>([]);
  const [selections, setSelections] = useState<Record<string, string>>({});

  useEffect(() => {
    const rights = pairs.map((p) => p.right);
    const shuffled = [...rights].sort(() => 0.5 - Math.random());
    setShuffledRights(shuffled);
  }, [pairs]);

  const handleChange = (left: string, right: string) => {
    const updated = { ...selections, [left]: right };
    setSelections(updated);
    onChange(updated);
  };

  return (
    <Box display="flex" flexDirection="column" gap={2}>
      {pairs.map(({ left }) => (
        <FormControl key={left} fullWidth>
          <InputLabel>Associer à : {left}</InputLabel>
          <Select
            value={selections[left] || ''}
            label={`Associer à : ${left}`}
            onChange={(e) => handleChange(left, e.target.value)}
          >
            {shuffledRights.map((right) => (
              <MenuItem key={right} value={right}>
                {right}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      ))}
    </Box>
  );
}