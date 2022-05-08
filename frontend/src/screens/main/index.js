import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import Home from './Home';
import {Explore, Ranking} from './Explore';
import Profile, {ProfileHeader, Upload, UserInfo} from './Profile';
import {NavigationBar} from '../../components';
import {PlayerWidget} from '../Player';

const Tab = createNativeStackNavigator();

export default function MainScreen() {
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

        <Tab.Screen
          name="Upload"
          component={Upload}
          options={{
            headerShown: true,
            headerStyle: {backgroundColor: '#313139'},
            animation: 'slide_from_right',
            title: 'Upload song',
          }}
        />
        <Tab.Screen
          name="UserInfo"
          component={UserInfo}
          options={{
            headerShown: true,
            headerStyle: {backgroundColor: '#313139'},
            animation: 'slide_from_right',
            title: 'User information',
          }}
        />
      </Tab.Navigator>
      <PlayerWidget />
      <NavigationBar />
    </>
  );
}
