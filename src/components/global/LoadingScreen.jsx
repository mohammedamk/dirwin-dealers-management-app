import { Box, CircularProgress, Typography, Fade } from '@mui/material';

const LoadingScreen = ({ message = "Loading..." }) => (
  <Fade in={true} timeout={800}>
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        gap: 2,
        background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
      }}
    >
      <CircularProgress 
        size={60} 
        thickness={4}
        sx={{
          color: 'primary.main',
        }}
      />
      <Typography 
        variant="h6" 
        color="textSecondary"
        sx={{
          fontWeight: 500,
        }}
      >
        {message}
      </Typography>
    </Box>
  </Fade>
);

export default LoadingScreen;