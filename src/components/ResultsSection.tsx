import React from 'react'
import { Box, Paper, Stack, Typography } from '@mui/material'
import type { IResult } from '../api/fetch-results'

type ResultsSectionProps = {
  results: IResult[]
  loading: boolean
  error: unknown
}

export const ResultsSection: React.FC<ResultsSectionProps> = ({
  results,
  loading,
  error,
}) => {
  const errorMessage =
    error instanceof Error ? error.message : error ? 'Failed to load results' : null

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
      <Typography
        variant="h6"
        textAlign="center"
        gutterBottom
      >
        Your Top 10 Results
      </Typography>

      {loading && (
        <Typography textAlign="center" color="text.secondary">
          Loading results…
        </Typography>
      )}

      {errorMessage && !loading && (
        <Typography textAlign="center" color="error">
          {errorMessage}
        </Typography>
      )}

      {!loading && !errorMessage && results.length === 0 && (
        <Typography textAlign="center" color="text.secondary">
          You don&apos;t have any results yet. Play a game to see your stats
          here.
        </Typography>
      )}

      {!loading && !errorMessage && results.length > 0 && (
        <Stack
          component="ul"
          spacing={1}
          sx={{ listStyle: 'none', p: 0, m: 0, mt: 2 }}
        >
          {results.slice(0, 10).map((result, index) => (
            <Box
              key={result.id}
              component="li"
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                py: 1,
                px: { xs: 1.5, sm: 2 },
                borderRadius: 2,
                bgcolor: 'rgba(15,23,42,0.95)',
              }}
            >
              <Typography fontWeight={500}>{index + 1}.</Typography>
              <Typography>Hits: {result.scores}</Typography>
              <Typography variant="body2" color="text.secondary">
                {new Date(result.finishedAt).toLocaleString()}
              </Typography>
            </Box>
          ))}
        </Stack>
      )}
    </Paper>
  )
}
