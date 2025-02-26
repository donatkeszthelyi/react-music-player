import React from 'react';
import Player from './components/Player/Player';
import { Container } from '@mui/material';

const App = () => {
  return (
    <Container>
      <div class="wrapper">
        <div class="gradient gradient-1"></div>
        <div class="gradient gradient-2"></div>
        <div class="gradient gradient-3"></div>
      </div>
      <Player />
    </Container>
  );
};

export default App;
