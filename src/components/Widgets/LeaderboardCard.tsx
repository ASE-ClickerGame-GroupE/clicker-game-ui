import React, { useState } from 'react'
import {
  Box,
  Card,
  CardContent,
  Chip,
  Tab,
  Tabs,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material'
import {
  useLeaderBoard,
  type LeaderboardMode,
  type LeaderboardRowUI,
} from '../../hooks/useLeaderBoard/useLeaderBoard.ts'

const TAB_STYLES = {
  minHeight: 44,
  '& .MuiTabs-indicator': { height: 3 },
} as const

const columnHeaderSx = { color: 'rgba(255,255,255,0.75)' } as const
const cellSx = { color: 'rgba(255,255,255,0.9)' } as const

const LeaderboardCard: React.FC = () => {
  const [mode, setMode] = useState<LeaderboardMode>('total')

  const { rows, isLoading, isError } = useLeaderBoard(mode)

  const rowsForRender: LeaderboardRowUI[] = rows

  const subtitle =
    mode === 'total'
      ? 'Total Score — Final score achieved in the time limit'
      : 'Best Single Run — Highest score achieved in one session'

  return (
    <Card
      sx={{
        bgcolor: 'rgba(15,23,42,0.9)',
        borderRadius: 4,
        boxShadow: 'inset 0 0 0 1px rgba(148,163,184,0.2)',
      }}
    >
      <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
        <Box sx={{ mb: 2 }}>
          <Typography variant="h6" fontWeight={600}>
            Leaderboard
          </Typography>
          <Typography variant="body2" sx={{ opacity: 0.8 }}>
            {subtitle}
          </Typography>
        </Box>

        <Tabs
          value={mode}
          onChange={(_, v: LeaderboardMode) => setMode(v)}
          sx={TAB_STYLES}
        >
          <Tab value="total" label="Total Score" />
          <Tab value="best" label="Best Single Run" />
        </Tabs>

        <Box sx={{ mt: 2, overflowX: 'auto' }}>
          {isLoading && (
            <Typography variant="body2" sx={{ opacity: 0.8 }}>
              Loading...
            </Typography>
          )}

          {isError && (
            <Typography variant="body2" sx={{ opacity: 0.8 }}>
              Failed to load leaderboard.
            </Typography>
          )}

          {!isLoading && !isError && (
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell sx={columnHeaderSx}>Ranking</TableCell>
                  <TableCell sx={columnHeaderSx}>User</TableCell>
                  <TableCell sx={columnHeaderSx} align="right">
                    Total games
                  </TableCell>
                  <TableCell sx={columnHeaderSx} align="right">
                    {mode === 'total' ? 'Total score' : 'Best score'}
                  </TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {rowsForRender.map((row) => {
                  const isMe = row.isMe === true

                  return (
                    <TableRow
                      key={row.id}
                      sx={{
                        bgcolor: isMe ? 'rgba(96,165,250,0.12)' : 'transparent',
                        '& td': {
                          borderBottom: '1px solid rgba(148,163,184,0.15)',
                        },
                      }}
                    >
                      <TableCell sx={cellSx}>{row.place}</TableCell>

                      <TableCell sx={cellSx}>
                        <Box
                          sx={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 1,
                          }}
                        >
                          <Typography variant="body2">{row.userName}</Typography>
                          {isMe && <Chip size="small" label="You" />}
                        </Box>
                      </TableCell>

                      <TableCell sx={cellSx} align="right">
                        {row.totalGames}
                      </TableCell>

                      <TableCell sx={cellSx} align="right">
                        {row.score}
                      </TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          )}

          <Typography
            variant="caption"
            sx={{ display: 'block', mt: 1, opacity: 0.7 }}
          >
            If you are logged in, you are always shown at the top with your
            global rank.
          </Typography>
        </Box>
      </CardContent>
    </Card>
  )
}

export default LeaderboardCard
