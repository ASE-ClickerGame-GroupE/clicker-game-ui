import React from 'react'
import LeaderboardCard from '../../components/Widgets/LeaderboardCard.tsx'
import { Box, Container, Typography } from '@mui/material'

const LeaderboardsPage: React.FC = () => {
  return (
    <Box
      sx={{
        minHeight: '100vh',
        bgcolor: '#020617',
        py: 4,
      }}
    >
      <Container maxWidth="lg">
        <Typography
          variant="h3"
          component="h1"
          textAlign="center"
          fontWeight={600}
          gutterBottom
          sx={{ mb: 4 }}
        >
          Leaderboards
        </Typography>
        <LeaderboardCard />
      </Container>
    </Box>
  )
}

export default LeaderboardsPage
