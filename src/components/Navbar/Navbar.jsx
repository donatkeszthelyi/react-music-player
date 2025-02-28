import React, { useState } from 'react';
import { BottomNavigation, BottomNavigationAction, Box } from '@mui/material';
import { QueueMusic, PlayCircle, Lyrics } from '@mui/icons-material';
import { useMediaQuery } from '@mui/material';

const Navbar = ({ setActiveSection }) => {
  const [activeTab, setActiveTab] = useState('player');
  const isSmallScreen = useMediaQuery('(max-width: 1024px)');

  if (!isSmallScreen) return null;

  return (
    <Box position="fixed" bottom={0} left={0} right={0} zIndex={1000}>
      <BottomNavigation
        showLabels
        value={activeTab}
        onChange={(event, newValue) => {
          setActiveTab(newValue);
          setActiveSection(newValue);
        }}
        sx={{
          borderTop: '2px dashed #ccc',
          backgroundColor: '#bebebe28',
          '& .MuiBottomNavigationAction-root': {
            color: 'white',
          },
          '& .Mui-selected': {
            color: 'black',
          },
        }}
      >
        <BottomNavigationAction
          label="Playlist"
          value="playlist"
          icon={<QueueMusic />}
        />
        <BottomNavigationAction
          label="Player"
          value="player"
          icon={<PlayCircle />}
        />
        <BottomNavigationAction
          label="Lyrics"
          value="lyrics"
          icon={<Lyrics />}
        />
      </BottomNavigation>
    </Box>
  );
};

export default Navbar;
