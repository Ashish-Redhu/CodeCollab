import { Box, Typography, Button, Stack, Divider } from '@mui/material';
import { styled } from '@mui/system';
import GoogleIcon from '@mui/icons-material/Google';
import GitHubIcon from '@mui/icons-material/GitHub';
const serverUrl = import.meta.env.VITE_SERVER_URL;
const Background = styled(Box)(({ theme }) => ({
  backgroundImage: 'url("https://source.unsplash.com/1600x900/?coding,technology")',
  backgroundSize: 'cover',
  backgroundPosition: 'center',
  height: '100%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}));



const Overlay = styled(Box)(({ theme }) => ({
  backgroundColor: 'rgba(0, 0, 0, 0.6)',
  padding: theme.spacing(6),
  borderRadius: theme.shape.borderRadius * 2,
  textAlign: 'center',
  color: '#fff',
  maxWidth: 500,
}));

export default function LandingPage() {

  return (
    <Background>
      <Overlay>
        <Typography variant="h3" fontWeight="bold" gutterBottom>
          Welcome to CodeCollab
        </Typography>
        <Typography variant="h6" gutterBottom>
          Collaborate. Code. Connect.
        </Typography>

        <Stack direction="row" spacing={3} justifyContent="center" mt={4}>
          <Button variant="contained" color="primary" size="large"  component="a" href="/login">
            Login
          </Button>
          <Button variant="outlined" color="secondary" size="large" component="a" href="/register">
            Register
          </Button>
        </Stack>

        <Divider sx={{ my: 3, color: '#fff' }}>OR</Divider>

        <Stack spacing={2}>
          <Button
            variant="contained"
            startIcon={<GoogleIcon />}
            sx={{ backgroundColor: '#DB4437', color: '#fff' }}
            fullWidth
            onClick={() => window.location.href = `${serverUrl}/api/auth/google`}
          >
            Continue with Google
          </Button>

          <Button
            variant="contained"
            startIcon={<GitHubIcon />}
            sx={{ backgroundColor: '#333', color: '#fff' }}
            fullWidth
            onClick={() => window.location.href = `${serverUrl}/api/auth/github`}
          >
            Continue with GitHub
          </Button>
        </Stack>
      </Overlay>
    </Background>
  );
}
