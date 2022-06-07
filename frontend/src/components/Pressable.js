import {TouchableOpacity} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import React from 'react';

export default function Pressable({style, icon, size, onPress, color}) {
  return (
    <TouchableOpacity onPress={onPress} style={style}>
      <Icon
        name={icon}
        size={size ? size : 30}
        color={color ? color : '#ccc'}
      />
    </TouchableOpacity>
  );
}
