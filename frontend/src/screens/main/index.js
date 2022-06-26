import React from 'react';
import {View, Dimensions} from 'react-native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import Home from './Home';
import {Explore, Ranking} from './Explore';
import Profile, {
  Upload,
  UserInfo,
  ManageSong,
  Playlists,
  PlaylistSong,
  AddSongToPlaylist,
} from './Profile';
import {NavigationBar, SongsList} from '../../components';
import {PlayerWidget} from '../Player';

const Tab = createNativeStackNavigator();
const {height} = Dimensions.get('window');

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
          <Tab.Screen name="SongsList" component={SongsList} />
          <Tab.Screen name="Upload" component={Upload} />
          <Tab.Screen name="UserInfo" component={UserInfo} />
          <Tab.Screen name="ManageSong" component={ManageSong} />
          <Tab.Screen name="Playlists" component={Playlists} />
          <Tab.Screen name="PlaylistSong" component={PlaylistSong} />
          <Tab.Screen name="AddSongToPlaylist" component={AddSongToPlaylist} />
        </Tab.Navigator>
      </View>
      <PlayerWidget />
      <NavigationBar />
    </View>
  );
}
