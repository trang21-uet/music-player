import {Text, View, Image, TouchableNativeFeedback} from 'react-native';
import React from 'react';
import {usePlayer} from '../providers';
import Pressable from './Pressable';
import TrackPlayer from 'react-native-track-player';

export default function Song({track, queue, index}) {
  const player = usePlayer();
  const playing = player.track === track;

  const updateQueue = async () => {
    await TrackPlayer.destroy();
    await player.setUpPlayer(queue);
    player.setTrack(track);
    await TrackPlayer.skip(index);
    await TrackPlayer.play();
  };

  return (
    <TouchableNativeFeedback onPress={updateQueue}>
      <View
        style={{
          width: '100%',
          flexDirection: 'row',
          paddingVertical: 10,
          paddingHorizontal: 10,
          alignItems: 'center',
          backgroundColor: playing ? '#2E8B57' : 'transparent',
          borderRadius: 10,
        }}>
        <Image
          source={{uri: `http://localhost:8080/images/${track.coverImage}`}}
          style={{width: 50, height: 50, borderRadius: 10}}
        />
        <View style={{flex: 1, marginStart: 20}}>
          <View style={{width: '80%'}}>
            <Text
              numberOfLines={1}
              style={{
                fontSize: 16,
                fontWeight: '600',
                color: playing ? '#000' : '#fff',
              }}>
              {track.title}
            </Text>
          </View>
          <View style={{width: '80%'}}>
            <Text
              numberOfLines={1}
              style={{
                fontSize: 12,
                fontWeight: '400',
                color: playing ? '#333' : '#ccc',
              }}>
              {track.artist}
            </Text>
          </View>
        </View>

        <Pressable icon="ellipsis-vertical" size={20} />
      </View>
    </TouchableNativeFeedback>
  );
}
