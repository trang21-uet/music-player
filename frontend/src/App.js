import React from 'react';
import {StatusBar} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {MainScreen, AuthScreen, Player, PlayerMenu, Playing} from './screens';
import {AuthProvider, PlayerProvider} from './providers';

const Stack = createNativeStackNavigator();

const myTheme = {
  dark: true,
  colors: {
    background: '#212131',
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
            <Stack.Screen name="Playing" component={Playing} />
            <Stack.Screen name="AuthScreen" component={AuthScreen} />
          </Stack.Navigator>
        </PlayerProvider>
      </AuthProvider>
    </NavigationContainer>
  );
}
