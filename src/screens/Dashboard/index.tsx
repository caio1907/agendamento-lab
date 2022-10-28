import { Box, Typography } from '@mui/material';
import React from 'react';

const Dashboard:React.FC = () => {
  return (
    <Box sx={{
      display: 'flex',
      height: '100%',
      width: '100%',
      flex: 1,
      position: 'fixed',
      alignItems: 'center'
    }}>
      <Typography
        component='h1'
        variant='h1'
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
        Edit src/screens/Dashboard/index.tsx
      </Typography>
    </Box>
  )
}
export default Dashboard;
