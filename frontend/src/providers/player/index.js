import React, {createContext, useState, useEffect} from 'react';
import TrackPlayer, {Capability} from 'react-native-track-player';
import {Loading, Error} from '../../components';

const PlayerContext = createContext(null);

const PlayerProvider = ({children}) => {
  const [tracks, setTracks] = useState([]);
  const [track, setTrack] = useState({});
  const [status, setStatus] = useState('loading');

  const setUpPlayer = async () => {
    try {
      const controller = new AbortController();
      const id = setTimeout(() => controller.abort(), 10000);

      const response = await fetch('http://localhost:8080/songs', {
        method: 'GET',
        signal: controller.signal,
      });
      clearTimeout(id);
      const data = await response.json();
      if (data.length === 0) {
        setStatus('No song');
      } else {
        setTracks(data);
        setTrack(data[0]);

        await TrackPlayer.setupPlayer();
        await TrackPlayer.updateOptions({
          stopWithApp: false,
          capabilities: [
            Capability.Play,
            Capability.Pause,
            Capability.SkipToNext,
            Capability.SkipToPrevious,
            Capability.Stop,
          ],
          compactCapabilities: [
            Capability.Play,
            Capability.Pause,
            Capability.SkipToNext,
            Capability.SkipToPrevious,
            Capability.Stop,
          ],
        });
        await TrackPlayer.add(data);
        setStatus('success');
      }
    } catch (error) {
      setStatus(error.message);
    }
  };

  useEffect(() => {
    setUpPlayer();
    return TrackPlayer.destroy();
  }, []);

  return (
    <PlayerContext.Provider value={{tracks, track, setTrack}}>
      {status === 'loading' && <Loading />}
      {(status === 'Aborted' || status === 'Network request failed') && (
        <Error status={'Network request failed'} />
      )}
      {status === 'No song' && children}
      {status === 'success' && children}
    </PlayerContext.Provider>
  );
};

const usePlayer = () => {
  return React.useContext(PlayerContext);
};

export {PlayerProvider, usePlayer};
