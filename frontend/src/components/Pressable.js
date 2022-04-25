import {TouchableOpacity} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import React from 'react';

export default function Pressable({style, icon, size, onPress}) {
  return (
    <TouchableOpacity onPress={onPress} style={style}>
      <Icon name={icon} size={size ? size : 30} style={{color: '#ccc'}} />
    </TouchableOpacity>
  );
}
