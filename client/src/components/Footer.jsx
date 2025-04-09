import { Box, Typography, Grid, Link, IconButton } from '@mui/material';
import { GitHub, LinkedIn, Email, LocationOn } from '@mui/icons-material';

export default function Footer() {
  return (
    <Box
      component="footer"
      sx={{
        backgroundColor: '#111',
        color: '#ccc',
        py: 3,
        px: 4,
        mt: 'auto',
        border: '2px solid red',

      }}
    >
      <Grid container spacing={3} justifyContent="space-evenly">
        {/* Section 1: Copyright */}
        <Grid item xs={12} md={4}>
          <Typography variant="body2" sx={{ textAlign: { xs: 'center', md: 'left' } }}>
            © 2025 CodeCollab. All rights reserved.
          </Typography>
        </Grid>

        {/* Section 2: Contact Info */}
        <Grid item xs={12} md={4}>
          <Box sx={{ textAlign: 'center' }}>
            <Typography variant="body2" sx={{ mb: 1 }}>Contact Us</Typography>
            <Typography variant="body2" sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 1 }}>
              <Email fontSize="small" /> contact@codecollab.com
            </Typography>
            <Typography variant="body2" sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 1 }}>
              <LocationOn fontSize="small" /> Gurugram, India
            </Typography>
          </Box>
        </Grid>

        {/* Section 3: Social Media Links */}
        <Grid item xs={12} md={4}>
          <Box sx={{ textAlign: { xs: 'center', md: 'right' } }}>
            <Typography variant="body2" sx={{ mb: 1 }}>Follow Us</Typography>
            <IconButton
              component="a"
              href="https://github.com/Ashish-Redhu"
              target="_blank"
              rel="noopener noreferrer"
              sx={{ color: '#ccc' }}
            >
              <GitHub />
            </IconButton>
            <IconButton
              component="a"
              href="https://www.linkedin.com/in/ashish-redhu/"
              target="_blank"
              rel="noopener noreferrer"
              sx={{ color: '#ccc' }}
            >
              <LinkedIn />
            </IconButton>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
}
