import React, { useState } from 'react';
import { BottomNavigation, BottomNavigationAction, Box } from '@mui/material';
import { QueueMusic, PlayCircle, Lyrics } from '@mui/icons-material';
import { useMediaQuery } from '@mui/material';
import styles from './Navbar.module.scss';

interface NavbarProps {
  setActiveSection: (section: string) => void;
}

const Navbar: React.FC<NavbarProps> = ({ setActiveSection }) => {
  const [activeTab, setActiveTab] = useState<string>('player');
  const isSmallScreen = useMediaQuery('(max-width: 1024px)');

  if (!isSmallScreen) return null;

  return (
    <Box className={styles.navbarContainer}>
      <BottomNavigation
        showLabels
        value={activeTab}
        onChange={(event, newValue) => {
          setActiveTab(newValue);
          setActiveSection(newValue);
        }}
        sx={{
          borderTop: '2px dashed #ccc !important',
          backgroundColor: 'rgba(190, 190, 190, 0.16) !important',
          backdropFilter: 'blur(10px) !important',
          '& .MuiBottomNavigationAction-root': {
            color: 'white !important',
          },
          '& .Mui-selected': { color: 'black !important' },
          '& .MuiBottomNavigationAction-label': {
            fontFamily: 'Space Grotesk, serif !important',
            fontWeight: 400,
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
