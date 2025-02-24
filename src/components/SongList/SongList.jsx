import React, { useState } from 'react';
import { List, ListItem, ListItemText } from '@mui/material';

const getMusicFiles = () => {
  const musicContext = require.context('../../assets/music', false, /\.(mp3)$/);
  return musicContext.keys().map((file) => ({
    title: file.replace('./', '').replace(/\.(mp3)$/, ''),
    url: musicContext(file),
  }));
};

const SongList = ({ onSelectSong, selectedIndex }) => {
  const songs = getMusicFiles();

  const handleSelectSong = (song, index) => {
    onSelectSong(song, index); // Call the onSelectSong function passed as prop
  };

  return (
    <div>
      <h2 variant="h6" gutterBottom>
        Select a Song
      </h2>
      <List>
        {songs.map((song, index) => (
          <ListItem
            button
            key={index}
            onClick={() => handleSelectSong(song, index)}
            sx={{
              backgroundColor:
                selectedIndex === index ? 'lightgray' : 'transparent', // Highlight selected song
              '&:hover': {
                backgroundColor:
                  selectedIndex === index ? 'lightgray' : 'rgba(0, 0, 0, 0.1)',
              },
            }}
          >
            <p>{song.title}</p>
          </ListItem>
        ))}
      </List>
    </div>
  );
};

export default SongList;
