import React from 'react';
import {StatusBar} from 'react-native';
import {NavigationContainer, DarkTheme} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {AuthProvider} from './screen/auth/AuthProvider';
import MainScreen from './screen/home/MainScreen';
import AuthScreen from './screen/auth/AuthScreen';
import Player from './screen/player/Player';
import PlayerMenu from './screen/player/PlayerMenu';
import {PlayerProvider} from './screen/home/AppProvider';
import Setting from './screen/home/profile/Setting';

const Stack = createNativeStackNavigator();

const myTheme = {
  dark: true,
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
