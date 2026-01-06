import React from 'react'
import { Box, Paper, Stack, Typography } from '@mui/material'
import type { StoredResult } from '../../storage/resultsStorage.ts'

type ResultsSectionProps = {
  results: StoredResult[]
}

export const ResultsSection: React.FC<ResultsSectionProps> = ({ results }) => {
  return (
    <Paper
      elevation={4}
      sx={{
        width: '100%',
        maxWidth: 900,
        px: { xs: 3, sm: 5, md: 6 },
        py: { xs: 3, sm: 4 },
        borderRadius: 4,
        bgcolor: 'rgba(15,23,42,0.9)',
      }}
    >
      <Typography variant="h6" textAlign="center" gutterBottom>
        Your Top Results
      </Typography>

      {results.length === 0 && (
        <Typography textAlign="center" color="text.secondary">
          You don&apos;t have any results yet. Play a game to see your stats
          here.
        </Typography>
      )}

      {results.length > 0 && (
        <Stack
          component="ul"
          spacing={1}
          sx={{ listStyle: 'none', p: 0, m: 0, mt: 2 }}
        >
          {results.slice(0, 10).map((result, index) => (
            <Box
              key={result.id}
              component="li"
              data-testid="result-row"
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                py: 1,
                px: { xs: 1.5, sm: 2 },
                borderRadius: 2,
                bgcolor: 'rgba(15,23,42,0.95)',
                gap: 2,
              }}
            >
              <Typography fontWeight={500} sx={{ minWidth: '30px' }}>
                {index + 1}.
              </Typography>
              <Typography sx={{ minWidth: '80px' }}>Hits: {result.score}</Typography>
              <Typography
                variant="body2"
                sx={{
                  minWidth: '100px',
                  color: result.playerCount && result.playerCount > 1 ? 'primary.main' : 'success.main'
                }}
              >
                {result.playerCount && result.playerCount > 1 ? 'Multiplayer' : 'Singleplayer'}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ minWidth: '150px' }}>
                {new Date(result.finishedAt).toLocaleString()}
              </Typography>
            </Box>
          ))}
        </Stack>
      )}
    </Paper>
  )
}
