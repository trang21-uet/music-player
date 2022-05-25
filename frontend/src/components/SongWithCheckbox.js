import {Text, View, Image, TouchableNativeFeedback} from 'react-native';
import React, {useRef} from 'react';
import BouncyCheckbox from 'react-native-bouncy-checkbox';

export default function SongWithCheckbox({track, checked, onCheck}) {
  const checkboxRef = useRef();

  return (
    <TouchableNativeFeedback onPress={checkboxRef.current.onPress}>
      <View
        style={{
          width: '100%',
          flexDirection: 'row',
          paddingVertical: 10,
          paddingHorizontal: 10,
          alignItems: 'center',
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
                color: '#fff',
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
                color: '#ccc',
              }}>
              {track.artist}
            </Text>
          </View>
        </View>
        <BouncyCheckbox
          size={20}
          ref={checkboxRef}
          isChecked={checked}
          fillColor="#2E8B57"
          onPress={checked => onCheck(!checked)}
        />
      </View>
    </TouchableNativeFeedback>
  );
}
