import React, {createContext, useState, useEffect} from 'react';
import TrackPlayer, {Capability} from 'react-native-track-player';
import {Loading} from '../../components';

const PlayerContext = createContext(null);

const PlayerProvider = ({children}) => {
  const [tracks, setTracks] = useState();
  const [track, setTrack] = useState();
  const [loading, setLoading] = useState(true);

  const setUpPlayer = async () => {
    try {
      const response = await fetch('http://192.168.1.20:8080/songs');
      const data = await response.json();
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
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setUpPlayer();
    return TrackPlayer.destroy();
  }, []);

  return (
    <PlayerContext.Provider value={{tracks, track, setTrack, loading}}>
      {loading ? <Loading /> : children}
    </PlayerContext.Provider>
  );
};

const usePlayer = () => {
  return React.useContext(PlayerContext);
};

export {PlayerProvider, usePlayer};
