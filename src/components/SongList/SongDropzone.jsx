import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import jsmediatags from 'jsmediatags/dist/jsmediatags.min.js';

function SongDropzone({ setSongs, fullScreen }) {
  const [loading, setLoading] = useState(false);
  const [firsLoad, setFirstLoad] = useState(false);

  const fetchAlbumCover = async (artist, album) => {
    try {
      setLoading(true);
      setFirstLoad(true);
      if (!artist || !album) return null;

      const searchUrl = `https://musicbrainz.org/ws/2/release-group?query=album:${encodeURIComponent(
        album
      )} AND artist:${encodeURIComponent(artist)}&fmt=json`;

      const searchResponse = await fetch(searchUrl);
      const searchData = await searchResponse.json();

      if (
        !searchData['release-groups'] ||
        searchData['release-groups'].length === 0
      ) {
        return null;
      }

      const releaseGroupId = searchData['release-groups'][0].id;
      const coverArtUrl = `https://coverartarchive.org/release-group/${releaseGroupId}/front`;

      const coverResponse = await fetch(coverArtUrl);
      if (coverResponse.ok) {
        return coverArtUrl;
      }
    } catch (error) {
      console.error('Error fetching album cover:', error);
    } finally {
      setLoading(false);
    }
    return null;
  };

  const fetchLyrics = async (artist, title) => {
    try {
      setLoading(true);
      setFirstLoad(true);
      if (!artist || !title) return null;

      const searchUrl = `https://api.lyrics.ovh/v1/${artist
        .split(' ')
        .join('%20')}/${title.split(' ').join('%20')}`;

      const searchResponse = await fetch(searchUrl);
      const searchData = await searchResponse.json();

      if (!searchData['lyrics'] || searchData['lyrics'].length === 0) {
        return null;
      }
      return searchData['lyrics'];
    } catch (error) {
      console.error('Error fetching album cover:', error);
    } finally {
      setLoading(false);
    }
    return null;
  };

  const onDrop = useCallback(
    (acceptedFiles) => {
      const newSongs = acceptedFiles.map((file) => {
        return new Promise((resolve) => {
          const song = {
            filename: file.name.replace(/\.(mp3)$/, ''),
            url: URL.createObjectURL(file),
          };

          jsmediatags.read(file, {
            onSuccess: async (tag) => {
              song.title = tag.tags.title || song.filename;
              song.artist = tag.tags.artist || '';
              song.album = tag.tags.album || '';
              song.year = tag.tags.year || '';
              song.comments = tag.tags.comment || [];
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
    [setSongs]
  );

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: '.mp3',
  });

  return !fullScreen ? (
    <div
      {...getRootProps()}
      style={{
        border: '2px dashed #ccc',
        padding: 20,
        minWidth: '260px',
        maxWidth: '90vw',
        height: '80px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <input {...getInputProps()} />
      {loading ? (
        <div class="lds-ellipsis">
          <div></div>
          <div></div>
          <div></div>
          <div></div>
        </div>
      ) : (
        <p>+ Drag & drop more songs here</p>
      )}
    </div>
  ) : (
    <div
      {...getRootProps()}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        height: '100vh',
        width: '100vw',
        zIndex: 1000,
        background: 'transparent',
        backdropFilter: 'blur(15px)',
      }}
    >
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          height: '100%',
          fontSize: '2rem',
          marginTop: '-5rem',
          zIndex: 1000,
          textAlign: 'center',
        }}
      >
        {firsLoad ? (
          <div class="lds-ellipsis">
            <div></div>
            <div></div>
            <div></div>
            <div></div>
          </div>
        ) : (
          <p style={{ fontStyle: 'italic' }}>Drop your mp3 files here...</p>
        )}
      </div>
      <input {...getInputProps()} />
    </div>
  );
}

export default SongDropzone;
