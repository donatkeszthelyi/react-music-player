import React from 'react';
import { Box, Container, List, ListItem } from '@mui/material';
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
} from '@hello-pangea/dnd';
import SongDropzone from '../SongDropzone/SongDropzone';
import styles from './SongList.module.scss';

interface Song {
  filename: string;
  url: string;
  [key: string]: any;
}

interface SongListProps {
  songs: Song[];
  setSongs: React.Dispatch<React.SetStateAction<Song[]>>;
  onSelectSong: (song: Song, index: number) => void;
  selectedIndex: number;
}

const SongList: React.FC<SongListProps> = ({
  songs,
  setSongs,
  onSelectSong,
  selectedIndex,
}) => {
  const handleOnDragEnd = (result: DropResult) => {
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
    <Box className={styles.songList}>
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
                        onClick={() => onSelectSong(song, index)}
                        sx={{
                          backgroundColor:
                            selectedIndex === index
                              ? 'rgba(85, 85, 85, 0.2)'
                              : 'transparent',
                          '&:hover': {
                            backgroundColor: 'rgba(85, 85, 85, 0.1)',
                          },
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
      {songs.length !== 0 && (
        <SongDropzone setSongs={setSongs} fullScreen={false} />
      )}
    </Box>
  );
};

export default SongList;
export type { Song };
