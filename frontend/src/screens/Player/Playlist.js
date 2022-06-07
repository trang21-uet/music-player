import {Text, View, ScrollView} from 'react-native';
import React, {useEffect, useState} from 'react';
import {Pressable, Song} from '../../components';
import {useNavigation} from '@react-navigation/native';
import TrackPlayer from 'react-native-track-player';

const SongList = ({tracks}) => {
  return (
    <ScrollView>
      {tracks.length > 0 &&
        tracks.map((track, index) => (
          <Song track={track} key={index} queue={tracks} />
        ))}
    </ScrollView>
  );
};

export default function Playlist() {
  const navigation = useNavigation();
  const [queue, setQueue] = useState([]);

  useEffect(() => {
    const getCurrentQueue = async () => {
      const currentQueue = await TrackPlayer.getQueue();
      setQueue(currentQueue);
    };
    getCurrentQueue();
  }, []);
  return (
    <View style={{flex: 1}}>
      <View style={{flexDirection: 'row'}}>
        <Pressable
          icon="arrow-back"
          style={{paddingHorizontal: 20, paddingVertical: 10}}
          onPress={() => navigation.goBack()}
        />
      </View>
      <Text
        style={{
          marginStart: 10,
          marginBottom: 20,
          fontWeight: '600',
          fontSize: 20,
          color: '#fff',
        }}>
        Playing
      </Text>
      <SongList tracks={queue} />
    </View>
  );
}