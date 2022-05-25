import React from 'react';
import {View, Dimensions} from 'react-native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import Home from './Home';
import {Explore, Ranking} from './Explore';
import Profile, {Upload, UserInfo, Setting, ManageSong} from './Profile';
import {NavigationBar} from '../../components';
import {PlayerWidget} from '../Player';

const Tab = createNativeStackNavigator();
const {height} = Dimensions.get('window');
const profileScreenOptions = {
  headerShown: true,
  headerStyle: {backgroundColor: '#313139'},
  animation: 'slide_from_right',
};

export default function MainScreen() {
  return (
    <View style={{flex: 1, maxHeight: height, flexDirection: 'column'}}>
      <View style={{flex: 1}}>
        <Tab.Navigator
          screenOptions={{headerShown: false, animation: 'slide_from_right'}}>
          <Tab.Screen name="Home" component={Home} />
          <Tab.Screen name="Explore" component={Explore} />
          <Tab.Screen name="Ranking" component={Ranking} />
          <Tab.Screen name="Profile" component={Profile} />

          <Tab.Screen
            name="Upload"
            component={Upload}
            options={{...profileScreenOptions, title: 'Upload song'}}
          />
          <Tab.Screen name="UserInfo" component={UserInfo} />
          <Tab.Screen
            name="Setting"
            component={Setting}
            options={profileScreenOptions}
          />
          <Tab.Screen
            name="ManageSong"
            component={ManageSong}
            options={{...profileScreenOptions, title: 'Manage songs'}}
          />
        </Tab.Navigator>
      </View>
      <PlayerWidget />
      <NavigationBar />
    </View>
  );
}
