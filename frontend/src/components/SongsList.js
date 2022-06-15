import {ScrollView, Text, View} from 'react-native';
import React from 'react';
import {usePlayer} from '../providers';
import Song from './Song';
import Pressable from './Pressable';
import {useNavigation, useRoute} from '@react-navigation/native';

export default function SongsList() {
  const {by, value} = useRoute().params;
  const {tracks} = usePlayer();
  const songs = tracks.filter(track => track[by] === value);
  const navigation = useNavigation();

  return (
    <View style={{flex: 1}}>
      <View style={{flexDirection: 'row', alignItems: 'center'}}>
        <Pressable
          icon="arrow-back"
          style={{padding: 15}}
          size={25}
          onPress={navigation.goBack}
        />
        <Text style={{fontSize: 18, color: '#eee'}}>{value}</Text>
      </View>
      <ScrollView>
        {songs.length === 0 ? (
          <Error status="No songs" />
        ) : (
          songs.map((song, index) => (
            <Song key={index} index={index} queue={songs} track={song} />
          ))
        )}
      </ScrollView>
    </View>
  );
}
