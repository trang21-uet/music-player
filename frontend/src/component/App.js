import React from 'react';
import {StatusBar, View, Text} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {AuthProvider} from './screen/auth/AuthProvider';
import MainScreen from './screen/home/MainScreen';
import AuthScreen from './screen/auth/AuthScreen';
import Player from './screen/player/Player';
import PlayerMenu from './screen/player/PlayerMenu';
import {PlayerProvider} from './screen/home/AppProvider';
import {Profile} from './screen/home';
import Pressable from './shared/Pressable';

const Stack = createNativeStackNavigator();

const myTheme = {
  colors: {
    background: '#313141',
    text: '#ccc',
  },
};

export default function App() {
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
