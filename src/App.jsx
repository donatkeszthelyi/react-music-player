import React from 'react';
import Player from './components/Player/Player';
import { Box } from '@mui/material';

const App = () => {
  return (
    <Box>
      <div class="wrapper">
        <div class="gradient gradient-1"></div>
        <div class="gradient gradient-2"></div>
        <div class="gradient gradient-3"></div>
      </div>
      <Player />
    </Box>
  );
};

export default App;
