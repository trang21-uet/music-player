import React, {useEffect, useState} from 'react';
import {StatusBar} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import TrackPlayer, {Capability} from 'react-native-track-player';
import {MainScreen, AuthScreen, Setting, Player, PlayerMenu} from './screens';
import {AuthProvider, PlayerProvider, usePlayer} from './providers';

const Stack = createNativeStackNavigator();

const myTheme = {
  dark: true,
  colors: {
    background: '#313141',
    text: '#ccc',
  },
};

export default function App() {
  const player = usePlayer();
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
      await TrackPlayer.add(player.tracks);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    setUpPlayer();
    return () => TrackPlayer.destroy();
  }, []);

  return (
    <NavigationContainer theme={myTheme}>
      <AuthProvider>
        <StatusBar barStyle="light-content" />
        <PlayerProvider>
          <Stack.Navigator
            initialRouteName="MainScreen"
            screenOptions={{
              headerShown: false,
              animation: 'fade_from_bottom',
            }}>
            <Stack.Screen name="MainScreen" component={MainScreen} />
            <Stack.Screen name="Player" component={Player} />
            <Stack.Screen
              name="Setting"
              component={Setting}
              options={{
                headerShown: true,
                headerStyle: {backgroundColor: '#313139'},
              }}
            />
            <Stack.Screen
              name="PlayerMenu"
              component={PlayerMenu}
              options={{animation: 'slide_from_bottom'}}
            />
            <Stack.Screen name="AuthScreen" component={AuthScreen} />
          </Stack.Navigator>
        </PlayerProvider>
      </AuthProvider>
    </NavigationContainer>
  );
}
