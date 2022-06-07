import {View, Text, ScrollView, TouchableNativeFeedback} from 'react-native';
import React from 'react';
import MCIcon from 'react-native-vector-icons/MaterialCommunityIcons';

export default function Playlist({title}) {
  return (
    <TouchableNativeFeedback>
      <View
        style={{
          width: '100%',
          flexDirection: 'row',
          padding: 20,
          alignItems: 'center',
        }}>
        <MCIcon name="playlist-music-outline" size={30} />
        <Text style={{fontSize: 18, color: '#ccc', marginStart: 20}}>
          {title}
        </Text>
      </View>
    </TouchableNativeFeedback>
  );
}
