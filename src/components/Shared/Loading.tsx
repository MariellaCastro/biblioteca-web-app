import React from 'react';
import { Box, CircularProgress, Typography } from '@mui/material';

interface LoadingProps {
  message?: string;
}

const Loading: React.FC<LoadingProps> = ({ message = 'Cargando...' }) => {
  return (
    <Box
      display="flex"
      flexDirection="column"
      justifyContent="center"
      alignItems="center"
      minHeight="300px"
    >
      <CircularProgress size={60} thickness={4} />
      <Typography variant="body1" color="textSecondary" sx={{ mt: 3 }}>
        {message}
      </Typography>
    </Box>
  );
};

export default Loading;