import React from 'react'
import { Box, Container, Grid, Divider } from '@mui/material'
import Navbar from '../components/Shared/Navbar.jsx'
import Footer from '../components/Shared/Footer.jsx'
import JoinRoomCard from '../components/JoinRoomCard.jsx'
import CreateRoomCard from '../components/CreateRoomCard.jsx'

export default function Home() {
  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Navbar />

      {/* Main Content */}
      <Box sx={{ flexGrow: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', py: 8 }}>
        <Container maxWidth="xl">
          <Grid
            container
            spacing={2}
            justifyContent="center"
            alignItems="stretch"
          >
            <Grid item xs={12} md={6}>
              <JoinRoomCard />
            </Grid>

            <Grid item md={1} sx={{ display: { xs: 'none', md: 'flex' }, justifyContent: 'center', alignItems: 'center' }}>
              <Divider orientation="vertical" sx={{ height: '80%', backgroundColor: '#888' }} />
            </Grid>

            <Grid item xs={12} md={6}>
              <CreateRoomCard />
            </Grid>
          </Grid>
        </Container>
      </Box>

      <Footer />
    </Box>
  )
}
