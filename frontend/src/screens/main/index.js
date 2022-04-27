import React, {useEffect} from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import Home from './Home';
import {Explore, Ranking} from './Explore';
import Profile, {ProfileHeader} from './Profile';
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
      </Tab.Navigator>
      <PlayerWidget />
      <NavigationBar />
    </>
  );
}
