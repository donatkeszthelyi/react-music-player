import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import jsmediatags from 'jsmediatags';
import useSongMetadata from '../../../hooks/useSongMetadata';
import Loading from '../../Common/Loading';
import styles from './SongDropzone.module.scss';

interface SongDropzoneProps {
  setSongs: React.Dispatch<React.SetStateAction<any[]>>;
  fullScreen: boolean;
}

interface Song {
  filename: string;
  url: string;
  title?: string;
  artist?: string;
  album?: string;
  year?: string;
  lyrics?: string | null;
  image?: any;
}

function SongDropzone({ setSongs, fullScreen }: SongDropzoneProps) {
  const { fetchAlbumCover, fetchLyrics, loading, firstLoad } =
    useSongMetadata();

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      const newSongs = acceptedFiles.map((file) => {
        return new Promise<Song>((resolve) => {
          const song: Song = {
            filename: file.name.replace(/\.(mp3)$/, ''),
            url: URL.createObjectURL(file),
          };

          jsmediatags.read(file, {
            onSuccess: async (tag) => {
              song.title = tag.tags.title || song.filename;
              song.artist = tag.tags.artist || '';
              song.album = tag.tags.album || '';
              song.year = tag.tags.year || '';
              song.lyrics = await fetchLyrics(song.artist, song.title);
              song.image =
                (await fetchAlbumCover(song.artist, song.album)) ||
                tag.tags.picture;

              resolve(song);
            },
            onError: (error) => {
              console.error('Error reading ID3 tags:', error);
              resolve(song);
            },
          });
        });
      });

      Promise.all(newSongs).then((songs) => {
        setSongs((prevSongs) => [
          ...(Array.isArray(prevSongs) ? prevSongs : []),
          ...songs.sort((a, b) => a.filename.localeCompare(b.filename)),
        ]);
      });
    },
    [setSongs, fetchAlbumCover, fetchLyrics]
  );

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: { 'audio/mpeg': ['.mp3'] },
  });

  return !fullScreen ? (
    <div {...getRootProps()} className={styles.playlistDropzone}>
      <input {...getInputProps()} />
      {loading ? <Loading /> : <p>+ Drag & drop more songs here</p>}
    </div>
  ) : (
    <div {...getRootProps()} className={styles.fullscreenDropzoneBackground}>
      <div className={styles.fullscreenDropzone}>
        {firstLoad ? <Loading /> : <p>Drop your mp3 files here...</p>}
      </div>
      <input {...getInputProps()} />
    </div>
  );
}

export default SongDropzone;
