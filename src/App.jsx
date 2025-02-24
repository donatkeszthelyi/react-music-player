import React, { useState } from 'react';
import SongList from './components/SongList/SongList';
import Player from './components/Player/Player';
import { Container, CssBaseline } from '@mui/material'; // MUI Container and CssBaseline for layout

const App = () => {
  const [selectedSong, setSelectedSong] = useState(null);

  return (
    <Container>
      <h1>React Music Player</h1>
      <Player />
    </Container>
  );
};

export default App;
