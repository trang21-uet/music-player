import {View, Text, TouchableNativeFeedback} from 'react-native';
import React from 'react';
import MCIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import {useNavigation} from '@react-navigation/native';

export default function Playlist({id, title, style, onPress}) {
  const navigation = useNavigation();
  return (
    <TouchableNativeFeedback
      onPress={() =>
        onPress ? onPress() : navigation.navigate('PlaylistSong', {id, title})
      }>
      <View
        style={{
          width: '100%',
          flexDirection: 'row',
          padding: 20,
          alignItems: 'center',
          ...style,
        }}>
        <MCIcon name="playlist-music-outline" size={30} />
        <Text style={{fontSize: 18, color: '#ccc', marginStart: 20}}>
          {title}
        </Text>
      </View>
    </TouchableNativeFeedback>
  );
}
