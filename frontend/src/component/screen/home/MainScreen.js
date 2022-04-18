import React, {useEffect} from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {useRoute} from '@react-navigation/native';
import {usePlayerContext} from './AppProvider';
import TrackPlayer, {Capability} from 'react-native-track-player';
import {Home, Explore, Ranking, Profile} from './index';
import NavigationBar from '../../shared/NavigationBar';
import {PlayerWidget} from '../player/Player';
import ProfileHeader from './profile/ProfileHeader';

const Tab = createNativeStackNavigator();

export default function MainScreen() {
  const route = useRoute();
  const playerContext = usePlayerContext();
  const skipTo = async index => await TrackPlayer.skip(index);
  const setUpPlayer = async () => {
    try {
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
        ],
        notificationCapabilities: [
          Capability.Play,
          Capability.Pause,
          Capability.SkipToNext,
          Capability.SkipToPrevious,
          Capability.Stop,
        ],
      });
      await TrackPlayer.add(playerContext.tracks);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    setUpPlayer();
    skipTo(0);
    return () => TrackPlayer.destroy();
  }, []);
  return (
    <>
      <Tab.Navigator screenOptions={{headerShown: false}}>
        <Tab.Screen name="Home" component={Home} />
        <Tab.Screen name="Explore" component={Explore} />
        <Tab.Screen name="Ranking" component={Ranking} />
        <Tab.Screen
          name="Profile"
          component={Profile}
          options={{
            headerShown: true,
            headerStyle: {backgroundColor: '#313139'},
            headerTitle: () => <ProfileHeader />,
          }}
        />
      </Tab.Navigator>
      <PlayerWidget />
      <NavigationBar route={route.name} />
    </>
  );
}
