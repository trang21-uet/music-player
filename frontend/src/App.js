import React from 'react';
import {KeyboardAvoidingView, StatusBar} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {MainScreen, AuthScreen, Player, Playing, SongInfo} from './screens';
import {AuthProvider, PlayerProvider} from './providers';
import {setCustomText, setCustomTextInput} from 'react-native-global-props';

setCustomText({style: {fontFamily: 'Gotham'}});
setCustomTextInput({style: {fontFamily: 'Gotham'}});
const Stack = createNativeStackNavigator();

const myTheme = {
  dark: true,
  colors: {
    background: '#121219',
  },
};

export default function App() {
  return (
    <NavigationContainer theme={myTheme}>
      <AuthProvider>
        <StatusBar barStyle="light-content" />
        <PlayerProvider>
          <KeyboardAvoidingView
            behavior="height"
            keyboardVerticalOffset={-105}
            style={{flex: 1}}>
            <Stack.Navigator
              initialRouteName="MainScreen"
              screenOptions={{
                headerShown: false,
                animation: 'fade_from_bottom',
              }}>
              <Stack.Screen name="MainScreen" component={MainScreen} />
              <Stack.Screen name="Player" component={Player} />
              <Stack.Screen name="Playing" component={Playing} />
              <Stack.Screen name="SongInfo" component={SongInfo} />
              <Stack.Screen name="AuthScreen" component={AuthScreen} />
            </Stack.Navigator>
          </KeyboardAvoidingView>
        </PlayerProvider>
      </AuthProvider>
    </NavigationContainer>
  );
}
