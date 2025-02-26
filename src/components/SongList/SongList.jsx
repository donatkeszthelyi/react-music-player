import React from 'react';
import { Box, Container, List, ListItem } from '@mui/material';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';

const SongList = ({ songs, setSongs, onSelectSong, selectedIndex }) => {
  const handleOnDragEnd = (result) => {
    const { source, destination } = result;

    if (!destination) return;

    const updatedSongs = Array.from(songs);
    const [movedSong] = updatedSongs.splice(source.index, 1);
    updatedSongs.splice(destination.index, 0, movedSong);

    setSongs(updatedSongs);

    let newSelectedIndex = selectedIndex;
    if (selectedIndex === source.index) {
      newSelectedIndex = destination.index;
    } else if (
      selectedIndex > source.index &&
      selectedIndex <= destination.index
    ) {
      newSelectedIndex -= 1;
    } else if (
      selectedIndex < source.index &&
      selectedIndex >= destination.index
    ) {
      newSelectedIndex += 1;
    }

    onSelectSong(updatedSongs[newSelectedIndex], newSelectedIndex);
  };

  return (
    <Box id="song-list">
      <DragDropContext onDragEnd={handleOnDragEnd}>
        <Droppable droppableId="songlist-droppable">
          {(provided) => (
            <List ref={provided.innerRef} {...provided.droppableProps}>
              {songs.map((song, index) => (
                <Draggable key={song.url} draggableId={song.url} index={index}>
                  {(provided) => (
                    <Container
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      ref={provided.innerRef}
                    >
                      <ListItem
                        button
                        onClick={() => onSelectSong(song, index)}
                        sx={{
                          backgroundColor:
                            selectedIndex === index
                              ? 'rgba(0, 0, 0, 0.2)'
                              : 'transparent',
                          '&:hover': { backgroundColor: 'rgba(0, 0, 0, 0.1)' },
                        }}
                      >
                        <p>{song.filename}</p>
                      </ListItem>
                    </Container>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </List>
          )}
        </Droppable>
      </DragDropContext>
    </Box>
  );
};

export default SongList;
