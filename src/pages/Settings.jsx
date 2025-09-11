import { Typography, Box } from '@mui/material';

export default function Settings() {
  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Settings
      </Typography>
      <Typography variant="body1" color="textSecondary">
        This is the settings page. You can configure your application preferences here.
      </Typography>
    </Box>
  );
}