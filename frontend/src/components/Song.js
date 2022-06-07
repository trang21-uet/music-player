import {
  Text,
  View,
  Image,
  TouchableNativeFeedback,
  TouchableOpacity,
  Modal,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {usePlayer} from '../providers';
import Pressable from './Pressable';
import TrackPlayer from 'react-native-track-player';
import MCIcon from 'react-native-vector-icons/MaterialCommunityIcons';

export default function Song({track, queue, index}) {
  const player = usePlayer();
  const [playing, setPlaying] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);

  const updateQueue = async () => {
    await TrackPlayer.destroy();
    await player.setUpPlayer(queue);
    player.setTrack(track);
    await TrackPlayer.skip(index);
    await TrackPlayer.play();
    console.info(track);
  };

  useEffect(() => {
    setPlaying(player.track?.url === track.url);
  }, [player.track]);

  return (
    <TouchableNativeFeedback onPress={updateQueue}>
      <View
        style={{
          width: '100%',
          flexDirection: 'row',
          padding: 10,
          alignItems: 'center',
          backgroundColor: playing ? '#2E7F4B' : 'transparent',
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

        <TouchableOpacity onPress={() => setModalVisible(true)}>
          <MCIcon name="playlist-plus" size={30} />
        </TouchableOpacity>

        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => setModalVisible(!modalVisible)}>
          <View
            style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
            <View
              style={{
                flexDirection: 'column',
                margin: 20,
                padding: 15,
                backgroundColor: '#414151',
                borderRadius: 10,
                shadowColor: '#918181',
                shadowOffset: {
                  width: 0,
                  height: 2,
                },
                shadowOpacity: 0.25,
                shadowRadius: 4,
                elevation: 5,
              }}>
              <View
                style={{flexDirection: 'row', justifyContent: 'space-between'}}>
                <Text style={{fontSize: 18, color: '#fff'}}>
                  Add to playlist
                </Text>
                <Pressable
                  icon="close"
                  onPress={() => setModalVisible(false)}
                />
              </View>
            </View>
          </View>
        </Modal>
      </View>
    </TouchableNativeFeedback>
  );
}
